'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ExternalLink,
  RefreshCw,
  Maximize2,
  Download
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

const deviceSizes = {
  desktop: { width: 1200, height: 800, label: 'Desktop' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  mobile: { width: 375, height: 667, label: 'Mobile' },
};

export default function Preview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentDevice, setCurrentDevice] = useState<DeviceSize>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { htmlCode, cssCode, jsCode } = useDesignStore();

  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Open Design Preview</title>
        <style>
          ${cssCode}
          
          /* Preview-specific styles */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, sans-serif;
            overflow-x: hidden;
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .container {
              padding: 1rem;
            }
          }
          
          @media (max-width: 375px) {
            .container {
              padding: 0.5rem;
            }
          }
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        </script>
      </body>
      </html>
    `;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(generatePreviewHTML());
      newWindow.document.close();
    }
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([generatePreviewHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [htmlCode, cssCode, jsCode]);

  const currentSize = deviceSizes[currentDevice];

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Preview Toolbar */}
      <div className="h-12 bg-surface-container border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {/* Device Selector */}
          <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
            {Object.entries(deviceSizes).map(([device, size]) => {
              const Icon = device === 'desktop' ? Monitor : 
                          device === 'tablet' ? Tablet : Smartphone;
              return (
                <motion.button
                  key={device}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDevice(device as DeviceSize)}
                  className={`p-2 rounded-md transition-all ${
                    currentDevice === device
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-surface-variant'
                  }`}
                  title={`${size.label} (${size.width}×${size.height})`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </div>

          <div className="text-sm text-muted-foreground px-2">
            {currentSize.width} × {currentSize.height}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className={`w-4 h-4 text-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenInNewTab}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadHTML}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Download HTML"
          >
            <Download className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-muted/20 p-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg elevation-3 overflow-hidden shadow-2xl"
          style={{
            width: Math.min(currentSize.width, window.innerWidth - 100),
            height: Math.min(currentSize.height, window.innerHeight - 200),
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-foreground">Loading preview...</span>
              </div>
            </div>
          )}

          {/* Preview Frame */}
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={generatePreviewHTML()}
            onLoad={handleIframeLoad}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        </motion.div>
      </div>

      {/* Preview Info */}
      <div className="h-8 bg-surface-container border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Device: {currentSize.label}</span>
          <span>Size: {currentSize.width}×{currentSize.height}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span>{isLoading ? 'Loading...' : 'Ready'}</span>
        </div>
      </div>
    </div>
  );
}

