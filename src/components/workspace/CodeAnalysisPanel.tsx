'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Eye, 
  Download, 
  Copy,
  FileText,
  Layers,
  Palette,
  Zap
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

export default function CodeAnalysisPanel() {
  const [activeTab, setActiveTab] = useState(0);

  const visionItems = [
    { id: 'mempool', label: 'Mempool', icon: '🔄', active: false },
    { id: 'particle1', label: 'Particle effect', icon: '✨', active: true },
    { id: 'particle2', label: 'Particle effect', icon: '✨', active: false },
    { id: 'interaction', label: 'Interaction UI component', icon: '🎯', active: false },
    { id: 'hover', label: 'Hover effect', icon: '👆', active: false },
    { id: 'scroll', label: 'Scroll interaction', icon: '📜', active: false },
  ];

  const { htmlCode, cssCode, jsCode } = useDesignStore();
  
  const codeSnippets = [
    {
      language: 'React JSX',
      code: jsCode || `import React, { useEffect, useState } from 'react';
import './Hero.module.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className={\`hero-title \${isVisible ? 'animate-in' : ''}\`}>
          Welcome to the Future
        </h1>
        <p className={\`hero-subtitle \${isVisible ? 'animate-in delay-1' : ''}\`}>
          Innovation starts here
        </p>
        <button className={\`cta-button \${isVisible ? 'animate-in delay-2' : ''}\`}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;`
    },
    {
      language: 'CSS Animations',
      code: cssCode || `.hero-section {
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 10;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.delay-1 { transition-delay: 0.5s; }
.delay-2 { transition-delay: 1s; }`
    },
    {
      language: 'HTML Preview',
      code: htmlCode || `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hero Section</title>
    <link rel="stylesheet" href="Hero.module.css">
</head>
<body>
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title animate-in">Welcome to the Future</h1>
            <p class="hero-subtitle animate-in delay-1">Innovation starts here</p>
            <button class="cta-button animate-in delay-2">Get Started</button>
        </div>
    </section>
</body>
</html>`
    }
  ];

  return (
    <div className="h-80 bg-slate-900 border-t border-slate-700 flex">
      {/* Left Panel - Desired Vision */}
      <div className="w-1/2 border-r border-slate-700 flex flex-col">
        <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
          <h3 className="text-white text-sm font-medium">Desired Vision</h3>
          <button className="text-slate-400 hover:text-white">
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {visionItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white">{item.label}</span>
                {item.active && (
                  <div className="ml-auto text-xs text-blue-400">+5%</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Generated Code */}
      <div className="w-1/2 flex flex-col">
        <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
          <h3 className="text-white text-sm font-medium">Generated Code</h3>
          <div className="flex items-center space-x-2">
            <button className="text-slate-400 hover:text-white">
              <Copy className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-white">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {/* Code Tabs */}
          <div className="flex border-b border-slate-700">
            {codeSnippets.map((snippet, index) => (
              <button
                key={snippet.language}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  activeTab === index 
                    ? 'bg-slate-700 text-white border-b-2 border-blue-500' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {snippet.language}
              </button>
            ))}
          </div>
          
          {/* Code Content */}
          <div className="h-full overflow-y-auto bg-slate-900">
            <pre className="p-4 text-xs text-slate-300 font-mono leading-relaxed">
              <code>{codeSnippets[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}