"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Project_1 = require("../models/Project");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const project_1 = require("../validation/project");
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
exports.projectRoutes = router;
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tags } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = {
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
        const projects = await Project_1.Project.find(query)
            .populate('ownerId', 'name email profile.avatarUrl')
            .populate('collaborators.userId', 'name email profile.avatarUrl')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Project_1.Project.countDocuments(query);
        res.json({
            projects,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/public', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tags, sort = 'recent' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = { public: true };
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
        let sortQuery = { updatedAt: -1 };
        if (sort === 'popular') {
            sortQuery = { 'stats.likes': -1, 'stats.views': -1 };
        }
        else if (sort === 'views') {
            sortQuery = { 'stats.views': -1 };
        }
        const projects = await Project_1.Project.find(query)
            .populate('ownerId', 'name email profile.avatarUrl')
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));
        const total = await Project_1.Project.countDocuments(query);
        res.json({
            projects,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get public projects error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id', auth_1.optionalAuth, async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id)
            .populate('ownerId', 'name email profile.avatarUrl')
            .populate('collaborators.userId', 'name email profile.avatarUrl');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const hasAccess = project.public ||
            (req.user && (project.ownerId.toString() === req.user.userId ||
                project.collaborators.some(c => c.userId.toString() === req.user.userId)));
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }
        if (!req.user || project.ownerId.toString() !== req.user.userId) {
            await Project_1.Project.findByIdAndUpdate(req.params.id, {
                $inc: { 'stats.views': 1 }
            });
        }
        res.json(project);
    }
    catch (error) {
        logger_1.logger.error('Get project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', auth_1.authMiddleware, (0, validation_1.validateRequest)(project_1.projectValidation.create), async (req, res) => {
    try {
        const project = new Project_1.Project({
            ...req.body,
            ownerId: req.user.userId,
            versions: [{
                    versionId: (0, uuid_1.v4)(),
                    snapshot: {
                        designJson: req.body.designJson || { elements: [], canvasSize: { width: 1200, height: 800 } },
                        code: req.body.code || { html: '', css: '', js: '', framework: 'plain' }
                    },
                    createdBy: new mongoose_1.default.Types.ObjectId(req.user.userId),
                    message: 'Initial version'
                }]
        });
        await project.save();
        await project.populate('ownerId', 'name email profile.avatarUrl');
        res.status(201).json(project);
        logger_1.logger.info(`Project created: ${project._id} by ${req.user.userId}`);
    }
    catch (error) {
        logger_1.logger.error('Create project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const canEdit = project.ownerId.toString() === req.user.userId ||
            project.collaborators.some(c => c.userId.toString() === req.user.userId && c.role === 'editor');
        if (!canEdit) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const { createVersion, versionMessage, ...updateData } = req.body;
        if (createVersion) {
            project.versions.push({
                versionId: (0, uuid_1.v4)(),
                snapshot: {
                    designJson: updateData.designJson || project.designJson,
                    code: updateData.code || project.code
                },
                createdBy: new mongoose_1.default.Types.ObjectId(req.user.userId),
                createdAt: new Date(),
                message: versionMessage || 'Updated version'
            });
        }
        Object.assign(project, updateData);
        await project.save();
        await project.populate('ownerId', 'name email profile.avatarUrl');
        res.json(project);
        logger_1.logger.info(`Project updated: ${project._id} by ${req.user.userId}`);
    }
    catch (error) {
        logger_1.logger.error('Update project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        await Project_1.Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
        logger_1.logger.info(`Project deleted: ${req.params.id} by ${req.user.userId}`);
    }
    catch (error) {
        logger_1.logger.error('Delete project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/:id/collaborators', auth_1.authMiddleware, async (req, res) => {
    try {
        const { email, role = 'viewer' } = req.body;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const User = require('../models/User').User;
        const collaborator = await User.findOne({ email });
        if (!collaborator) {
            return res.status(404).json({ error: 'User not found' });
        }
        const existingCollaborator = project.collaborators.find(c => c.userId.toString() === collaborator._id.toString());
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
    }
    catch (error) {
        logger_1.logger.error('Add collaborator error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/:id/like', auth_1.authMiddleware, async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const liked = req.body.liked;
        const increment = liked ? 1 : -1;
        await Project_1.Project.findByIdAndUpdate(req.params.id, {
            $inc: { 'stats.likes': increment }
        });
        res.json({ message: liked ? 'Project liked' : 'Project unliked' });
    }
    catch (error) {
        logger_1.logger.error('Like project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=projects.js.map