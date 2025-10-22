import mongoose, { Document } from 'mongoose';
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
export declare const Asset: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}, {}> & IAsset & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Asset.d.ts.map