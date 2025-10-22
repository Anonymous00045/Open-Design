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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.Mixed
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
            snapshot: mongoose_1.Schema.Types.Mixed,
            createdBy: {
                type: mongoose_1.Schema.Types.ObjectId,
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
projectSchema.index({ ownerId: 1, createdAt: -1 });
projectSchema.index({ public: 1, createdAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'stats.likes': -1 });
exports.Project = mongoose_1.default.model('Project', projectSchema);
//# sourceMappingURL=Project.js.map