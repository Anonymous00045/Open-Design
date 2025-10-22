# 📚 Open Design - Comprehensive Documentation

**Version:** 1.0  
**Last Updated:** October 22, 2025  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [🎯 Project Overview](#project-overview)
2. [🏗️ Architecture](#architecture)
3. [🚀 Getting Started](#getting-started)
4. [📁 Project Structure](#project-structure)
5. [🔧 API Documentation](#api-documentation)
6. [🎨 Frontend Components](#frontend-components)
7. [🗄️ Database Schema](#database-schema)
8. [🤖 AI Integration](#ai-integration)
9. [🔌 Real-time Features](#real-time-features)
10. [🔐 Authentication & Security](#authentication--security)
11. [📦 Deployment](#deployment)
12. [🧪 Testing](#testing)
13. [🤝 Contributing](#contributing)
14. [📞 Support](#support)

---

## 🎯 Project Overview

Open Design is a revolutionary AI-powered design-to-code platform that bridges the gap between designers and developers. It enables users to create visual designs through an intuitive drag-and-drop interface and automatically converts them into production-ready code for multiple frameworks.

### Key Features

- **Visual Design Editor**: Drag-and-drop canvas with advanced design tools
- **AI-Powered Code Generation**: Convert designs to HTML, CSS, JavaScript, React, Vue, Angular
- **Real-time Collaboration**: Multi-user editing with live cursor tracking
- **Asset Management**: Integrated file upload and management system
- **Community Platform**: Share designs and discover community creations
- **Multi-framework Export**: Support for various frontend frameworks
- **Responsive Design**: Mobile-first responsive interface

### Target Users

- **Designers**: Create and prototype web interfaces visually
- **Developers**: Generate code from designs and collaborate with designers
- **Teams**: Collaborate on design-to-development workflows
- **Agencies**: Streamline client project delivery
- **Educators**: Teach design-to-code concepts
---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Open Design Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14 + TypeScript)                        │
│  ├── Visual Canvas Editor (React Konva)                    │
│  ├── Monaco Code Editor                                     │
│  ├── AI Assistant Interface                                │
│  ├── Real-time Collaboration UI                            │
│  └── Project Management Dashboard                          │
├─────────────────────────────────────────────────────────────┤
│  Backend (Node.js + Express + TypeScript)                  │
│  ├── REST API Server                                       │
│  ├── WebSocket Server (Socket.IO)                          │
│  ├── AI Job Queue (Bull + Redis)                           │
│  ├── Authentication Service (JWT)                          │
│  └── Asset Management (AWS S3)                             │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── MongoDB (Primary Database)                            │
│  ├── Redis (Cache + Queue)                                 │
│  └── AWS S3 (File Storage)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Konva**: Canvas-based visual editor
- **Monaco Editor**: VS Code-powered code editor
- **Zustand**: Lightweight state management
- **Socket.IO Client**: Real-time communication
- **Framer Motion**: Animation library
- **Headless UI**: Accessible UI components

#### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server development
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling
- **Redis**: In-memory data store
- **Socket.IO**: Real-time bidirectional communication
- **Bull**: Redis-based job queue
- **JWT**: JSON Web Token authentication
- **AWS SDK**: Cloud services integration

#### Infrastructure & DevOps
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container orchestration
- **Winston**: Logging library
- **Helmet**: Security middleware
- **Joi**: Data validation
- **ESLint**: Code linting
- **Jest**: Testing framework---


## 🚀 Getting Started

### Prerequisites

Before setting up Open Design, ensure you have the following installed:

- **Node.js 18+** and npm
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Redis** (local installation or cloud service)
- **AWS Account** (optional, for S3 file storage)
- **Git** for version control

### Quick Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/open-design.git
cd open-design
```

#### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 3. Environment Configuration

Create environment files from templates:

```bash
# Frontend environment
cp .env.example .env.local

# Backend environment
cp backend/.env.example backend/.env
```

#### 4. Configure Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Open Design
```

**Backend (backend/.env):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/opendesign
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### 5. Start Services

**Option A: Manual Setup**
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Redis (if local)
redis-server

# Terminal 3: Start Backend
cd backend
npm run dev

# Terminal 4: Start Frontend
npm run dev
```

**Option B: Docker Setup**
```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

#### 7. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates demo data including:
- Demo user: `demo@opendesign.com` / `demo123`
- Sample projects and assets---


## 📁 Project Structure

### Frontend Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── dashboard/               # Dashboard pages
│   ├── workspace/               # Workspace pages
│   ├── auth/                    # Authentication pages
│   ├── billing/                 # Billing pages
│   └── contact/                 # Contact pages
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── LoadingScreen.tsx    # Loading screens
│   │   ├── Prism.tsx            # Prism animations
│   │   └── theme-toggle.tsx     # Theme switcher
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Main header
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── Footer.tsx           # Footer component
│   ├── workspace/               # Workspace components
│   │   ├── Canvas.tsx           # Visual editor canvas
│   │   ├── PropertyPanel.tsx    # Element properties
│   │   ├── ElementToolbar.tsx   # Element tools
│   │   ├── AIAssistant.tsx      # AI chat interface
│   │   └── UploadWidget.tsx     # File upload
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── community/               # Community features
│   └── billing/                 # Billing components
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client
│   ├── auth.ts                  # Authentication utilities
│   ├── utils.ts                 # General utilities
│   └── constants.ts             # App constants
├── store/                       # State management
│   ├── useDesignStore.ts        # Design state
│   ├── useAuthStore.ts          # Authentication state
│   └── useUIStore.ts            # UI state
├── contexts/                    # React contexts
│   ├── AuthContext.tsx          # Authentication context
│   └── ThemeContext.tsx         # Theme context
├── types/                       # TypeScript definitions
│   ├── design.ts                # Design-related types
│   ├── user.ts                  # User types
│   └── api.ts                   # API types
└── hooks/                       # Custom React hooks
    ├── useAuth.ts               # Authentication hook
    ├── useWebSocket.ts          # WebSocket hook
    └── useLocalStorage.ts       # Local storage hook
```

### Backend Structure

```
backend/src/
├── models/                      # Database models
│   ├── User.ts                  # User model
│   ├── Project.ts               # Project model
│   ├── Asset.ts                 # Asset model
│   └── AIJob.ts                 # AI job model
├── routes/                      # API routes
│   ├── auth.ts                  # Authentication routes
│   ├── projects.ts              # Project management
│   ├── assets.ts                # Asset management
│   ├── ai.ts                    # AI services
│   ├── community.ts             # Community features
│   ├── upload.ts                # File upload
│   ├── analyze.ts               # Design analysis
│   ├── generate-code.ts         # Code generation
│   └── training.ts              # AI training
├── middleware/                  # Express middleware
│   ├── auth.ts                  # Authentication middleware
│   ├── validation.ts            # Request validation
│   ├── rateLimiting.ts          # Rate limiting
│   └── errorHandler.ts          # Error handling
├── services/                    # Business logic services
│   ├── authService.ts           # Authentication logic
│   ├── projectService.ts        # Project operations
│   ├── assetService.ts          # Asset operations
│   ├── aiService.ts             # AI integration
│   ├── aiQueue.ts               # AI job queue
│   ├── collaboration.ts         # Real-time collaboration
│   └── emailService.ts          # Email notifications
├── utils/                       # Utility functions
│   ├── logger.ts                # Winston logger
│   ├── database.ts              # Database connection
│   ├── redis.ts                 # Redis connection
│   ├── s3.ts                    # AWS S3 utilities
│   └── validation.ts            # Validation schemas
├── scripts/                     # Utility scripts
│   ├── seed.ts                  # Database seeding
│   └── migrate.ts               # Database migrations
├── types/                       # TypeScript definitions
│   ├── express.d.ts             # Express extensions
│   ├── user.ts                  # User types
│   └── project.ts               # Project types
└── server.ts                    # Main server file
```-
--

## 🔧 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer jwt_access_token
```

### Project Management Endpoints

#### List Projects
```http
GET /api/projects
Authorization: Bearer jwt_access_token
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (optional)
  - tags: string[] (optional)
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "name": "My New Project",
  "description": "Project description",
  "isPublic": false,
  "tags": ["web", "design"],
  "designData": {
    "elements": [],
    "canvas": {
      "width": 1200,
      "height": 800
    }
  }
}
```

#### Get Project
```http
GET /api/projects/:projectId
Authorization: Bearer jwt_access_token
```

#### Update Project
```http
PUT /api/projects/:projectId
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "designData": {
    "elements": [...],
    "canvas": {...}
  }
}
```

#### Delete Project
```http
DELETE /api/projects/:projectId
Authorization: Bearer jwt_access_token
```

### Asset Management Endpoints

#### Get Upload URL
```http
POST /api/assets/presign
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "fileName": "image.png",
  "fileType": "image/png",
  "fileSize": 1024000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "assetId": "asset_id",
    "publicUrl": "https://cdn.example.com/..."
  }
}
```

#### Complete Upload
```http
POST /api/assets/complete
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "assetId": "asset_id",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "png"
  }
}
```

#### List Assets
```http
GET /api/assets
Authorization: Bearer jwt_access_token
Query Parameters:
  - page: number
  - limit: number
  - type: string (image|video|document)
```

#### Delete Asset
```http
DELETE /api/assets/:assetId
Authorization: Bearer jwt_access_token
```### AI S
ervice Endpoints

#### Design to Code Conversion
```http
POST /api/ai/design-to-code
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "projectId": "project_id",
  "designData": {
    "elements": [...],
    "canvas": {...}
  },
  "options": {
    "framework": "react",
    "responsive": true,
    "includeAnimations": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "ai_job_id",
    "status": "queued",
    "estimatedTime": 30
  }
}
```

#### Get AI Job Status
```http
GET /api/ai/jobs/:jobId
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "ai_job_id",
    "status": "completed",
    "progress": 100,
    "result": {
      "html": "<div>...</div>",
      "css": ".container { ... }",
      "javascript": "// Generated JS",
      "framework": "react",
      "components": [...]
    }
  }
}
```

#### Cancel AI Job
```http
POST /api/ai/jobs/:jobId/cancel
Authorization: Bearer jwt_access_token
```

### Upload & Analysis Endpoints

#### Upload Design File
```http
POST /api/upload
Authorization: Bearer jwt_access_token
Content-Type: multipart/form-data

Form Data:
  - file: File (image, video, or design file)
  - projectId: string (optional)
  - metadata: JSON string (optional)
```

#### Analyze Design
```http
POST /api/analyze
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "assetId": "asset_id",
  "analysisType": "visual",
  "options": {
    "extractColors": true,
    "detectText": true,
    "identifyComponents": true
  }
}
```

#### Generate Code from Analysis
```http
POST /api/generate-code
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "analysisId": "analysis_id",
  "framework": "react",
  "options": {
    "responsive": true,
    "includeAnimations": true,
    "componentStructure": "modular"
  }
}
```

### Community Endpoints

#### Browse Community Submissions
```http
GET /api/community/submissions
Query Parameters:
  - page: number
  - limit: number
  - category: string
  - tags: string[]
  - sortBy: string (popular|recent|rating)
```

#### Submit to Community
```http
POST /api/community/submissions
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "projectId": "project_id",
  "title": "Amazing Hero Section",
  "description": "Responsive hero section with animations",
  "tags": ["hero", "animation", "responsive"],
  "category": "components",
  "license": "MIT"
}
```

#### Rate Submission
```http
POST /api/community/submissions/:submissionId/rate
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great design!"
}
```

### Training Endpoints

#### Submit Training Data
```http
POST /api/training/submit-snippet
Authorization: Bearer jwt_access_token
Content-Type: application/json

{
  "inputMedia": "base64_encoded_image",
  "groundTruthCode": {
    "html": "<div>...</div>",
    "css": ".container { ... }",
    "javascript": "// JS code"
  },
  "metadata": {
    "framework": "react",
    "complexity": "medium",
    "tags": ["button", "interactive"]
  },
  "assets": [...]
}
```---

#
# 🎨 Frontend Components

### Core Workspace Components

#### Canvas Component
**Location:** `src/components/workspace/Canvas.tsx`

The main visual editor component built with React Konva for high-performance canvas rendering.

**Features:**
- Drag-and-drop element creation
- Multi-selection and grouping
- Zoom and pan controls
- Grid and snap-to-grid
- Layer management
- Undo/redo functionality

**Usage:**
```tsx
import { Canvas } from '@/components/workspace/Canvas';

<Canvas
  elements={designElements}
  onElementsChange={handleElementsChange}
  selectedElements={selectedElements}
  onSelectionChange={handleSelectionChange}
  canvasSize={{ width: 1200, height: 800 }}
/>
```

#### Property Panel
**Location:** `src/components/workspace/PropertyPanel.tsx`

Dynamic property editor that adapts based on selected elements.

**Features:**
- Element-specific property controls
- Real-time property updates
- Color picker integration
- Typography controls
- Layout and positioning
- Animation properties

#### Element Toolbar
**Location:** `src/components/workspace/ElementToolbar.tsx`

Context-sensitive toolbar for element manipulation.

**Features:**
- Alignment tools
- Distribution controls
- Layer ordering
- Grouping/ungrouping
- Copy/paste operations
- Delete functionality

#### AI Integration Panel
**Location:** `src/components/workspace/AIIntegrationPanel.tsx`

Comprehensive AI workflow interface with three main tabs:

**Upload Tab:**
- Drag-and-drop file upload
- File validation and preview
- Progress tracking
- Supported formats: Images, videos, GIFs, Figma exports, Lottie JSON

**Analyze Tab:**
- Visual analysis processing
- Real-time status updates
- Prism loading animations
- Analysis results display

**Generate Tab:**
- Framework selection (React, Vue, Angular, HTML/CSS/JS)
- Generation options configuration
- Code preview and download
- Asset management

### UI Components Library

#### Loading Components
**Locations:** `src/components/ui/`

Multiple loading screen implementations:

- `LoadingScreen.tsx` - Full-screen loading with animations
- `MiniLoadingScreen.tsx` - Compact loading indicator
- `SimpleLoadingScreen.tsx` - Basic loading spinner
- `StarsLoadingScreen.tsx` - Animated stars background
- `PrismLoadingSystem.tsx` - Advanced Prism animations

#### Prism Animation System
**Location:** `src/components/ui/Prism.tsx`

Advanced 3D animation system for AI processing visualization:

```tsx
import { Prism } from '@/components/ui/Prism';

<Prism
  isActive={isProcessing}
  stage="analyzing" // analyzing | generating | complete
  progress={progressPercentage}
/>
```

#### Theme Toggle
**Location:** `src/components/ui/theme-toggle.tsx`

Dark/light mode switcher with system preference detection:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />
```

### Layout Components

#### Header Component
**Location:** `src/components/layout/Header.tsx`

Main application header with navigation and user controls:

**Features:**
- Project name display
- Save/publish actions
- User profile dropdown
- Theme toggle
- Responsive design

#### Sidebar Component
**Location:** `src/components/layout/Sidebar.tsx`

Collapsible navigation sidebar:

**Features:**
- Project navigation
- Tool palette
- Asset library
- Layer panel
- Component library

### Authentication Components

#### Auth Context
**Location:** `src/contexts/AuthContext.tsx`

Global authentication state management:

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isLoading } = useAuth();
```

### State Management

#### Design Store
**Location:** `src/store/useDesignStore.ts`

Zustand-based state management for design data:

```tsx
import { useDesignStore } from '@/store/useDesignStore';

const {
  elements,
  selectedElements,
  canvasSize,
  addElement,
  updateElement,
  deleteElement,
  selectElements
} = useDesignStore();
```

**State Structure:**
```typescript
interface DesignState {
  elements: DesignElement[];
  selectedElements: string[];
  canvasSize: { width: number; height: number };
  zoom: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  history: HistoryState[];
  historyIndex: number;
}
```---


## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // unique index
  password: String, // bcrypt hashed
  avatar: String, // URL to profile image
  role: String, // 'user' | 'admin' | 'moderator'
  subscription: {
    plan: String, // 'free' | 'pro' | 'enterprise'
    status: String, // 'active' | 'cancelled' | 'expired'
    expiresAt: Date
  },
  preferences: {
    theme: String, // 'light' | 'dark' | 'system'
    notifications: Boolean,
    autoSave: Boolean
  },
  stats: {
    projectsCreated: Number,
    codeGenerated: Number,
    collaborations: Number
  },
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId, // ref: User
  collaborators: [{
    user: ObjectId, // ref: User
    role: String, // 'editor' | 'viewer'
    joinedAt: Date
  }],
  isPublic: Boolean,
  tags: [String],
  category: String,
  designData: {
    elements: [{
      id: String,
      type: String, // 'rectangle' | 'text' | 'image' | 'container'
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      rotation: Number,
      properties: Mixed, // element-specific properties
      children: [String] // child element IDs
    }],
    canvas: {
      width: Number,
      height: Number,
      backgroundColor: String
    },
    assets: [ObjectId] // ref: Asset
  },
  generatedCode: {
    html: String,
    css: String,
    javascript: String,
    framework: String,
    components: [Mixed]
  },
  versions: [{
    version: Number,
    designData: Mixed,
    generatedCode: Mixed,
    createdAt: Date,
    createdBy: ObjectId // ref: User
  }],
  stats: {
    views: Number,
    likes: Number,
    forks: Number,
    downloads: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Assets Collection
```javascript
{
  _id: ObjectId,
  owner: ObjectId, // ref: User
  fileName: String,
  originalName: String,
  fileType: String, // MIME type
  fileSize: Number, // bytes
  url: String, // S3 URL
  thumbnailUrl: String, // thumbnail URL
  metadata: {
    width: Number, // for images/videos
    height: Number,
    duration: Number, // for videos
    format: String,
    colorPalette: [String], // extracted colors
    tags: [String] // auto-generated tags
  },
  projects: [ObjectId], // ref: Project - projects using this asset
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### AI Jobs Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId, // ref: User
  project: ObjectId, // ref: Project
  type: String, // 'design-to-code' | 'analyze' | 'generate'
  status: String, // 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
  priority: Number, // job priority
  input: {
    designData: Mixed,
    options: Mixed,
    assets: [ObjectId] // ref: Asset
  },
  output: {
    code: {
      html: String,
      css: String,
      javascript: String,
      framework: String
    },
    analysis: Mixed,
    assets: [ObjectId] // generated assets
  },
  progress: Number, // 0-100
  error: String, // error message if failed
  estimatedTime: Number, // seconds
  actualTime: Number, // seconds
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

#### Community Submissions Collection
```javascript
{
  _id: ObjectId,
  project: ObjectId, // ref: Project
  author: ObjectId, // ref: User
  title: String,
  description: String,
  category: String, // 'component' | 'template' | 'animation'
  tags: [String],
  license: String, // 'MIT' | 'Apache' | 'GPL' | 'Custom'
  preview: {
    image: String, // preview image URL
    video: String, // preview video URL
    liveDemo: String // live demo URL
  },
  code: {
    html: String,
    css: String,
    javascript: String,
    framework: String,
    dependencies: [String]
  },
  stats: {
    views: Number,
    downloads: Number,
    likes: Number,
    rating: Number, // average rating
    ratingCount: Number
  },
  ratings: [{
    user: ObjectId, // ref: User
    rating: Number, // 1-5
    comment: String,
    createdAt: Date
  }],
  status: String, // 'pending' | 'approved' | 'rejected'
  moderatedBy: ObjectId, // ref: User
  moderatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes

#### Performance Indexes
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Projects
db.projects.createIndex({ owner: 1, createdAt: -1 });
db.projects.createIndex({ isPublic: 1, createdAt: -1 });
db.projects.createIndex({ tags: 1 });
db.projects.createIndex({ "collaborators.user": 1 });

// Assets
db.assets.createIndex({ owner: 1, createdAt: -1 });
db.assets.createIndex({ fileType: 1 });
db.assets.createIndex({ projects: 1 });

// AI Jobs
db.aijobs.createIndex({ user: 1, createdAt: -1 });
db.aijobs.createIndex({ status: 1, priority: -1 });
db.aijobs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// Community Submissions
db.communitysubmissions.createIndex({ status: 1, createdAt: -1 });
db.communitysubmissions.createIndex({ category: 1, "stats.rating": -1 });
db.communitysubmissions.createIndex({ tags: 1 });
db.communitysubmissions.createIndex({ author: 1 });
```