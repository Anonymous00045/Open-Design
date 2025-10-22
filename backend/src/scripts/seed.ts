import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { logger } from '../utils/logger';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/opendesign');
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data (optional - comment out in production)
    await User.deleteMany({});
    await Project.deleteMany({});
    logger.info('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoUsers = [
      {
        email: 'demo@opendesign.com',
        name: 'Demo User',
        password: hashedPassword,
        role: 'user',
        verified: true
      },
      {
        email: 'admin@opendesign.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
        verified: true
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    logger.info(`Created ${createdUsers.length} demo users`);

    // Create demo projects
    const demoProjects = [
      {
        title: 'Landing Page Design',
        description: 'Modern landing page with hero section and features',
        ownerId: createdUsers[0]._id,
        public: true,
        tags: ['landing', 'modern', 'responsive'],
        designJson: {
          elements: [
            {
              id: 'hero-section',
              type: 'section',
              properties: {
                backgroundColor: '#f8fafc',
                padding: '80px 20px',
                textAlign: 'center'
              },
              children: [
                {
                  id: 'hero-title',
                  type: 'h1',
                  content: 'Welcome to Open Design',
                  properties: {
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '20px'
                  }
                },
                {
                  id: 'hero-subtitle',
                  type: 'p',
                  content: 'Create beautiful designs with AI assistance',
                  properties: {
                    fontSize: '20px',
                    color: '#6b7280',
                    marginBottom: '40px'
                  }
                }
              ]
            }
          ],
          canvasSize: { width: 1200, height: 800 },
          version: '1.0.0'
        },
        code: {
          html: `<section class="hero-section">
  <h1 class="hero-title">Welcome to Open Design</h1>
  <p class="hero-subtitle">Create beautiful designs with AI assistance</p>
</section>`,
          css: `.hero-section {
  background-color: #f8fafc;
  padding: 80px 20px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 40px;
}`,
          js: '// Add interactive functionality here',
          framework: 'plain'
        }
      },
      {
        title: 'Dashboard Components',
        description: 'Reusable dashboard components and layouts',
        ownerId: createdUsers[0]._id,
        public: true,
        tags: ['dashboard', 'components', 'admin'],
        designJson: {
          elements: [
            {
              id: 'dashboard-card',
              type: 'div',
              properties: {
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              },
              children: [
                {
                  id: 'card-title',
                  type: 'h3',
                  content: 'Analytics Overview',
                  properties: {
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px'
                  }
                }
              ]
            }
          ],
          canvasSize: { width: 1200, height: 600 },
          version: '1.0.0'
        },
        code: {
          html: `<div class="dashboard-card">
  <h3 class="card-title">Analytics Overview</h3>
  <!-- Add chart or content here -->
</div>`,
          css: `.dashboard-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}`,
          js: '// Add dashboard interactions',
          framework: 'react'
        }
      }
    ];

    const createdProjects = await Project.insertMany(demoProjects);
    logger.info(`Created ${createdProjects.length} demo projects`);

    logger.info('Database seeding completed successfully!');
    logger.info('Demo credentials:');
    logger.info('Email: demo@opendesign.com');
    logger.info('Password: demo123');
    
  } catch (error) {
    logger.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData();
}

export { seedData };