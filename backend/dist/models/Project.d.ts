import mongoose, { Document } from 'mongoose';
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
        canvasSize: {
            width: number;
            height: number;
        };
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
export declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Project.d.ts.map