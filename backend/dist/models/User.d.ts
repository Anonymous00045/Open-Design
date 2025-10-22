import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    name: string;
    passwordHash?: string;
    roles: ('user' | 'designer' | 'admin')[];
    oauthProviders: {
        provider: string;
        id: string;
    }[];
    profile: {
        bio?: string;
        avatarUrl?: string;
        website?: string;
        location?: string;
    };
    subscription: {
        plan: 'starter' | 'professional' | 'enterprise';
        status: 'active' | 'cancelled' | 'expired';
        expiresAt?: Date;
    };
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: {
            email: boolean;
            push: boolean;
        };
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map