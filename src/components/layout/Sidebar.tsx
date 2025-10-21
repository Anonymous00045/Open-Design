'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Code, 
  Eye, 
  Bot, 
  FolderOpen, 
  FileText,
  Image,
  Type,
  Square,
  Circle,
  Triangle,
  Palette,
  Layers,
  Grid3X3
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

const sidebarItems = [
  { id: 'canvas', label: 'Canvas', icon: Layout, description: 'Visual design editor' },
  { id: 'code', label: 'Code', icon: Code, description: 'Code editor' },
  { id: 'preview', label: 'Preview', icon: Eye, description: 'Live preview' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, description: 'AI-powered help' },
];

const designElements = [
  { id: 'text', label: 'Text', icon: Type, description: 'Add text element' },
  { id: 'image', label: 'Image', icon: Image, description: 'Add image element' },
  { id: 'button', label: 'Button', icon: Square, description: 'Add button element' },
  { id: 'container', label: 'Container', icon: Square, description: 'Add container' },
  { id: 'circle', label: 'Circle', icon: Circle, description: 'Add circle shape' },
  { id: 'triangle', label: 'Triangle', icon: Triangle, description: 'Add triangle shape' },
];

export default function Sidebar() {
  const { 
    activePanel, 
    setActivePanel, 
    sidebarCollapsed, 
    addElement,
    projects 
  } = useDesignStore();

  const handleAddElement = (type: string) => {
    const elementData = {
      type: type as any,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 100,
      content: type === 'text' ? 'New Text' : undefined,
      styles: {
        backgroundColor: type === 'button' ? '#3b82f6' : 'transparent',
        color: type === 'text' ? '#1f2937' : '#ffffff',
        fontSize: type === 'text' ? 16 : undefined,
        borderRadius: type === 'button' ? 8 : 0,
        padding: 12,
      },
    };
    addElement(elementData);
  };

  return (
    <AnimatePresence>
      {!sidebarCollapsed && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-72 bg-surface-container border-r border-border flex flex-col elevation-2"
        >
          {/* Navigation Tabs */}
          <div className="p-4 border-b border-border">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePanel(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                      activePanel === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-surface-variant text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${
                        activePanel === item.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Design Elements */}
          <div className="flex-1 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Design Elements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {designElements.map((element) => {
                  const Icon = element.icon;
                  return (
                    <motion.button
                      key={element.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddElement(element.id)}
                      className="p-3 bg-surface rounded-lg border border-border hover:bg-surface-variant transition-all group"
                    >
                      <Icon className="w-5 h-5 text-foreground mb-1" />
                      <div className="text-xs font-medium text-foreground">
                        {element.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <FolderOpen className="w-4 h-4 mr-2" />
                Recent Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-surface rounded-lg border border-border hover:bg-surface-variant transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">New Project</span>
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

