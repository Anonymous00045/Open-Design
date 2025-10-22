'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  Wand2, 
  Settings,
  Sparkles
} from 'lucide-react';
import { VercelV0Chat } from '@/components/ai/VercelV0Chat';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AIAssistant from './AIAssistant';

type AIMode = 'chat' | 'v0' | 'settings';

export default function EnhancedAIAssistant() {
  const [activeMode, setActiveMode] = useState<AIMode>('v0');

  const modes = [
    { id: 'v0', label: 'V0 Chat', icon: Wand2, description: 'Advanced AI design generation' },
    { id: 'chat', label: 'Assistant', icon: MessageSquare, description: 'Design help & guidance' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'AI preferences' },
  ];

  const renderContent = () => {
    switch (activeMode) {
      case 'v0':
        return <VercelV0Chat />;
      case 'chat':
        return <AIAssistant />;
      case 'settings':
        return <AISettings />;
      default:
        return <VercelV0Chat />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface-container">
      {/* Header with Mode Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-muted rounded-lg p-1">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as AIMode)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-colors relative ${
                  activeMode === mode.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={mode.description}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{mode.label}</span>
                
                {activeMode === mode.id && (
                  <motion.div
                    layoutId="ai-mode-indicator"
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

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AISettings() {
  const [aiModel, setAiModel] = useState('gpt-4');
  const [creativity, setCreativity] = useState(0.7);
  const [autoSuggestions, setAutoSuggestions] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize your AI assistant experience
        </p>
      </div>

      {/* AI Model Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">AI Model</label>
        <select
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="gpt-4">GPT-4 (Recommended)</option>
          <option value="gpt-3.5">GPT-3.5 Turbo</option>
          <option value="claude">Claude 3</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Choose the AI model that best fits your needs
        </p>
      </div>

      {/* Creativity Level */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Creativity Level: {Math.round(creativity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={creativity}
          onChange={(e) => setCreativity(parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Auto Suggestions */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Auto Suggestions</label>
          <p className="text-xs text-muted-foreground">
            Show design suggestions automatically
          </p>
        </div>
        <button
          onClick={() => setAutoSuggestions(!autoSuggestions)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoSuggestions ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoSuggestions ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quick Actions</label>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left">
            <Sparkles className="w-4 h-4 text-primary mb-2" />
            <div className="text-xs font-medium">Reset AI</div>
          </button>
          <button className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left">
            <Bot className="w-4 h-4 text-primary mb-2" />
            <div className="text-xs font-medium">Clear History</div>
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Appearance</label>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}