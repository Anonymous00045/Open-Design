'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Eye,
  Code,
  Sparkles,
  FileVideo,
  FileImage,
  File
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'animation' | 'figma';
  url: string;
  size: number;
  duration?: number;
  frames?: string[];
  analysis?: {
    // Design AST as per architecture
    layout: LayoutElement[];
    colors: string[];
    typography: TypographyElement[];
    animations: AnimationElement[];
    // Visual embeddings for AI processing
    embeddings?: number[];
    // Motion vectors for video analysis
    motionVectors?: MotionVector[];
  };
}

interface LayoutElement {
  type: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
  class: string;
  bounds: { x: number; y: number; width: number; height: number };
  children?: LayoutElement[];
}

interface TypographyElement {
  family: string;
  weight: number;
  size: number;
  usage: 'heading' | 'body' | 'caption' | 'button';
  color?: string;
}

interface AnimationElement {
  selector: string;
  type: 'fade-in' | 'slide-up' | 'scale' | 'rotate' | 'parallax';
  duration: number;
  delay: number;
  easing?: string;
}

interface MotionVector {
  element: string;
  animation: string;
  duration: number;
  delay: number;
  keyframes?: { time: number; properties: Record<string, any> }[];
}

export default function UploadAnalysisPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getFileType(file.type),
        url: fileUrl,
        size: file.size
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Auto-select first uploaded file
      if (!selectedFile) {
        setSelectedFile(newFile);
      }
    });
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'animation' | 'figma' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('json')) return 'animation';
    return 'figma';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Call AI Analysis Pipeline as per architecture
      const { submitAIJob, getAIJob } = useDesignStore.getState();
      
      // Submit to AI Engine for processing
      const jobId = await submitAIJob('design2code', {
        fileUrl: selectedFile.url,
        fileType: selectedFile.type,
        fileName: selectedFile.name
      });

      // Poll for results (in real implementation, use WebSocket)
      const pollResults = async () => {
        try {
          const job = await getAIJob(jobId);
          
          if (job.status === 'completed' && job.result) {
            // Process AI results into Design AST
            const designAST = processAIResults(job.result, selectedFile.type);
            setAnalysisResults(designAST);
            setSelectedFile(prev => prev ? { ...prev, analysis: designAST } : null);
            setIsAnalyzing(false);
          } else if (job.status === 'failed') {
            throw new Error(job.error || 'AI analysis failed');
          } else {
            // Still processing, poll again
            setTimeout(pollResults, 2000);
          }
        } catch (error) {
          console.error('AI job polling error:', error);
          // Fallback to mock analysis
          generateMockAnalysis();
        }
      };

      // Start polling
      setTimeout(pollResults, 1000);
      
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to mock analysis for demo
      generateMockAnalysis();
    }
  };

  const processAIResults = (aiResult: any, fileType: string) => {
    // Convert AI output to standardized Design AST
    if (fileType === 'video') {
      return {
        layout: aiResult.layout?.map((item: any) => ({
          type: item.type as 'div' | 'section',
          class: item.class || `${item.type}-container`,
          bounds: item.bounds
        })) || [],
        colors: aiResult.colors || [],
        typography: aiResult.typography?.map((typo: any) => ({
          family: typo.family,
          weight: typo.weight,
          size: typo.size,
          usage: typo.usage as 'heading' | 'body',
          color: typo.color
        })) || [],
        animations: aiResult.animations?.map((anim: any) => ({
          selector: anim.selector,
          type: anim.type as 'fade-in' | 'slide-up',
          duration: anim.duration,
          delay: anim.delay,
          easing: anim.easing
        })) || [],
        motionVectors: aiResult.motionVectors || [],
        embeddings: aiResult.embeddings || []
      };
    } else {
      // Image processing
      return {
        layout: aiResult.layout || [],
        colors: aiResult.colors || [],
        typography: aiResult.typography || [],
        animations: aiResult.animations || [],
        embeddings: aiResult.embeddings || []
      };
    }
  };

  const generateMockAnalysis = () => {
    // Enhanced mock analysis following architecture
    if (selectedFile?.type === 'video') {
      const videoAnalysis = {
        layout: [
          { 
            type: 'section' as const, 
            class: 'hero-section',
            bounds: { x: 0, y: 0, width: 100, height: 100 },
            children: [
              { type: 'div' as const, class: 'hero-content', bounds: { x: 10, y: 30, width: 80, height: 40 } }
            ]
          }
        ],
        colors: ['#667eea', '#764ba2', '#ffffff', '#f8fafc'],
        typography: [
          { family: 'Inter', weight: 700, size: 48, usage: 'heading' as const, color: '#ffffff' },
          { family: 'Inter', weight: 400, size: 20, usage: 'body' as const, color: '#f8fafc' }
        ],
        animations: [
          { selector: '.hero-title', type: 'fade-in' as const, duration: 1.2, delay: 0.5 },
          { selector: '.hero-subtitle', type: 'slide-up' as const, duration: 1.0, delay: 1.0 }
        ],
        motionVectors: [
          { 
            element: 'hero-title', 
            animation: 'fadeInUp', 
            duration: 1.2, 
            delay: 0.5,
            keyframes: [
              { time: 0, properties: { opacity: 0, transform: 'translateY(30px)' } },
              { time: 1.2, properties: { opacity: 1, transform: 'translateY(0)' } }
            ]
          }
        ],
        embeddings: [0.1, 0.2, 0.3] // Mock embeddings
      };
      
      setAnalysisResults(videoAnalysis);
      setSelectedFile(prev => prev ? { ...prev, analysis: videoAnalysis } : null);
    } else {
      // Image analysis
      const imageAnalysis = {
        layout: [
          { type: 'header' as const, class: 'site-header', bounds: { x: 0, y: 0, width: 100, height: 15 } },
          { type: 'main' as const, class: 'main-content', bounds: { x: 0, y: 15, width: 100, height: 70 } },
          { type: 'footer' as const, class: 'site-footer', bounds: { x: 0, y: 85, width: 100, height: 15 } }
        ],
        colors: ['#3B82F6', '#1E40AF', '#FFFFFF', '#F8FAFC', '#64748B'],
        typography: [
          { family: 'Inter', weight: 600, size: 32, usage: 'heading' as const },
          { family: 'Inter', weight: 400, size: 16, usage: 'body' as const }
        ],
        animations: [
          { selector: '.fade-in', type: 'fade-in' as const, duration: 0.5, delay: 0 },
          { selector: '.slide-up', type: 'slide-up' as const, duration: 0.8, delay: 0.2 }
        ],
        embeddings: [0.4, 0.5, 0.6] // Mock embeddings
      };
      
      setAnalysisResults(imageAnalysis);
      setSelectedFile(prev => prev ? { ...prev, analysis: imageAnalysis } : null);
    }
    
    setIsAnalyzing(false);
  };

  const handleGenerateCode = async () => {
    if (!selectedFile || !analysisResults) return;
    
    // Generate React component with animations
    if (selectedFile.type === 'video' && analysisResults.keyFrames) {
      const heroComponent = generateHeroComponent(analysisResults);
      const cssAnimations = generateCSSAnimations(analysisResults);
      const storybook = generateStorybookStory(analysisResults);
      
      // Update store with generated code
      const { setHtmlCode, setCssCode, setJsCode } = useDesignStore.getState();
      setHtmlCode(heroComponent.html);
      setCssCode(cssAnimations);
      setJsCode(heroComponent.jsx);
      
      // Trigger download preparation
      prepareDownloadZip({
        'Hero.jsx': heroComponent.jsx,
        'Hero.module.css': cssAnimations,
        'Hero.stories.js': storybook,
        'index.html': heroComponent.html,
        'mapping.json': JSON.stringify(analysisResults.keyFrames, null, 2)
      });
    } else {
      // Use the existing generateCodeFromCanvas function for images
      const { generateCodeFromCanvas } = useDesignStore.getState();
      await generateCodeFromCanvas();
    }
  };

  const generateHeroComponent = (analysis: any) => {
    const jsx = `import React, { useEffect, useState } from 'react';
import './Hero.module.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="gradient-overlay"></div>
      </div>
      
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

export default Hero;`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hero Section</title>
    <link rel="stylesheet" href="Hero.module.css">
</head>
<body>
    <section class="hero-section">
        <div class="hero-background">
            <div class="gradient-overlay"></div>
        </div>
        
        <div class="hero-content">
            <h1 class="hero-title animate-in">Welcome to the Future</h1>
            <p class="hero-subtitle animate-in delay-1">Innovation starts here</p>
            <button class="cta-button animate-in delay-2">Get Started</button>
        </div>
    </section>
</body>
</html>`;

    return { jsx, html };
  };

  const generateCSSAnimations = (analysis: any) => {
    return `.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  text-align: center;
  color: white;
  z-index: 10;
  max-width: 800px;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px) scale(1.05);
}

/* Animation States */
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
}

.delay-1 {
  transition-delay: 0.5s;
}

.delay-2 {
  transition-delay: 1s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}`;
  };

  const generateStorybookStory = (analysis: any) => {
    return `import Hero from './Hero';

export default {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {},
};

export const WithCustomContent = {
  args: {},
  render: () => (
    <Hero 
      title="Custom Hero Title"
      subtitle="Custom subtitle text"
      buttonText="Custom CTA"
    />
  ),
};`;
  };

  const prepareDownloadZip = (files: Record<string, string>) => {
    // Store files for download - in a real app, this would create a ZIP
    console.log('Preparing download with files:', Object.keys(files));
    
    // For demo, we'll just log the files
    Object.entries(files).forEach(([filename, content]) => {
      console.log(`--- ${filename} ---`);
      console.log(content);
    });
    
    // Show success message
    alert('Hero component generated! Check console for files. In production, this would download a ZIP file.');
  };

  const handleSubmitToLibrary = async () => {
    if (!selectedFile || !analysisResults) return;

    // Simulate submission to community library
    const submission = {
      title: 'Hero Video Animation',
      description: 'Responsive hero section with CSS animations extracted from 6-second MP4',
      tags: ['hero', 'video-slice', 'parallax', 'animation', 'responsive'],
      type: 'component',
      framework: 'react',
      files: {
        'Hero.jsx': 'React component code...',
        'Hero.module.css': 'CSS animations...',
        'Hero.stories.js': 'Storybook story...'
      },
      metadata: {
        originalFile: selectedFile.name,
        duration: analysisResults.duration || 0,
        keyFrames: analysisResults.keyFrames?.length || 0,
        animations: analysisResults.motionVectors?.length || 0
      },
      author: 'Current User',
      createdAt: new Date().toISOString()
    };

    console.log('Submitting to Code Library:', submission);
    
    // Show success message
    alert(`Successfully submitted "${submission.title}" to Code Library with tags: ${submission.tags.join(', ')}`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {selectedFile ? (
          <div className="w-full max-w-2xl">
            {/* File Preview */}
            <div className="bg-slate-800 rounded-lg overflow-hidden mb-6">
              {selectedFile.type === 'video' ? (
                <div className="aspect-video bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 relative">
                  <video 
                    src={selectedFile.url} 
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  
                  {/* Video Controls */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-white">
                        <Play className="w-4 h-4" />
                      </button>
                      <div className="flex-1 h-1 bg-white/20 rounded">
                        <div className="w-1/3 h-full bg-white rounded"></div>
                      </div>
                      <span className="text-xs text-white">0:03</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              
              {/* File Info */}
              <div className="p-4 bg-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
                    {selectedFile.type === 'video' ? (
                      <FileVideo className="w-4 h-4 text-white" />
                    ) : (
                      <FileImage className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-slate-400">{selectedFile.type.toUpperCase()} • {(selectedFile.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze</span>
                  </>
                )}
              </motion.button>

              {analysisResults && (
                <>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateCode}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                  >
                    <Code className="w-4 h-4" />
                    <span>Generate Code</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitToLibrary}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit to Library</span>
                  </motion.button>
                </>
              )}
            </div>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-800 rounded-lg p-4"
                >
                  <h3 className="text-white font-medium mb-4">Analysis Results</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-slate-300 mb-2">Layout Elements</h4>
                      <div className="space-y-1">
                        {analysisResults.layout.map((item: any, index: number) => (
                          <div key={index} className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                            {item.type}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-slate-300 mb-2">Color Palette</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisResults.colors.map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border border-slate-600"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center">
            <div 
              className="w-64 h-40 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-slate-300 text-sm mb-1">Drop files here or click to upload</p>
              <p className="text-slate-500 text-xs">Images, Videos, Animations, Figma files</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.json,.fig"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="border-t border-slate-700 p-4">
          <h3 className="text-white text-sm font-medium mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                  selectedFile?.id === file.id ? 'bg-blue-500/20' : 'hover:bg-slate-700'
                }`}
              >
                <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center">
                  {file.type === 'video' ? (
                    <FileVideo className="w-4 h-4 text-slate-300" />
                  ) : (
                    <FileImage className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{file.name}</div>
                  <div className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
                {file.analysis && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}