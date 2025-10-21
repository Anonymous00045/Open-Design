'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import Canvas from './Canvas';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import AIAssistant from './AIAssistant';

export default function Workspace() {
  const { activePanel, aiPanelOpen } = useDesignStore();

  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'canvas':
        return <Canvas />;
      case 'code':
        return <CodeEditor />;
      case 'preview':
        return <Preview />;
      case 'ai':
        return <AIAssistant />;
      default:
        return <Canvas />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Primary Panel */}
        <motion.div
          key={activePanel}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {renderActivePanel()}
        </motion.div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-l border-border bg-surface-container elevation-3"
            >
              <AIAssistant />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

