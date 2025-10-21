'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  User,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentProject, toggleSidebar, toggleAiPanel } = useDesignStore();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 elevation-2"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OD</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-lg">
              {currentProject?.name || 'Open Design'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentProject?.description || 'AI-powered design platform'}
            </p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, elements, or ask AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Plus className="w-5 h-5 text-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Save className="w-5 h-5 text-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Download className="w-5 h-5 text-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Share2 className="w-5 h-5 text-foreground" />
        </motion.button>

        <div className="w-px h-6 bg-border mx-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAiPanel}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Bell className="w-5 h-5 text-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
        >
          <User className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>
    </motion.header>
  );
}

