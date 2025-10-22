"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        select: false
    },
    roles: [{
            type: String,
            enum: ['user', 'designer', 'admin'],
            default: 'user'
        }],
    oauthProviders: [{
            provider: {
                type: String,
                enum: ['google', 'github']
            },
            id: String
        }],
    profile: {
        bio: String,
        avatarUrl: String,
        website: String,
        location: String
    },
    subscription: {
        plan: {
            type: String,
            enum: ['starter', 'professional', 'enterprise'],
            default: 'starter'
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active'
        },
        expiresAt: Date
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash'))
        return next();
    if (this.passwordHash) {
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, 12);
    }
    next();
});
userSchema.methods.comparePassword = async function (password) {
    if (!this.passwordHash)
        return false;
    return bcryptjs_1.default.compare(password, this.passwordHash);
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map