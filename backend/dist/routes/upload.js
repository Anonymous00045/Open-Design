"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.uploadRoutes = router;
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp',
            'video/mp4', 'video/webm', 'video/mov',
            'application/json',
        ];
        const isAllowed = allowedTypes.includes(file.mimetype) ||
            file.originalname.endsWith('.fig') ||
            file.originalname.endsWith('.json');
        if (isAllowed) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});
router.post('/', auth_1.authMiddleware, upload.array('files', 10), async (req, res) => {
    try {
        const files = req.files;
        const userId = req.user.userId;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const uploadResults = [];
        for (const file of files) {
            const fileType = getFileType(file);
            const validation = validateFile(file, fileType);
            if (!validation.valid) {
                uploadResults.push({
                    filename: file.originalname,
                    status: 'error',
                    error: validation.error
                });
                continue;
            }
            const processedFile = await processUploadedFile(file, userId);
            uploadResults.push({
                filename: file.originalname,
                status: 'success',
                id: processedFile.id,
                url: processedFile.url,
                type: fileType,
                size: file.size,
                metadata: processedFile.metadata
            });
        }
        res.json({
            message: 'Files processed',
            results: uploadResults,
            total: files.length,
            successful: uploadResults.filter(r => r.status === 'success').length
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});
function getFileType(file) {
    if (file.mimetype.startsWith('image/'))
        return 'image';
    if (file.mimetype.startsWith('video/'))
        return 'video';
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json'))
        return 'animation';
    if (file.originalname.endsWith('.fig'))
        return 'figma';
    return 'image';
}
function validateFile(file, type) {
    const sizeLimits = {
        image: 10 * 1024 * 1024,
        video: 50 * 1024 * 1024,
        animation: 5 * 1024 * 1024,
        figma: 20 * 1024 * 1024
    };
    if (file.size > sizeLimits[type]) {
        return {
            valid: false,
            error: `File too large. Maximum size for ${type} is ${sizeLimits[type] / 1024 / 1024}MB`
        };
    }
    if (type === 'video' && file.size < 1024) {
        return { valid: false, error: 'Video file appears to be corrupted' };
    }
    if (type === 'animation') {
        try {
            const content = file.buffer.toString('utf8');
            JSON.parse(content);
        }
        catch {
            return { valid: false, error: 'Invalid JSON/Lottie file' };
        }
    }
    return { valid: true };
}
async function processUploadedFile(file, userId) {
    const fileId = Math.random().toString(36).substr(2, 9);
    const fileType = getFileType(file);
    const mockUrl = `/uploads/${userId}/${fileId}-${file.originalname}`;
    let metadata = {};
    if (fileType === 'image') {
        metadata = {
            dimensions: { width: 1200, height: 800 },
            format: file.mimetype.split('/')[1],
            hasTransparency: file.mimetype === 'image/png',
            colorProfile: 'sRGB'
        };
    }
    else if (fileType === 'video') {
        metadata = {
            duration: 6.5,
            dimensions: { width: 1920, height: 1080 },
            fps: 30,
            format: file.mimetype.split('/')[1],
            hasAudio: true,
            keyframes: [0, 1.5, 3.2, 4.8, 6.5]
        };
    }
    else if (fileType === 'animation') {
        try {
            const lottieData = JSON.parse(file.buffer.toString('utf8'));
            metadata = {
                version: lottieData.v || '5.0.0',
                frameRate: lottieData.fr || 30,
                duration: (lottieData.op - lottieData.ip) / lottieData.fr,
                dimensions: { width: lottieData.w, height: lottieData.h },
                layers: lottieData.layers?.length || 0
            };
        }
        catch {
            metadata = { error: 'Could not parse Lottie data' };
        }
    }
    return {
        id: fileId,
        url: mockUrl,
        metadata
    };
}
//# sourceMappingURL=upload.js.map