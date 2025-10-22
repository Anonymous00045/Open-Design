import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Submit code snippet to community training
router.post('/submit-snippet', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      code,
      tags,
      framework,
      license = 'MIT',
      previewImage
    } = req.body;
    const userId = req.user.userId;

    if (!title || !code || !code.html) {
      return res.status(400).json({ error: 'Title and HTML code are required' });
    }

    // Validate and sanitize code
    const validationResult = await validateCode(code);
    if (!validationResult.valid) {
      return res.status(400).json({ 
        error: 'Code validation failed', 
        details: validationResult.errors 
      });
    }

    // Create training snippet
    const snippet = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      author: {
        id: userId,
        name: 'Demo User', // Would come from user profile
        verified: false
      },
      code: {
        html: sanitizeHTML(code.html),
        css: sanitizeCSS(code.css || ''),
        js: sanitizeJS(code.js || '')
      },
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      framework: framework || 'plain',
      license,
      previewImage: previewImage || '',
      stats: {
        likes: 0,
        downloads: 0,
        views: 0,
        rating: 0
      },
      status: 'pending_review', // pending_review, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real implementation, this would save to database
    // and trigger moderation workflow
    
    res.status(201).json({
      message: 'Snippet submitted for review',
      snippetId: snippet.id,
      status: snippet.status,
      estimatedReviewTime: '24-48 hours'
    });

  } catch (error) {
    console.error('Submit snippet error:', error);
    res.status(500).json({ error: 'Failed to submit snippet' });
  }
});

// Get community snippets for training
router.get('/snippets', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      framework,
      tags,
      search,
      sort = 'recent'
    } = req.query;

    // Mock training snippets
    const mockSnippets = generateMockSnippets();
    
    let filteredSnippets = mockSnippets.filter(s => s.status === 'approved');

    // Apply filters
    if (framework) {
      filteredSnippets = filteredSnippets.filter(s => s.framework === framework);
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filteredSnippets = filteredSnippets.filter(s =>
        tagArray.some(tag => s.tags.includes(tag as string))
      );
    }

    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredSnippets = filteredSnippets.filter(s =>
        s.title.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort snippets
    if (sort === 'popular') {
      filteredSnippets.sort((a, b) => b.stats.likes - a.stats.likes);
    } else if (sort === 'rating') {
      filteredSnippets.sort((a, b) => b.stats.rating - a.stats.rating);
    } else {
      filteredSnippets.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Paginate
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedSnippets = filteredSnippets.slice(startIndex, startIndex + Number(limit));

    res.json({
      snippets: paginatedSnippets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredSnippets.length,
        pages: Math.ceil(filteredSnippets.length / Number(limit))
      },
      filters: {
        frameworks: ['react', 'vue', 'angular', 'plain'],
        popularTags: ['hero', 'button', 'card', 'animation', 'form', 'navigation']
      }
    });

  } catch (error) {
    console.error('Get snippets error:', error);
    res.status(500).json({ error: 'Failed to get snippets' });
  }
});

// Start training job
router.post('/train-job', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { snippetIds, modelType = 'design-to-code' } = req.body;
    const userId = req.user.userId;

    // Check if user has permission to start training jobs
    // In a real implementation, this would be admin-only
    
    const trainingJob = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      modelType,
      snippetIds: snippetIds || [],
      status: 'queued',
      progress: 0,
      metrics: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Start training process (mock)
    setTimeout(() => {
      console.log(`Training job ${trainingJob.id} completed`);
    }, 5000);

    res.json({
      message: 'Training job started',
      jobId: trainingJob.id,
      status: trainingJob.status,
      estimatedDuration: '2-4 hours'
    });

  } catch (error) {
    console.error('Start training job error:', error);
    res.status(500).json({ error: 'Failed to start training job' });
  }
});

// Get training job status
router.get('/train-job/:jobId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;
    
    // Mock training job status
    const mockJob = {
      id: jobId,
      status: 'training',
      progress: 65,
      metrics: {
        accuracy: 0.87,
        loss: 0.23,
        samplesProcessed: 1250,
        totalSamples: 2000
      },
      estimatedTimeRemaining: '45 minutes',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date()
    };

    res.json(mockJob);

  } catch (error) {
    console.error('Get training job error:', error);
    res.status(500).json({ error: 'Failed to get training job status' });
  }
});

// Validate code for security and quality
async function validateCode(code: any) {
  const errors: string[] = [];

  // Check for malicious patterns
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /eval\s*\(/gi,
    /document\.write/gi,
    /innerHTML\s*=/gi
  ];

  const htmlContent = code.html || '';
  const jsContent = code.js || '';

  maliciousPatterns.forEach(pattern => {
    if (pattern.test(htmlContent) || pattern.test(jsContent)) {
      errors.push('Potentially unsafe code detected');
    }
  });

  // Basic HTML validation
  if (!htmlContent.includes('<') || !htmlContent.includes('>')) {
    errors.push('Invalid HTML structure');
  }

  // CSS validation (basic)
  const cssContent = code.css || '';
  if (cssContent && !cssContent.includes('{')) {
    errors.push('Invalid CSS structure');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Sanitize functions
function sanitizeHTML(html: string): string {
  // Remove script tags and dangerous attributes
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

function sanitizeCSS(css: string): string {
  // Remove potentially dangerous CSS
  return css
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/@import/gi, '');
}

function sanitizeJS(js: string): string {
  // Remove dangerous JavaScript patterns
  return js
    .replace(/eval\s*\(/gi, 'console.log(')
    .replace(/document\.write/gi, 'console.log')
    .replace(/innerHTML\s*=/gi, 'textContent =');
}

// Generate mock training snippets
function generateMockSnippets() {
  return [
    {
      id: 'snippet-1',
      title: 'Animated Hero Section',
      description: 'Modern hero section with gradient background and smooth animations',
      author: { id: 'user1', name: 'Sarah Chen', verified: true },
      code: {
        html: '<section class="hero"><h1>Welcome</h1><p>Subtitle</p><button>CTA</button></section>',
        css: '.hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
        js: 'document.querySelector("button").addEventListener("click", () => console.log("clicked"));'
      },
      tags: ['hero', 'animation', 'gradient'],
      framework: 'plain',
      license: 'MIT',
      previewImage: '/previews/hero-1.jpg',
      stats: { likes: 45, downloads: 123, views: 890, rating: 4.8 },
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'snippet-2',
      title: 'React Card Component',
      description: 'Reusable card component with hover effects and responsive design',
      author: { id: 'user2', name: 'Mike Johnson', verified: false },
      code: {
        html: '<div class="card"><h3>Title</h3><p>Content</p></div>',
        css: '.card { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }',
        js: 'const Card = ({ title, content }) => <div className="card"><h3>{title}</h3><p>{content}</p></div>;'
      },
      tags: ['card', 'component', 'hover'],
      framework: 'react',
      license: 'MIT',
      previewImage: '/previews/card-1.jpg',
      stats: { likes: 32, downloads: 87, views: 456, rating: 4.5 },
      status: 'approved',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];
}

export { router as trainingRoutes };