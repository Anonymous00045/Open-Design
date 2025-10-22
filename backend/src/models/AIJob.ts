import mongoose, { Document, Schema } from 'mongoose';

export interface IAIJob extends Document {
  type: 'design2code' | 'refine' | 'animation' | 'generate';
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  input: {
    s3Url?: string;
    prompt?: string;
    code?: {
      html: string;
      css: string;
      js: string;
    };
    designJson?: any;
  };
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: {
    code?: {
      html: string;
      css: string;
      js: string;
    };
    designJson?: any;
    s3Url?: string;
    message?: string;
  };
  error?: string;
  meta: {
    processingTime?: number;
    tokensUsed?: number;
    model?: string;
  };
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const aiJobSchema = new Schema<IAIJob>({
  type: {
    type: String,
    enum: ['design2code', 'refine', 'animation', 'generate'],
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  input: {
    s3Url: String,
    prompt: String,
    code: {
      html: String,
      css: String,
      js: String
    },
    designJson: Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['queued', 'running', 'completed', 'failed'],
    default: 'queued'
  },
  result: {
    code: {
      html: String,
      css: String,
      js: String
    },
    designJson: Schema.Types.Mixed,
    s3Url: String,
    message: String
  },
  error: String,
  meta: {
    processingTime: Number,
    tokensUsed: Number,
    model: String
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
aiJobSchema.index({ userId: 1, createdAt: -1 });
aiJobSchema.index({ status: 1, priority: -1, createdAt: 1 });
aiJobSchema.index({ type: 1 });

export const AIJob = mongoose.model<IAIJob>('AIJob', aiJobSchema);