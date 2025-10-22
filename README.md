# Open Design

A collaborative design-to-code platform powered by AI that enables designers and developers to create, collaborate, and convert designs into production-ready code.

## 🚀 Features

### ✅ Core Features (Implemented)
- **Visual Design Editor**: Drag-and-drop interface with canvas, toolbars, and property panels
- **AI-Powered Code Generation**: Convert designs to HTML, CSS, JavaScript, React, Vue, and Angular
- **Real-time Collaboration**: WebSocket-based collaborative editing with cursor tracking
- **Project Management**: Create, save, and organize design projects
- **Authentication System**: JWT-based auth with registration, login, and user profiles
- **Asset Management**: File upload and management with AWS S3 integration
- **Community Features**: Share designs and discover community creations
- **Export Options**: Export designs in multiple formats and frameworks
- **Responsive Design**: Mobile-first responsive interface

### 🚧 In Development
- **Advanced AI Integration**: Enhanced AI models for better code generation
- **Version Control**: Git-like versioning for design projects
- **Team Management**: Organization and team collaboration features
- **Payment Integration**: Subscription and billing management
- **Advanced Components**: More design components and templates

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time communication
- **Headless UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side code
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory data store for caching and sessions
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **AWS S3** - File storage and asset management

### Infrastructure
- **Docker** - Containerization
- **Winston** - Logging
- **Joi** - Data validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Redis (local or cloud)
- AWS S3 bucket (optional, for file uploads)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/open-design.git
cd open-design

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

Configure your environment variables in both files.

### 3. Start Development Servers

```bash
# Terminal 1: Start MongoDB and Redis (if local)
mongod
redis-server

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🐳 Docker Setup

For a complete containerized setup:

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
open-design/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js app router pages
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   ├── workspace/            # Design workspace components
│   │   ├── layout/               # Layout components
│   │   ├── auth/                 # Authentication components
│   │   └── dashboard/            # Dashboard components
│   ├── lib/                      # Utility libraries and API client
│   ├── store/                    # Zustand state management
│   ├── contexts/                 # React contexts
│   └── types/                    # TypeScript type definitions
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Express middleware
│   │   ├── services/             # Business logic services
│   │   ├── utils/                # Utility functions
│   │   └── validation/           # Request validation schemas
│   └── logs/                     # Application logs
├── docs/                         # 📚 Complete documentation
│   ├── README.md                 # Documentation index
│   ├── setup.md                  # Setup and installation guide
│   ├── Frontendplan.md           # Frontend development plan
│   ├── OpenDesign_Backend_Database_AIPipeline_Plan.md # Backend plan
│   ├── IMPLEMENTATION_STATUS.md  # Current implementation status
│   └── ...                       # Additional documentation
├── public/                       # Static assets
└── docker-compose.yml            # Docker configuration
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI Services
- `POST /api/ai/design-to-code` - Convert design to code
- `GET /api/ai/jobs/:id` - Get AI job status
- `POST /api/ai/jobs/:id/cancel` - Cancel AI job

### Assets
- `POST /api/assets/presign` - Get upload URL
- `GET /api/assets` - List user assets
- `DELETE /api/assets/:id` - Delete asset

### Community
- `GET /api/community/submissions` - Browse submissions
- `POST /api/community/submissions` - Submit to community

## 🔌 WebSocket Events

### Collaboration
- `join-project` - Join project collaboration
- `canvas-operation` - Canvas editing operations
- `cursor-move` - Real-time cursor tracking
- `code-change` - Code editor synchronization

### Notifications
- `ai-job-update` - AI processing status updates
- `user-joined` / `user-left` - Collaboration participants

## 🧪 Development

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### Database Seeding

```bash
cd backend
npm run seed
```

This creates demo users and projects:
- Email: `demo@opendesign.com`
- Password: `demo123`

### Linting and Formatting

```bash
# Frontend
npm run lint
npm run lint:fix

# Backend
cd backend
npm run lint
npm run lint:fix
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
npm start
```

### Docker Production

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Update documentation for API changes
- Ensure responsive design compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Socket.io for real-time capabilities
- MongoDB and Redis communities
- All contributors and users

## 📚 Documentation

Complete documentation is available in the [`docs/`](./docs/) folder:

- **[📋 Documentation Index](./docs/README.md)** - Overview of all documentation
- **[🚀 Setup Guide](./docs/setup.md)** - Complete installation instructions
- **[📊 Implementation Status](./docs/IMPLEMENTATION_STATUS.md)** - Current feature status
- **[🎯 Frontend Plan](./docs/Frontendplan.md)** - Frontend development roadmap
- **[🏗️ Backend Plan](./docs/OpenDesign_Backend_Database_AIPipeline_Plan.md)** - Backend architecture
- **[✨ Features](./docs/FEATURES.md)** - Complete feature overview

## 📞 Support

- 📧 Email: support@opendesign.com
- 💬 Discord: [Join our community](https://discord.gg/opendesign)
- 📖 Documentation: [./docs/](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/open-design/issues)