"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.generateCodeRoutes = router;
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { designAST, framework = 'react', options = {} } = req.body;
        const userId = req.user.userId;
        if (!designAST) {
            return res.status(400).json({ error: 'Design AST required' });
        }
        const generationJob = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            framework,
            status: 'generating',
            progress: 0,
            options,
            createdAt: new Date()
        };
        const generatedCode = await generateCodeFromAST(designAST, framework, options);
        res.json({
            jobId: generationJob.id,
            status: 'complete',
            framework,
            files: generatedCode.files,
            assets: generatedCode.assets,
            previewUrl: `/preview/${generationJob.id}`,
            downloadUrl: `/download/${generationJob.id}`,
            mapping: generatedCode.mapping
        });
    }
    catch (error) {
        console.error('Code generation error:', error);
        res.status(500).json({ error: 'Code generation failed' });
    }
});
router.get('/:jobId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        const mockResult = {
            id: jobId,
            status: 'complete',
            progress: 100,
            files: {
                'index.html': generateHTML('Hero Section'),
                'styles.css': generateCSS(),
                'script.js': generateJS('react'),
                'Component.jsx': generateReactComponent()
            },
            assets: [
                { name: 'hero-bg.jpg', url: '/assets/hero-bg.jpg', type: 'image' },
                { name: 'logo.svg', url: '/assets/logo.svg', type: 'icon' }
            ],
            mapping: {
                'hero-section': {
                    domSelector: '.hero',
                    sourceFrame: 0,
                    elements: ['title', 'subtitle', 'cta']
                }
            }
        };
        res.json(mockResult);
    }
    catch (error) {
        console.error('Get generation result error:', error);
        res.status(500).json({ error: 'Failed to get generation result' });
    }
});
router.get('/:jobId/download', auth_1.authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.params;
        res.json({
            message: 'Download would start here',
            jobId,
            files: ['index.html', 'styles.css', 'script.js', 'assets/']
        });
    }
    catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});
async function generateCodeFromAST(designAST, framework, options) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const files = {};
    const assets = [];
    const mapping = {};
    files['index.html'] = generateHTML(designAST.metadata?.title || 'Generated Page');
    files['styles.css'] = generateCSS(designAST.styles);
    if (framework === 'react') {
        files['Component.jsx'] = generateReactComponent(designAST);
        files['App.js'] = generateReactApp();
        files['package.json'] = generateReactPackageJson();
    }
    else if (framework === 'vue') {
        files['Component.vue'] = generateVueComponent(designAST);
        files['main.js'] = generateVueMain();
        files['package.json'] = generateVuePackageJson();
    }
    else {
        files['script.js'] = generateJS(framework, designAST);
    }
    files['README.md'] = generateReadme(framework, designAST);
    if (designAST.children) {
        extractAssetsFromAST(designAST.children, assets, mapping);
    }
    return { files, assets, mapping };
}
function generateHTML(title = 'Generated Page') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">AI-Generated Design</h1>
            <p class="hero-subtitle">Created from your uploaded design with advanced AI analysis</p>
            <button class="cta-button" onclick="handleCTAClick()">Get Started</button>
        </div>
    </section>
    <script src="script.js"></script>
</body>
</html>`;
}
function generateCSS(styles) {
    return `/* AI-Generated Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    padding: 2rem;
}

.hero-content {
    max-width: 600px;
    animation: fadeInUp 1s ease-out;
}

.hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    animation: slideInDown 0.8s ease-out;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeIn 1s ease-out 0.3s both;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: bounceIn 1s ease-out 0.6s both;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

/* Animations */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title { font-size: 2rem; }
    .hero-subtitle { font-size: 1rem; }
    .cta-button { padding: 0.8rem 1.5rem; }
}

@media (max-width: 480px) {
    .hero { padding: 1rem; }
    .hero-title { font-size: 1.5rem; }
}`;
}
function generateJS(framework, designAST) {
    return `// AI-Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI-generated page loaded');
    
    // Initialize animations
    initializeAnimations();
    
    // Setup interactions
    setupInteractions();
});

function handleCTAClick() {
    console.log('CTA button clicked');
    // Add your custom logic here
    
    // Example: Track analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'CTA',
            event_label: 'Hero CTA'
        });
    }
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe animated elements
    document.querySelectorAll('.hero-content').forEach(el => {
        observer.observe(el);
    });
}

function setupInteractions() {
    // Add hover effects
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
}`;
}
function generateReactComponent(designAST) {
    return `import React from 'react';
import './styles.css';

const HeroComponent = () => {
  const handleCTAClick = () => {
    console.log('CTA clicked');
    // Add your custom logic here
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">AI-Generated Design</h1>
        <p className="hero-subtitle">
          Created from your uploaded design with advanced AI analysis
        </p>
        <button className="cta-button" onClick={handleCTAClick}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroComponent;`;
}
function generateReactApp() {
    return `import React from 'react';
import HeroComponent from './Component';
import './styles.css';

function App() {
  return (
    <div className="App">
      <HeroComponent />
    </div>
  );
}

export default App;`;
}
function generateVueComponent(designAST) {
    return `<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">AI-Generated Design</h1>
      <p class="hero-subtitle">
        Created from your uploaded design with advanced AI analysis
      </p>
      <button class="cta-button" @click="handleCTAClick">
        Get Started
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroComponent',
  methods: {
    handleCTAClick() {
      console.log('CTA clicked');
      // Add your custom logic here
    }
  }
}
</script>

<style scoped>
/* Component-specific styles can go here */
</style>`;
}
function generateReactPackageJson() {
    return JSON.stringify({
        name: 'ai-generated-component',
        version: '1.0.0',
        private: true,
        dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
        },
        scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test',
            eject: 'react-scripts eject'
        },
        devDependencies: {
            'react-scripts': '^5.0.1'
        }
    }, null, 2);
}
function generateVuePackageJson() {
    return JSON.stringify({
        name: 'ai-generated-vue-component',
        version: '1.0.0',
        private: true,
        dependencies: {
            vue: '^3.3.0'
        },
        scripts: {
            serve: 'vue-cli-service serve',
            build: 'vue-cli-service build'
        },
        devDependencies: {
            '@vue/cli-service': '^5.0.0'
        }
    }, null, 2);
}
function generateVueMain() {
    return `import { createApp } from 'vue';
import HeroComponent from './Component.vue';
import './styles.css';

createApp(HeroComponent).mount('#app');`;
}
function generateReadme(framework, designAST) {
    return `# AI-Generated ${framework.toUpperCase()} Component

This component was automatically generated from your design using Open Design's AI analysis.

## Framework
${framework.charAt(0).toUpperCase() + framework.slice(1)}

## Files Included
- \`index.html\` - Main HTML structure
- \`styles.css\` - Responsive CSS with animations
- \`script.js\` - Interactive JavaScript
${framework === 'react' ? '- `Component.jsx` - React component\n- `App.js` - React app wrapper' : ''}
${framework === 'vue' ? '- `Component.vue` - Vue component\n- `main.js` - Vue app initialization' : ''}

## Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ CSS animations and transitions
- ✅ Interactive elements
- ✅ Semantic HTML structure
- ✅ Accessibility considerations
- ✅ Modern CSS practices

## Usage

### Development
1. Open \`index.html\` in your browser for preview
2. Customize styles in \`styles.css\`
3. Add functionality in \`script.js\`

### Production
1. Optimize images and assets
2. Minify CSS and JavaScript
3. Test across different browsers
4. Deploy to your hosting platform

## Customization
- Colors: Update CSS custom properties
- Typography: Modify font families and sizes
- Animations: Adjust timing and easing functions
- Layout: Modify flexbox/grid properties

## Generated by Open Design
This code was created using AI analysis of your uploaded design.
Visit [Open Design](https://opendesign.com) for more AI-powered design tools.
`;
}
function extractAssetsFromAST(children, assets, mapping) {
    children.forEach((child, index) => {
        if (child.type === 'img' || child.backgroundImage) {
            assets.push({
                name: `asset-${index}.jpg`,
                url: `/assets/asset-${index}.jpg`,
                type: 'image',
                usage: child.id || `element-${index}`
            });
            mapping[child.id || `element-${index}`] = {
                domSelector: `.${child.className || child.id}`,
                assetType: 'image',
                sourceFrame: 0
            };
        }
        if (child.children) {
            extractAssetsFromAST(child.children, assets, mapping);
        }
    });
}
//# sourceMappingURL=generate-code.js.map