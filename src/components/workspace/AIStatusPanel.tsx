'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Eye, 
  Code, 
  Wand2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { AIThinkingPrism, AIProcessingPrism, AIGeneratingPrism, AIAnalyzingPrism } from '../ui/PrismLoadingSystem';

interface AIJob {
  id: string;
  type: 'analyze' | 'generate' | 'refine';
  status: 'queued' | 'analyzing' | 'generating' | 'complete' | 'error';
  progress: number;
  input: {
    assets: string[];
    prompt?: string;
    framework?: 'react' | 'vue' | 'plain';
  };
  output?: {
    html: string;
    css: string;
    js: string;
    assets: string[];
    preview_url: string;
    mapping: any;
  };
  error?: string;
  created_at: Date;
  updated_at: Date;
}

export default function AIStatusPanel() {
  const [activeJobs, setActiveJobs] = useState<AIJob[]>([]);
  const [completedJobs, setCompletedJobs] = useState<AIJob[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vue' | 'plain'>('react');

  // Mock job processing
  const startAnalysis = async (assets: string[]) => {
    const job: AIJob = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'analyze',
      status: 'queued',
      progress: 0,
      input: { assets },
      created_at: new Date(),
      updated_at: new Date()
    };

    setActiveJobs(prev => [...prev, job]);
    await processJob(job);
  };

  const startGeneration = async (prompt: string, framework: 'react' | 'vue' | 'plain' = 'react') => {
    const job: AIJob = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'generate',
      status: 'queued',
      progress: 0,
      input: { assets: [], prompt, framework },
      created_at: new Date(),
      updated_at: new Date()
    };

    setActiveJobs(prev => [...prev, job]);
    await processJob(job);
  };

  const processJob = async (job: AIJob) => {
    // Simulate job processing
    const stages = job.type === 'analyze' 
      ? ['queued', 'analyzing'] 
      : ['queued', 'analyzing', 'generating'];

    for (let i = 0; i < stages.length; i++) {
      const status = stages[i] as AIJob['status'];
      
      setActiveJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status, updated_at: new Date() } : j
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setActiveJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, progress, updated_at: new Date() } : j
        ));
      }
    }

    // Complete job
    const completedJob: AIJob = {
      ...job,
      status: 'complete',
      progress: 100,
      output: {
        html: generateMockHTML(job.input.prompt || 'Generated component'),
        css: generateMockCSS(),
        js: generateMockJS(job.input.framework || 'react'),
        assets: ['hero-bg.jpg', 'icon.svg'],
        preview_url: '/preview/' + job.id,
        mapping: {
          'hero-section': { source: 'frame_0', elements: ['title', 'subtitle', 'cta'] },
          'features': { source: 'frame_1', elements: ['feature-1', 'feature-2'] }
        }
      },
      updated_at: new Date()
    };

    setActiveJobs(prev => prev.filter(j => j.id !== job.id));
    setCompletedJobs(prev => [completedJob, ...prev]);
  };

  const generateMockHTML = (prompt: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">${prompt}</h1>
            <p class="hero-subtitle">AI-generated component with responsive design</p>
            <button class="cta-button">Get Started</button>
        </div>
    </section>
    <script src="app.js"></script>
</body>
</html>`;

  const generateMockCSS = () => `/* AI-Generated Styles */
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

@media (max-width: 768px) {
    .hero-title { font-size: 2rem; }
    .hero-subtitle { font-size: 1rem; }
    .cta-button { padding: 0.8rem 1.5rem; }
}`;

  const generateMockJS = (framework: string) => {
    if (framework === 'react') {
      return `import React from 'react';
import './styles.css';

const HeroComponent = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">AI-Generated Component</h1>
        <p className="hero-subtitle">Responsive design with animations</p>
        <button className="cta-button" onClick={() => console.log('CTA clicked')}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroComponent;`;
    }
    
    return `// Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', function() {
        console.log('CTA clicked');
        // Add your custom logic here
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });
    
    document.querySelectorAll('.hero-content').forEach(el => {
        observer.observe(el);
    });
});`;
  };

  const downloadCode = (job: AIJob) => {
    if (!job.output) return;
    
    const files = {
      'index.html': job.output.html,
      'styles.css': job.output.css,
      'app.js': job.output.js,
      'mapping.json': JSON.stringify(job.output.mapping, null, 2)
    };

    // Create and download zip (simplified)
    Object.entries(files).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const getJobIcon = (job: AIJob) => {
    switch (job.status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'analyzing':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'generating':
        return <Code className="w-4 h-4 text-purple-500" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getJobPrism = (job: AIJob) => {
    switch (job.status) {
      case 'analyzing':
        return <AIAnalyzingPrism size="sm" />;
      case 'generating':
        return <AIGeneratingPrism size="sm" />;
      default:
        return <AIProcessingPrism size="sm" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Generation
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Framework
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="react">React Component</option>
              <option value="vue">Vue Component</option>
              <option value="plain">Vanilla HTML/CSS/JS</option>
            </select>
          </div>

          <button
            onClick={() => startGeneration('Hero section with CTA', selectedFramework)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Generate Code
          </button>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Processing</h4>
          {activeJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getJobIcon(job)}
                  <span className="text-sm font-medium text-foreground capitalize">
                    {job.status}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {job.progress}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {(job.status === 'analyzing' || job.status === 'generating') && (
                <div className="flex justify-center">
                  {getJobPrism(job)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Generated Code</h4>
          {completedJobs.slice(0, 3).map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">
                    {job.input.framework?.toUpperCase()} Component
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {job.updated_at.toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {job.input.prompt || 'Generated from uploaded design'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadCode(job)}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-border rounded text-xs hover:bg-surface-variant transition-colors">
                  <Play className="w-3 h-3" />
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => startAnalysis(['mock-asset-1'])}
            className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
          >
            <Eye className="w-4 h-4 text-primary mb-2" />
            <div className="text-xs font-medium">Analyze Design</div>
          </button>
          <button className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left">
            <RotateCcw className="w-4 h-4 text-primary mb-2" />
            <div className="text-xs font-medium">Refine Code</div>
          </button>
        </div>
      </div>
    </div>
  );
}