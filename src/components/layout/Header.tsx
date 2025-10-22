'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload,
  Palette,
  Image,
  Bot,
  FileText,
  Package,
  Menu,
  X,
  Home,
  CreditCard,
  Mail,
  User,
  LogOut,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { useDesignStore } from '@/store/useDesignStore';
import ExportModal from '../export/ExportModal';
import ImportModal from '../import/ImportModal';

export default function Header() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { currentProject } = useDesignStore();

  const headerButtons = [
    {
      id: 'media-upload',
      icon: Upload,
      label: 'Media Upload',
      description: 'Upload images/videos',
      action: () => setShowImportModal(true)
    },
    {
      id: 'design-elements',
      icon: Palette,
      label: 'Design Elements',
      description: 'Canvas tools and shapes',
      action: () => setActivePanel('design-elements')
    },
    {
      id: 'project-assets',
      icon: Image,
      label: 'Project Assets',
      description: 'Uploaded or linked files',
      action: () => setActivePanel('project-assets')
    },
    {
      id: 'ai-pipeline',
      icon: Bot,
      label: 'AI Pipeline',
      description: 'AI design/animation processing',
      action: () => setActivePanel('ai-pipeline')
    },
    {
      id: 'templates',
      icon: FileText,
      label: 'Templates',
      description: 'Design or layout templates',
      action: () => setActivePanel('templates')
    },
    {
      id: 'export-deploy',
      icon: Package,
      label: 'Export/Deploy',
      description: 'Export/deployment options',
      action: () => setShowExportModal(true)
    }
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6"
    >
      {/* Left Section - Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OD</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-lg">Designer Studio</span>
            <span className="text-xs text-white/60">
              {currentProject?.title || 'No project selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Section - Header Buttons */}
      <div className="flex items-center space-x-2">
        {headerButtons.map((button) => {
          const Icon = button.icon;
          return (
            <motion.button
              key={button.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-all group"
              title={button.description}
            >
              <Icon className="w-4 h-4 text-white/90" />
              <span className="text-sm text-white/90 hidden lg:block">{button.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Right Section - User Menu */}
      <div className="flex items-center space-x-4">
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link 
            href="/dashboard"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/billing"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Billing
          </Link>
          <Link 
            href="/contact"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
            <span className="text-sm text-white hidden md:block">John Doe</span>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Layout className="w-4 h-4" />
                <span>Designer Studio</span>
              </Link>
              <Link 
                href="/billing"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>My Subscription</span>
              </Link>
              <Link 
                href="/contact"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Sales</span>
              </Link>
              <div className="border-t border-white/10 my-2"></div>
              <Link 
                href="/signup"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Account Settings</span>
              </Link>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
      />
    </motion.header>
  );
}

