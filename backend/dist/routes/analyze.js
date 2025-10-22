"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.analyzeRoutes = router;
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { assetIds, options = {} } = req.body;
        const userId = req.user.userId;
        if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
            return res.status(400).json({ error: 'Asset IDs required' });
        }
        const analysisJob = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            assetIds,
            status: 'queued',
            progress: 0,
            options,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const analysisResult = await performAnalysis(assetIds, options);
        res.json({
            jobId: analysisJob.id,
            status: 'complete',
            result: analysisResult
        });
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});
router.get('/:jobId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const mockResult = {
            id: jobId,
            status: 'complete',
            progress: 100,
            result: {
                designAST: generateMockAST(),
                extractedAssets: [
                    { type: 'image', url: '/extracted/hero-bg.jpg', usage: 'background' },
                    { type: 'icon', url: '/extracted/logo.svg', usage: 'branding' }
                ],
                metadata: {
                    totalElements: 8,
                    layoutType: 'hero-section',
                    complexity: 'medium',
                    estimatedCodeLines: 150
                }
            }
        };
        res.json(mockResult);
    }
    catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({ error: 'Failed to get analysis result' });
    }
});
async function performAnalysis(assetIds, options) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        designAST: generateMockAST(),
        visualAnalysis: {
            layout: {
                type: 'hero-section',
                structure: 'centered',
                sections: [
                    {
                        id: 'hero',
                        type: 'section',
                        bounds: { x: 0, y: 0, width: 1200, height: 600 },
                        elements: ['title', 'subtitle', 'cta-button']
                    }
                ]
            },
            typography: {
                fonts: [
                    { family: 'Inter', weights: [400, 600, 700], usage: 'primary' },
                    { family: 'Roboto', weights: [300, 400], usage: 'secondary' }
                ],
                hierarchy: [
                    { level: 'h1', size: '48px', weight: 700, color: '#1a1a1a' },
                    { level: 'p', size: '18px', weight: 400, color: '#666666' }
                ]
            },
            colors: {
                primary: '#3B82F6',
                secondary: '#8B5CF6',
                accent: '#EC4899',
                neutral: ['#1a1a1a', '#666666', '#f8f9fa'],
                palette: [
                    { hex: '#3B82F6', usage: 'primary-button', frequency: 0.15 },
                    { hex: '#8B5CF6', usage: 'gradient', frequency: 0.12 },
                    { hex: '#EC4899', usage: 'accent', frequency: 0.08 }
                ]
            },
            animations: options.analyzeAnimations ? [
                {
                    type: 'fadeIn',
                    target: 'hero-title',
                    duration: 1000,
                    delay: 0,
                    easing: 'ease-out'
                },
                {
                    type: 'slideUp',
                    target: 'hero-subtitle',
                    duration: 800,
                    delay: 200,
                    easing: 'ease-out'
                },
                {
                    type: 'bounceIn',
                    target: 'cta-button',
                    duration: 1000,
                    delay: 600,
                    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }
            ] : [],
            responsiveBreakpoints: [
                { name: 'mobile', maxWidth: 768, adjustments: ['stack-vertical', 'reduce-font-sizes'] },
                { name: 'tablet', maxWidth: 1024, adjustments: ['adjust-spacing'] },
                { name: 'desktop', minWidth: 1025, adjustments: ['full-layout'] }
            ]
        },
        extractedAssets: [
            {
                id: 'bg-image-1',
                type: 'background-image',
                originalUrl: '/uploads/hero-bg.jpg',
                optimizedUrl: '/optimized/hero-bg-1200w.webp',
                variants: [
                    { width: 400, url: '/optimized/hero-bg-400w.webp' },
                    { width: 800, url: '/optimized/hero-bg-800w.webp' },
                    { width: 1200, url: '/optimized/hero-bg-1200w.webp' }
                ],
                usage: 'hero-background',
                altText: 'Hero section background image'
            },
            {
                id: 'icon-1',
                type: 'icon',
                originalUrl: '/uploads/logo.svg',
                optimizedUrl: '/optimized/logo.svg',
                usage: 'brand-logo',
                altText: 'Company logo'
            }
        ],
        codeHints: {
            framework: 'react',
            cssFramework: 'tailwind',
            animations: 'css-transitions',
            responsive: 'mobile-first',
            accessibility: {
                altTexts: true,
                semanticHTML: true,
                colorContrast: 'AA',
                keyboardNavigation: true
            }
        }
    };
}
function generateMockAST() {
    return {
        version: '1.0.0',
        type: 'page',
        id: 'root',
        metadata: {
            title: 'Generated Page',
            description: 'AI-generated page from design analysis',
            viewport: 'width=device-width, initial-scale=1.0'
        },
        styles: {
            global: {
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: 1.6,
                color: '#1a1a1a'
            },
            tokens: {
                colors: {
                    primary: '#3B82F6',
                    secondary: '#8B5CF6',
                    accent: '#EC4899',
                    neutral: {
                        50: '#f8f9fa',
                        100: '#e9ecef',
                        900: '#1a1a1a'
                    }
                },
                spacing: {
                    xs: '0.5rem',
                    sm: '1rem',
                    md: '1.5rem',
                    lg: '2rem',
                    xl: '3rem'
                },
                typography: {
                    h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 },
                    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
                    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 }
                }
            }
        },
        children: [
            {
                type: 'section',
                id: 'hero',
                className: 'hero-section',
                styles: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '2rem'
                },
                children: [
                    {
                        type: 'div',
                        id: 'hero-content',
                        className: 'hero-content',
                        styles: {
                            maxWidth: '600px',
                            animation: 'fadeInUp 1s ease-out'
                        },
                        children: [
                            {
                                type: 'h1',
                                id: 'hero-title',
                                className: 'hero-title',
                                content: 'AI-Generated Hero Section',
                                styles: {
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    animation: 'slideInDown 0.8s ease-out'
                                }
                            },
                            {
                                type: 'p',
                                id: 'hero-subtitle',
                                className: 'hero-subtitle',
                                content: 'Created from your design with advanced AI analysis',
                                styles: {
                                    fontSize: '1.2rem',
                                    marginBottom: '2rem',
                                    opacity: 0.9,
                                    animation: 'fadeIn 1s ease-out 0.3s both'
                                }
                            },
                            {
                                type: 'button',
                                id: 'cta-button',
                                className: 'cta-button',
                                content: 'Get Started',
                                styles: {
                                    background: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    animation: 'bounceIn 1s ease-out 0.6s both'
                                },
                                interactions: [
                                    {
                                        trigger: 'hover',
                                        styles: {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        animations: [
            {
                name: 'fadeInUp',
                keyframes: {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            },
            {
                name: 'slideInDown',
                keyframes: {
                    from: { opacity: 0, transform: 'translateY(-30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            },
            {
                name: 'fadeIn',
                keyframes: {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            },
            {
                name: 'bounceIn',
                keyframes: {
                    '0%': { opacity: 0, transform: 'scale(0.3)' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                }
            }
        ]
    };
}
//# sourceMappingURL=analyze.js.map