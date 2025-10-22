'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import { 
  Palette, 
  Type, 
  Move, 
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Trash2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export default function PropertyPanel() {
  const { selectedElement, updateElement, deleteElement } = useDesignStore();
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'content'>('style');

  if (!selectedElement) {
    return (
      <div className="w-80 bg-surface-container border-l border-border p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Palette className="w-8 h-8" />
          </div>
          <h3 className="font-medium mb-2">No Element Selected</h3>
          <p className="text-sm">Select an element on the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleStyleUpdate = (property: string, value: any) => {
    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    });
  };

  const handlePropertyUpdate = (property: string, value: any) => {
    updateElement(selectedElement.id, { [property]: value });
  };

  const handleDelete = () => {
    deleteElement(selectedElement.id);
  };

  const tabs = [
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Move },
    { id: 'content', label: 'Content', icon: Type }
  ];

  return (
    <div className="w-80 bg-surface-container border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Properties</h3>
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded hover:bg-surface-variant transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'style' && (
          <>
            {/* Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Colors</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Background</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedElement.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={selectedElement.styles.color || '#000000'}
                        onChange={(e) => handleStyleUpdate('color', e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.styles.color || '#000000'}
                        onChange={(e) => handleStyleUpdate('color', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Typography */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Typography</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Font Size</label>
                    <input
                      type="number"
                      value={selectedElement.styles.fontSize || 16}
                      onChange={(e) => handleStyleUpdate('fontSize', parseInt(e.target.value))}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                      min="8"
                      max="72"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Font Family</label>
                    <select
                      value={selectedElement.styles.fontFamily || 'Inter'}
                      onChange={(e) => handleStyleUpdate('fontFamily', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Border & Effects */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Border & Effects</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Border Radius</label>
                  <input
                    type="number"
                    value={selectedElement.styles.borderRadius || 0}
                    onChange={(e) => handleStyleUpdate('borderRadius', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="0"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Box Shadow</label>
                  <input
                    type="text"
                    value={selectedElement.styles.boxShadow || ''}
                    onChange={(e) => handleStyleUpdate('boxShadow', e.target.value)}
                    placeholder="0 2px 4px rgba(0,0,0,0.1)"
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'layout' && (
          <>
            {/* Position */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Position</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">X</label>
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => handlePropertyUpdate('x', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Y</label>
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => handlePropertyUpdate('y', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Width</label>
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => handlePropertyUpdate('width', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Height</label>
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => handlePropertyUpdate('height', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Spacing</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Padding</label>
                  <input
                    type="number"
                    value={selectedElement.styles.padding || 0}
                    onChange={(e) => handleStyleUpdate('padding', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Margin</label>
                  <input
                    type="number"
                    value={selectedElement.styles.margin || 0}
                    onChange={(e) => handleStyleUpdate('margin', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'content' && (
          <>
            {/* Element Content */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Content</h4>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Text</label>
                  <textarea
                    value={selectedElement.content || ''}
                    onChange={(e) => handlePropertyUpdate('content', e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={3}
                    placeholder="Enter text content..."
                  />
                </div>
              </div>
            )}

            {/* Element ID */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Element Info</h4>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Element ID</label>
                <input
                  type="text"
                  value={selectedElement.id}
                  readOnly
                  className="w-full px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
  