'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Brain, 
  Code, 
  Eye, 
  Download,
  Play,
  Settings,
  Zap,
  Layers,
  Palette,
  Type,
  MousePointer
} from 'lucide-react';
import UploadWidget from './UploadWidget';
import AIStatusPanel from './AIStatusPanel';
import { useDesignStore } from '@/store/useDesignStore';
import { AIThinkingPrism, AIAnalyzingPrism, AIGeneratingPrism } from '../ui/PrismLoadingSystem';

interface AnalysisResult {
  id: string;
  status: 'analyzing' | 'complete' | 'error';
  progress: number;
  result?: {
    layout: string;
    elements: any[];
    colors: string[];
    typography: any;
    animations: any[];
    responsiveBreakpoints: any[];
  };
}

export default function AIIntegrationPanel() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze' | 'generate' | 'status'>('upload');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vue' | 'angular' | 'plain'>('react');
  const [generationOptions, setGenerationOptions] = useState({
    responsive: true,
    animations: true,
    accessibility: true,
    optimization: true
  });

  const { assets, htmlCode, cssCode, jsCode } = useDesignStore();

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload, description: 'Upload designs for analysis' },
    { id: 'analyze', label: 'Analyze', icon: Eye, description: 'AI visual analysis' },
    { id: 'generate', label: 'Generate', icon: Code, description: 'Generate production code' },
    { id: 'status', label: 'Status', icon: Brain, description: 'Processing status' }
  ];

  const startAnalysis = async (assetIds: string[]) => {
    const analysisJob: AnalysisResult = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'analyzing',
      progress: 0
    };

    setAnalysisResults(prev => [...prev, analysisJob]);

    // Simulate analysis process
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAnalysisResults(prev => prev.map(result =>
        result.id === analysisJob.id ? { ...result, progress } : result
      ));
    }

    // Complete analysis
    const mockResult = {
      layout: 'hero-section',
      elements: [
        { type: 'heading', content: 'Main Title', level: 1 },
        { type: 'paragraph', content: 'Subtitle text' },
        { type: 'button', content: 'Call to Action', variant: 'primary' }
      ],
      colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
      typography: {
        primary: { family: 'Inter', weights: [400, 600, 700] },
        secondary: { family: 'Roboto', weights: [300, 400] }
      },
      animations: [
        { type: 'fadeIn', duration: 1000, delay: 0 },
        { type: 'slideUp', duration: 800, delay: 200 }
      ],
      responsiveBreakpoints: [
        { name: 'mobile', maxWidth: 768 },
        { name: 'tablet', maxWidth: 1024 },
        { name: 'desktop', minWidth: 1025 }
      ]
    };

    setAnalysisResults(prev => prev.map(result =>
      result.id === analysisJob.id ? { 
        ...result, 
        status: 'complete', 
        progress: 100,
        result: mockResult 
      } : result
    ));
  };

  const generateCode = async (analysisId: string) => {
    const analysis = analysisResults.find(a => a.id === analysisId);
    if (!analysis?.result) return;

    // This would call the backend generate-code endpoint
    console.log('Generating code for analysis:', analysisId);
    console.log('Framework:', selectedFramework);
    console.log('Options:', generationOptions);
  };

  const renderUploadTab = () => (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Upload Design Assets</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload images, videos, animations, or Figma exports to generate code
        </p>
      </div>
      <UploadWidget />
      
      {assets.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploaded Assets</h4>
          <div className="space-y-2">
            {assets.slice(0, 3).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    {asset.type === 'image' && <Eye className="w-4 h-4" />}
                    {asset.type === 'video' && <Play className="w-4 h-4" />}
                    {asset.type === 'animation' && <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => startAnalysis([asset.id])}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                >
                  Analyze
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalyzeTab = () => (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Visual Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">
          AI-powered analysis of your uploaded designs
        </p>
      </div>

      {analysisResults.length === 0 ? (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No analysis results yet</p>
          <p className="text-sm text-muted-foreground">Upload assets to start analysis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analysisResults.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Analysis #{result.id.slice(-4)}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  result.status === 'complete' ? 'bg-green-100 text-green-800' :
                  result.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
              </div>

              {result.status === 'analyzing' && (
                <div className="flex justify-center py-4">
                  <AIAnalyzingPrism size="sm" />
                </div>
              )}

              {result.status === 'complete' && result.result && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3 h-3 text-primary" />
                      <span>{result.result.elements.length} elements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3 text-primary" />
                      <span>{result.result.colors.length} colors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Type className="w-3 h-3 text-primary" />
                      <span>{Object.keys(result.result.typography).length} fonts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-3 h-3 text-primary" />
                      <span>{result.result.animations.length} animations</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => generateCode(result.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    <Code className="w-4 h-4" />
                    Generate Code
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGenerateTab = () => (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Code Generation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate production-ready code from your designs
        </p>
      </div>

      {/* Framework Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Target Framework</label>
        <select
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value as any)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="react">React Component</option>
          <option value="vue">Vue Component</option>
          <option value="angular">Angular Component</option>
          <option value="plain">Vanilla HTML/CSS/JS</option>
        </select>
      </div>

      {/* Generation Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Generation Options</label>
        <div className="space-y-2">
          {Object.entries(generationOptions).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <button
                onClick={() => setGenerationOptions(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  value ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() => console.log('Generate code with options:', { selectedFramework, generationOptions })}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        <AIGeneratingPrism size="sm" />
        <span>Generate {selectedFramework.toUpperCase()} Code</span>
      </button>

      {/* Recent Generations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Recent Generations</h4>
        <div className="space-y-2">
          <div className="p-3 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Hero Component</span>
              <span className="text-xs text-green-600">Complete</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                <Download className="w-3 h-3" />
                Download
              </button>
              <button className="flex items-center gap-1 px-2 py-1 border border-border rounded text-xs">
                <Play className="w-3 h-3" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatusTab = () => (
    <div className="p-4">
      <AIStatusPanel />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return renderUploadTab();
      case 'analyze':
        return renderAnalyzeTab();
      case 'generate':
        return renderGenerateTab();
      case 'status':
        return renderStatusTab();
      default:
        return renderUploadTab();
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface-container">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Integration</h3>
            <p className="text-xs text-muted-foreground">Upload → Analyze → Generate</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-md text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={tab.description}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{tab.label}</span>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="ai-tab-indicator"
                    className="absolute inset-0 bg-background rounded-md shadow-sm"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{assets.length}</div>
            <div className="text-xs text-muted-foreground">Assets</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{analysisResults.length}</div>
            <div className="text-xs text-muted-foreground">Analyzed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {analysisResults.filter(r => r.status === 'complete').length}
            </div>
            <div className="text-xs text-muted-foreground">Generated</div>
          </div>
        </div>
      </div>
    </div>
  );
}