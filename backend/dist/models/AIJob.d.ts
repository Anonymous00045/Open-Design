import mongoose, { Document } from 'mongoose';
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
export declare const AIJob: mongoose.Model<IAIJob, {}, {}, {}, mongoose.Document<unknown, {}, IAIJob, {}, {}> & IAIJob & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AIJob.d.ts.map