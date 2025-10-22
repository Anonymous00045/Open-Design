'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Palette,
  Layout,
  Wand2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Settings,
  Upload
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import { AIThinkingPrism } from '../ui/PrismLoadingSystem';
import { VercelV0Chat } from '@/components/ai/VercelV0Chat';
import UploadWidget from './UploadWidget';
import AIStatusPanel from './AIStatusPanel';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AIAssistant() {
  const [activeMode, setActiveMode] = useState<'chat' | 'settings'>('chat');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI design assistant. I can help you create components, generate code, and improve your designs. What would you like to work on?',
      timestamp: new Date(),
      suggestions: ["Create a new component", "Improve existing design", "Add animations"]
    }
  ]);
  
  const { 
    setHtmlCode, 
    setCssCode, 
    setJsCode,
    htmlCode, 
    cssCode, 
    jsCode,
    canvasElements,
    addElement 
  } = useDesignStore();

  const renderModeContent = () => {
    switch (activeMode) {
      case 'settings':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">AI Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">AI Model</label>
                <select className="w-full p-2 border border-border rounded-lg bg-surface">
                  <option>GPT-4</option>
                  <option>Claude-3</option>
                  <option>Gemini Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Creativity Level</label>
                <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interface Style</label>
                <select className="w-full p-2 border border-border rounded-lg bg-surface">
                  <option>V0-Style Interface</option>
                  <option>Conversational Chat</option>
                  <option>Code Generation</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col">
            {/* V0-Style Interface as Main */}
            <div className="flex-1 overflow-hidden">
              <VercelV0Chat />
            </div>
            
            {/* Chat History (Collapsible) */}
            {showChatHistory && (
              <div className="border-t border-border bg-surface-container max-h-48 overflow-y-auto">
                <div className="p-3">
                  <h4 className="text-sm font-medium mb-2">Recent Conversations</h4>
                  <div className="space-y-2">
                    {messages.slice(-3).map((message) => (
                      <div key={message.id} className="text-xs p-2 bg-surface rounded border border-border">
                        <div className="flex items-center space-x-1 mb-1">
                          {message.type === 'ai' ? (
                            <Bot className="w-3 h-3 text-primary" />
                          ) : (
                            <User className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="font-medium">{message.type === 'ai' ? 'AI' : 'You'}</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Toggle Chat History */}
            <div className="border-t border-border bg-surface-container">
              <div className="p-3">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 w-full"
                  onClick={() => setShowChatHistory(!showChatHistory)}
                >
                  <span>Recent Conversations</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showChatHistory ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          </div>
          <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeMode === 'chat' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Assistant
            </button>
            <button
              onClick={() => setActiveMode('settings')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeMode === 'settings' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderModeContent()}
      </div>
    </div>
  );
}