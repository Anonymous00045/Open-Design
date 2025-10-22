import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  ownerId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'svg' | 'font' | 'other';
  mimeType: string;
  size: number;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
  tags: string[];
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'svg', 'font', 'other'],
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    format: String
  },
  tags: [String],
  public: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
assetSchema.index({ ownerId: 1, createdAt: -1 });
assetSchema.index({ type: 1 });
assetSchema.index({ public: 1, createdAt: -1 });

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);