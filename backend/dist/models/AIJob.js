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
exports.AIJob = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const aiJobSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['design2code', 'refine', 'animation', 'generate'],
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        designJson: mongoose_1.Schema.Types.Mixed
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
        designJson: mongoose_1.Schema.Types.Mixed,
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
aiJobSchema.index({ userId: 1, createdAt: -1 });
aiJobSchema.index({ status: 1, priority: -1, createdAt: 1 });
aiJobSchema.index({ type: 1 });
exports.AIJob = mongoose_1.default.model('AIJob', aiJobSchema);
//# sourceMappingURL=AIJob.js.map