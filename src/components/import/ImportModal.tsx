'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import MiniLoadingScreen from '../ui/MiniLoadingScreen';
import { 
  Upload, 
  FileText, 
  Image, 
  Code, 
  X,
  Check,
  AlertCircle,
  Folder,
  Link,
  Github,
  Figma
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { addProject, setHtmlCode, setCssCode, setJsCode } = useDesignStore();
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'template'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importUrl, setImportUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importTabs = [
    { id: 'file', label: 'Upload Files', icon: Upload },
    { id: 'url', label: 'Import from URL', icon: Link },
    { id: 'template', label: 'Templates', icon: Folder }
  ];

  const templates = [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'Modern landing page with hero section',
      preview: '/templates/landing-page.png',
      category: 'Marketing'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Admin dashboard with charts and tables',
      preview: '/templates/dashboard.png',
      category: 'Admin'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Creative portfolio showcase',
      preview: '/templates/portfolio.png',
      category: 'Portfolio'
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Clean blog layout with sidebar',
      preview: '/templates/blog.png',
      category: 'Content'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Product showcase and shopping cart',
      preview: '/templates/ecommerce.png',
      category: 'E-commerce'
    },
    {
      id: 'saas',
      name: 'SaaS Landing',
      description: 'Software as a Service landing page',
      preview: '/templates/saas.png',
      category: 'SaaS'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setImporting(true);
    setImportStatus('idle');

    try {
      const file = files[0];
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.html') || fileType === 'text/html') {
        const content = await file.text();
        setHtmlCode(content);
        setImportStatus('success');
      } else if (fileName.endsWith('.css') || fileType === 'text/css') {
        const content = await file.text();
        setCssCode(content);
        setImportStatus('success');
      } else if (fileName.endsWith('.js') || fileType === 'application/javascript') {
        const content = await file.text();
        setJsCode(content);
        setImportStatus('success');
      } else if (fileName.endsWith('.zip')) {
        // Handle ZIP files (would need JSZip library)
        console.log('ZIP file import would be handled here');
        setImportStatus('success');
      } else if (fileType.startsWith('image/')) {
        // Handle image imports
        console.log('Image import would be handled here');
        setImportStatus('success');
      } else {
        throw new Error('Unsupported file type');
      }

      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    } finally {
      setImporting(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUrlImport = async () => {
    if (!importUrl.trim()) return;

    setImporting(true);
    setImportStatus('idle');

    try {
      // Simulate URL import (in real app, this would fetch from the URL)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (importUrl.includes('github.com')) {
        // Handle GitHub repository import
        console.log('GitHub import:', importUrl);
      } else if (importUrl.includes('figma.com')) {
        // Handle Figma import
        console.log('Figma import:', importUrl);
      } else if (importUrl.includes('codepen.io')) {
        // Handle CodePen import
        console.log('CodePen import:', importUrl);
      } else {
        // Handle generic URL import
        console.log('Generic URL import:', importUrl);
      }

      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('URL import error:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    } finally {
      setImporting(false);
    }
  };

  const handleTemplateImport = (templateId: string) => {
    setImporting(true);
    
    // Simulate template import
    setTimeout(() => {
      const templateData = getTemplateData(templateId);
      
      addProject({
        name: templateData.name,
        description: templateData.description,
        elements: [],
        html: templateData.html,
        css: templateData.css,
        js: templateData.js
      });

      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 1000);
      setImporting(false);
    }, 2000);
  };

  const getTemplateData = (templateId: string) => {
    const templates: Record<string, any> = {
      'landing-page': {
        name: 'Landing Page Template',
        description: 'Modern landing page with hero section and features',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">Brand</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>Build Amazing Products</h1>
                <p>Create stunning designs with our powerful tools and AI assistance.</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section class="features">
            <div class="container">
                <h2>Features</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>AI-Powered</h3>
                        <p>Leverage AI to create designs faster than ever.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Responsive</h3>
                        <p>All designs are mobile-first and responsive.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Export Ready</h3>
                        <p>Export to multiple formats with one click.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`,
        css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3b82f6;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #3b82f6;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
    margin-top: 80px;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
}

.features {
    padding: 4rem 2rem;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s;
}

.feature-card:hover {
    transform: translateY(-4px);
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #3b82f6;
}

.feature-card p {
    color: #6b7280;
}`,
        js: `// Landing page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA button interaction
    document.querySelector('.cta-button').addEventListener('click', function() {
        alert('Welcome! This would typically redirect to a signup page.');
    });
});`
      }
    };

    return templates[templateId] || templates['landing-page'];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-container rounded-lg border border-border w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Import Project</h2>
                <p className="text-muted-foreground mt-1">
                  Import designs from files, URLs, or templates
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mt-6 bg-muted rounded-lg p-1">
              {importTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'file' && (
              <div className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border-hover'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Supports HTML, CSS, JS, ZIP, and image files
                  </p>
                  <button
                    onClick={handleFileSelect}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".html,.css,.js,.zip,.png,.jpg,.jpeg,.svg"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Supported Formats */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Supported Formats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { type: 'HTML', desc: 'Web pages', icon: FileText },
                      { type: 'CSS', desc: 'Stylesheets', icon: Code },
                      { type: 'JS', desc: 'JavaScript', icon: Code },
                      { type: 'ZIP', desc: 'Archives', icon: Folder }
                    ].map((format) => {
                      const Icon = format.icon;
                      return (
                        <div key={format.type} className="p-3 bg-muted rounded-lg text-center">
                          <Icon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                          <div className="font-medium text-sm">{format.type}</div>
                          <div className="text-xs text-muted-foreground">{format.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Import from URL
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="url"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://github.com/user/repo or https://codepen.io/pen/..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={handleUrlImport}
                      disabled={!importUrl.trim() || importing}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import
                    </button>
                  </div>
                </div>

                {/* Supported Platforms */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Supported Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { name: 'GitHub', desc: 'Import from repositories', icon: Github, url: 'github.com' },
                      { name: 'CodePen', desc: 'Import from pens', icon: Code, url: 'codepen.io' },
                      { name: 'Figma', desc: 'Import designs', icon: Figma, url: 'figma.com' }
                    ].map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.name} className="p-4 bg-muted rounded-lg">
                          <Icon className="w-8 h-8 text-muted-foreground mb-3" />
                          <div className="font-medium text-sm">{platform.name}</div>
                          <div className="text-xs text-muted-foreground mb-2">{platform.desc}</div>
                          <div className="text-xs text-primary">{platform.url}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'template' && (
              <div className="space-y-6">
                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -2 }}
                      className="bg-muted rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => handleTemplateImport(template.id)}
                    >
                      {/* Preview */}
                      <div className="aspect-video bg-background flex items-center justify-center">
                        <div className="text-muted-foreground">
                          <Image className="w-8 h-8" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground">{template.name}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {importStatus !== 'idle' && (
            <div className="px-6 pb-4">
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                importStatus === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {importStatus === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {importStatus === 'success' 
                    ? 'Import successful!' 
                    : 'Import failed. Please try again.'}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {importing && 'Importing...'}
              </div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Import Loading Overlay */}
          {importing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
              <MiniLoadingScreen 
                message="Importing project..."
                size="md"
                showPrism={true}
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}