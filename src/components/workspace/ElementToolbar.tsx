'use client';

import { motion } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  MousePointer,
  Hand,
  Zap,
  Shapes,
  Layout,
  Grid3X3,
  Triangle,
  Star,
  Heart,
  Hexagon
} from 'lucide-react';

export default function ElementToolbar() {
  const { addElement, canvasSize } = useDesignStore();

  const tools = [
    {
      id: 'select',
      name: 'Select',
      icon: MousePointer,
      category: 'basic'
    },
    {
      id: 'pan',
      name: 'Pan',
      icon: Hand,
      category: 'basic'
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      category: 'elements'
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      icon: Square,
      category: 'shapes'
    },
    {
      id: 'circle',
      name: 'Circle',
      icon: Circle,
      category: 'shapes'
    },
    {
      id: 'triangle',
      name: 'Triangle',
      icon: Triangle,
      category: 'shapes'
    },
    {
      id: 'star',
      name: 'Star',
      icon: Star,
      category: 'shapes'
    },
    {
      id: 'heart',
      name: 'Heart',
      icon: Heart,
      category: 'shapes'
    },
    {
      id: 'hexagon',
      name: 'Hexagon',
      icon: Hexagon,
      category: 'shapes'
    },
    {
      id: 'image',
      name: 'Image',
      icon: Image,
      category: 'elements'
    },
    {
      id: 'button',
      name: 'Button',
      icon: Zap,
      category: 'elements'
    },
    {
      id: 'container',
      name: 'Container',
      icon: Layout,
      category: 'layout'
    },
    {
      id: 'grid',
      name: 'Grid',
      icon: Grid3X3,
      category: 'layout'
    }
  ];

  const categories = [
    { id: 'basic', name: 'Basic Tools' },
    { id: 'elements', name: 'Elements' },
    { id: 'shapes', name: 'Shapes' },
    { id: 'layout', name: 'Layout' }
  ];

  const createElement = (type: string) => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    
    const elementDefaults: Record<string, any> = {
      text: {
        type: 'text',
        x: centerX - 50,
        y: centerY - 10,
        width: 100,
        height: 20,
        content: 'Text Element',
        styles: {
          fontSize: 16,
          fontFamily: 'Inter',
          color: '#1f2937'
        }
      },
      rectangle: {
        type: 'div',
        x: centerX - 50,
        y: centerY - 25,
        width: 100,
        height: 50,
        styles: {
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }
      },
      circle: {
        type: 'circle',
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        styles: {
          backgroundColor: '#10b981'
        }
      },
      triangle: {
        type: 'triangle',
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        styles: {
          backgroundColor: '#f59e0b'
        }
      },
      star: {
        type: 'star',
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        styles: {
          backgroundColor: '#eab308'
        }
      },
      heart: {
        type: 'heart',
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        styles: {
          backgroundColor: '#ef4444'
        }
      },
      hexagon: {
        type: 'hexagon',
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        styles: {
          backgroundColor: '#8b5cf6'
        }
      },
      image: {
        type: 'image',
        x: centerX - 75,
        y: centerY - 50,
        width: 150,
        height: 100,
        content: 'https://via.placeholder.com/150x100',
        styles: {
          borderRadius: 8
        }
      },
      button: {
        type: 'button',
        x: centerX - 50,
        y: centerY - 15,
        width: 100,
        height: 30,
        content: 'Click Me',
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: 6,
          fontSize: 14,
          fontFamily: 'Inter',
          padding: 8
        }
      },
      container: {
        type: 'container',
        x: centerX - 100,
        y: centerY - 75,
        width: 200,
        height: 150,
        styles: {
          backgroundColor: 'transparent',
          border: '2px dashed #d1d5db',
          borderRadius: 8
        }
      },
      grid: {
        type: 'grid',
        x: centerX - 100,
        y: centerY - 75,
        width: 200,
        height: 150,
        styles: {
          backgroundColor: 'transparent',
          border: '1px solid #e5e7eb'
        }
      }
    };

    const elementData = elementDefaults[type];
    if (elementData) {
      addElement(elementData);
    }
  };

  return (
    <div className="w-16 bg-surface-container border-r border-border flex flex-col">
      {/* Toolbar Header */}
      <div className="p-2 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Shapes className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* Tool Categories */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-border last:border-b-0">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
                {category.name}
              </div>
              <div className="space-y-1">
                {tools
                  .filter(tool => tool.category === category.id)
                  .map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (tool.id !== 'select' && tool.id !== 'pan') {
                            createElement(tool.id);
                          }
                        }}
                        className="w-full p-2 rounded-lg hover:bg-surface-variant transition-colors group relative"
                        title={tool.name}
                      >
                        <Icon className="w-4 h-4 text-foreground mx-auto" />
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-border">
                          {tool.name}
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="AI Generate"
        >
          <Zap className="w-4 h-4 mx-auto" />
        </motion.button>
      </div>
    </div>
  );
}