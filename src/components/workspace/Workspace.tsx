'use client';

import { useState } from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import UploadAnalysisPanel from './UploadAnalysisPanel';
import MonacoEditor from './MonacoEditor';

export default function DesignerWorkspace() {
  const { activePanel, setActivePanel } = useDesignStore();

  return (
    <div className="flex-1 flex bg-transparent">
      {/* Left Sidebar - Designer Navigation */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
        <DesignerSidebar />
      </div>

      {/* Center Canvas Area - Visual Editor + Code IDE */}
      <div className="flex-1 flex flex-col">
        {/* Designer Toolbar */}
        <div className="h-12 bg-black/20 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setActivePanel('canvas')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activePanel === 'canvas' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Canvas
              </button>
              <button 
                onClick={() => setActivePanel('code')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activePanel === 'code' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Code
              </button>
              <button 
                onClick={() => setActivePanel('preview')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activePanel === 'preview' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
              AI Analyze
            </button>
            <button className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">
              Generate
            </button>
          </div>
        </div>

        {/* Main Workspace Content */}
        <div className="flex-1 flex flex-col">
          <WorkspaceContent />
        </div>
      </div>

      {/* Right Sidebar - Community Code Repository */}
      <div className="w-80 bg-black/20 backdrop-blur-sm border-l border-white/10 flex flex-col">
        <CommunityCodeRepository />
      </div>
    </div>
  );
}

// Designer Workspace Sidebar - Following Architecture
function DesignerSidebar() {
  const { assets, currentProject } = useDesignStore();
  const [activeSection, setActiveSection] = useState('upload');

  const sidebarSections = [
    { id: 'upload', label: 'Media Upload', icon: '📤', description: 'Upload images/videos' },
    { id: 'elements', label: 'Design Elements', icon: '🎨', description: 'Canvas elements' },
    { id: 'assets', label: 'Project Assets', icon: '🖼️', description: 'Uploaded files' },
    { id: 'ai', label: 'AI Pipeline', icon: '🤖', description: 'AI processing' },
    { id: 'templates', label: 'Templates', icon: '📋', description: 'Design templates' },
    { id: 'export', label: 'Export/Deploy', icon: '📦', description: 'Download & deploy' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Designer Studio</h2>
        <p className="text-xs text-white/60 mt-1">
          {currentProject?.title || 'No project selected'}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-start space-x-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors ${
              activeSection === section.id ? 'bg-blue-500/20 border-r-2 border-blue-400' : ''
            }`}
          >
            <span className="text-lg mt-0.5">{section.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white/90 font-medium">{section.label}</div>
              <div className="text-xs text-white/60">{section.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/70 space-y-1">
          <div className="flex justify-between">
            <span>Assets:</span>
            <span>{assets.length}</span>
          </div>
          <div className="flex justify-between">
            <span>AI Jobs:</span>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Workspace Content - Switches between Canvas, Code, Preview
function WorkspaceContent() {
  const { activePanel } = useDesignStore();
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Design Project</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Open Design</h1>
        <p>Start building amazing designs with AI-powered tools!</p>
    </div>
</body>
</html>`);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  switch (activePanel) {
    case 'canvas':
      return <UploadAnalysisPanel />;
    case 'code':
      return (
        <div className="flex-1 p-4">
          <MonacoEditor
            value={code}
            onChange={handleCodeChange}
            language="html"
            theme="vs-dark"
            height="calc(100vh - 200px)"
          />
        </div>
      );
    case 'preview':
      return <Preview />;
    case 'ai':
      return <EnhancedAIAssistant />;
    default:
      return <UploadAnalysisPanel />;
  }
}

// Community Code Repository - Following Architecture
function CommunityCodeRepository() {
  const [activeTab, setActiveTab] = useState<'browse' | 'submit' | 'training'>('browse');
  
  const communitySnippets = [
    {
      id: '1',
      title: 'Hero Video Animation',
      author: 'Sarah Chen',
      tags: ['hero', 'video-slice', 'animation'],
      framework: 'React',
      rating: 4.8,
      downloads: 234,
      preview: '👩‍💻'
    },
    {
      id: '2', 
      title: 'Dark Mode Toggle',
      author: 'Alex Rivera',
      tags: ['toggle', 'dark-mode', 'ui'],
      framework: 'Vue',
      rating: 4.6,
      downloads: 189,
      preview: '🌙'
    },
    {
      id: '3',
      title: 'Grid Animation Cards',
      author: 'Jordan Kim',
      tags: ['grid', 'cards', 'animation'],
      framework: 'React',
      rating: 4.9,
      downloads: 312,
      preview: '📱'
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with tabs */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white mb-3">Community Code Library</h2>
        <div className="flex space-x-1">
          {[
            { id: 'browse', label: 'Browse', icon: '🔍' },
            { id: 'submit', label: 'Submit', icon: '📤' },
            { id: 'training', label: 'Training', icon: '🧠' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'browse' && (
          <div className="space-y-3">
            {communitySnippets.map((snippet) => (
              <div key={snippet.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 cursor-pointer transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-sm">
                    {snippet.preview}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{snippet.title}</div>
                    <div className="text-xs text-white/70">by {snippet.author}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-yellow-400">★ {snippet.rating}</span>
                      <span className="text-xs text-white/60">↓ {snippet.downloads}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-1 rounded">{snippet.framework}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {snippet.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-white/10 text-white/70 px-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 mt-2">
                  <button className="px-2 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20">
                    View
                  </button>
                  <button className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="space-y-4">
            <div className="text-sm text-white/90 font-medium">Submit Your Code</div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Component title"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/50 text-sm"
              />
              <textarea
                placeholder="Description and usage"
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/50 text-sm resize-none"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-white/50 text-sm"
              />
              <button className="w-full px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">
                Submit to Library
              </button>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="text-sm text-white/90 font-medium">AI Training Pipeline</div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-white/70 mb-1">Training Status</div>
                <div className="text-sm text-green-400">Model v2.1 - Active</div>
                <div className="text-xs text-white/60 mt-1">Last updated: 2 hours ago</div>
              </div>
              <div className="bg-white/5 rounded p-3">
                <div className="text-xs text-white/70 mb-1">Community Contributions</div>
                <div className="text-sm text-white">1,247 verified snippets</div>
                <div className="text-xs text-white/60 mt-1">Used for model fine-tuning</div>
              </div>
              <button className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                View Training Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

