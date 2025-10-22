import express from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { projectValidation } from '../validation/project';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get user projects
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, search, tags } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId }
      ]
    };

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const projects = await Project.find(query)
      .populate('ownerId', 'name email profile.avatarUrl')
      .populate('collaborators.userId', 'name email profile.avatarUrl')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get public projects
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sort = 'recent' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { public: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    let sortQuery: any = { updatedAt: -1 };
    if (sort === 'popular') {
      sortQuery = { 'stats.likes': -1, 'stats.views': -1 };
    } else if (sort === 'views') {
      sortQuery = { 'stats.views': -1 };
    }

    const projects = await Project.find(query)
      .populate('ownerId', 'name email profile.avatarUrl')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get public projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'name email profile.avatarUrl')
      .populate('collaborators.userId', 'name email profile.avatarUrl');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check access permissions
    const hasAccess = project.public || 
      (req.user && (
        project.ownerId.toString() === req.user.userId ||
        project.collaborators.some(c => c.userId.toString() === req.user.userId)
      ));

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment view count
    if (!req.user || project.ownerId.toString() !== req.user.userId) {
      await Project.findByIdAndUpdate(req.params.id, {
        $inc: { 'stats.views': 1 }
      });
    }

    res.json(project);
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project
router.post('/', authMiddleware, validateRequest(projectValidation.create), async (req: AuthRequest, res) => {
  try {
    const project = new Project({
      ...req.body,
      ownerId: req.user.userId,
      versions: [{
        versionId: uuidv4(),
        snapshot: {
          designJson: req.body.designJson || { elements: [], canvasSize: { width: 1200, height: 800 } },
          code: req.body.code || { html: '', css: '', js: '', framework: 'plain' }
        },
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
        message: 'Initial version'
      }]
    });

    await project.save();
    await project.populate('ownerId', 'name email profile.avatarUrl');

    res.status(201).json(project);
    logger.info(`Project created: ${project._id} by ${req.user.userId}`);
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permissions
    const canEdit = project.ownerId.toString() === req.user.userId ||
      project.collaborators.some(c => 
        c.userId.toString() === req.user.userId && c.role === 'editor'
      );

    if (!canEdit) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create new version if significant changes
    const { createVersion, versionMessage, ...updateData } = req.body;
    
    if (createVersion) {
      project.versions.push({
        versionId: uuidv4(),
        snapshot: {
          designJson: updateData.designJson || project.designJson,
          code: updateData.code || project.code
        },
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
        createdAt: new Date(),
        message: versionMessage || 'Updated version'
      });
    }

    Object.assign(project, updateData);
    await project.save();
    await project.populate('ownerId', 'name email profile.avatarUrl');

    res.json(project);
    logger.info(`Project updated: ${project._id} by ${req.user.userId}`);
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
    logger.info(`Project deleted: ${req.params.id} by ${req.user.userId}`);
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add collaborator
router.post('/:id/collaborators', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { email, role = 'viewer' } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find user by email
    const User = require('../models/User').User;
    const collaborator = await User.findOne({ email });

    if (!collaborator) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a collaborator
    const existingCollaborator = project.collaborators.find(
      c => c.userId.toString() === collaborator._id.toString()
    );

    if (existingCollaborator) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }

    project.collaborators.push({
      userId: collaborator._id,
      role,
      addedAt: new Date()
    });

    await project.save();
    await project.populate('collaborators.userId', 'name email profile.avatarUrl');

    res.json(project);
  } catch (error) {
    logger.error('Add collaborator error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like/Unlike project
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Toggle like (simplified - in production, track individual likes)
    const liked = req.body.liked;
    const increment = liked ? 1 : -1;

    await Project.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.likes': increment }
    });

    res.json({ message: liked ? 'Project liked' : 'Project unliked' });
  } catch (error) {
    logger.error('Like project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as projectRoutes };