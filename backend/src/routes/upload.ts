import express from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp',
      'video/mp4', 'video/webm', 'video/mov',
      'application/json', // Lottie files
    ];
    
    const isAllowed = allowedTypes.includes(file.mimetype) || 
                     file.originalname.endsWith('.fig') ||
                     file.originalname.endsWith('.json');
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Upload endpoint
router.post('/', authMiddleware, upload.array('files', 10), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = req.user.userId;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadResults = [];

    for (const file of files) {
      // Validate file
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

      // Process file (mock implementation)
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

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get file type
function getFileType(file: Express.Multer.File): 'image' | 'video' | 'animation' | 'figma' {
  if (file.mimetype.startsWith('image/')) return 'image';
  if (file.mimetype.startsWith('video/')) return 'video';
  if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) return 'animation';
  if (file.originalname.endsWith('.fig')) return 'figma';
  return 'image'; // default
}

// Validate file
function validateFile(file: Express.Multer.File, type: string) {
  // Size limits by type
  const sizeLimits = {
    image: 10 * 1024 * 1024, // 10MB
    video: 50 * 1024 * 1024, // 50MB
    animation: 5 * 1024 * 1024, // 5MB
    figma: 20 * 1024 * 1024 // 20MB
  };

  if (file.size > sizeLimits[type as keyof typeof sizeLimits]) {
    return {
      valid: false,
      error: `File too large. Maximum size for ${type} is ${sizeLimits[type as keyof typeof sizeLimits] / 1024 / 1024}MB`
    };
  }

  // Additional validations
  if (type === 'video' && file.size < 1024) {
    return { valid: false, error: 'Video file appears to be corrupted' };
  }

  if (type === 'animation') {
    try {
      const content = file.buffer.toString('utf8');
      JSON.parse(content); // Validate JSON
    } catch {
      return { valid: false, error: 'Invalid JSON/Lottie file' };
    }
  }

  return { valid: true };
}

// Process uploaded file (mock implementation)
async function processUploadedFile(file: Express.Multer.File, userId: string) {
  const fileId = Math.random().toString(36).substr(2, 9);
  const fileType = getFileType(file);
  
  // Mock file processing
  const mockUrl = `/uploads/${userId}/${fileId}-${file.originalname}`;
  
  // Extract metadata based on file type
  let metadata = {};
  
  if (fileType === 'image') {
    metadata = {
      dimensions: { width: 1200, height: 800 }, // Mock dimensions
      format: file.mimetype.split('/')[1],
      hasTransparency: file.mimetype === 'image/png',
      colorProfile: 'sRGB'
    };
  } else if (fileType === 'video') {
    metadata = {
      duration: 6.5, // Mock duration in seconds
      dimensions: { width: 1920, height: 1080 },
      fps: 30,
      format: file.mimetype.split('/')[1],
      hasAudio: true,
      keyframes: [0, 1.5, 3.2, 4.8, 6.5] // Mock keyframe timestamps
    };
  } else if (fileType === 'animation') {
    try {
      const lottieData = JSON.parse(file.buffer.toString('utf8'));
      metadata = {
        version: lottieData.v || '5.0.0',
        frameRate: lottieData.fr || 30,
        duration: (lottieData.op - lottieData.ip) / lottieData.fr,
        dimensions: { width: lottieData.w, height: lottieData.h },
        layers: lottieData.layers?.length || 0
      };
    } catch {
      metadata = { error: 'Could not parse Lottie data' };
    }
  }

  return {
    id: fileId,
    url: mockUrl,
    metadata
  };
}

export { router as uploadRoutes };