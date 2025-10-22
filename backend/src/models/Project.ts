import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  public: boolean;
  collaborators: {
    userId: mongoose.Types.ObjectId;
    role: 'editor' | 'viewer';
    addedAt: Date;
  }[];
  designJson: {
    elements: any[];
    canvasSize: { width: number; height: number };
    version: string;
  };
  code: {
    html: string;
    css: string;
    js: string;
    framework: 'react' | 'vue' | 'angular' | 'plain';
  };
  versions: {
    versionId: string;
    snapshot: any;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    message?: string;
  }[];
  assets: string[];
  tags: string[];
  thumbnail?: string;
  stats: {
    views: number;
    likes: number;
    forks: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  public: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  designJson: {
    elements: [{
      type: Schema.Types.Mixed
    }],
    canvasSize: {
      width: {
        type: Number,
        default: 1200
      },
      height: {
        type: Number,
        default: 800
      }
    },
    version: {
      type: String,
      default: '1.0.0'
    }
  },
  code: {
    html: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    },
    js: {
      type: String,
      default: ''
    },
    framework: {
      type: String,
      enum: ['react', 'vue', 'angular', 'plain'],
      default: 'plain'
    }
  },
  versions: [{
    versionId: {
      type: String,
      required: true
    },
    snapshot: Schema.Types.Mixed,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    message: String
  }],
  assets: [String],
  tags: [String],
  thumbnail: String,
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ ownerId: 1, createdAt: -1 });
projectSchema.index({ public: 1, createdAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'stats.likes': -1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);