'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DesignerWorkspace from '@/components/workspace/Workspace';
import { StarsLoadingScreen } from '@/components/ui/StarsLoadingScreen';
import DeepOceanBackground from '@/components/ui/DeepOceanBackground';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Ensure loading completes and app shows
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowApp(true);
    }, 1200); // Reduced duration

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setShowApp(true);
  };

  return (
    <>
      {isLoading && (
        <StarsLoadingScreen 
          message=""
          submessage=""
          showLogo={true}
        />
      )}
      
      {showApp && (
        <DeepOceanBackground>
          <div className="h-screen flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 flex min-h-0">
              <Sidebar />
              <div className="flex-1 overflow-y-auto scroll-container">
                <DesignerWorkspace />
              </div>
            </div>
          </div>
          <FloatingActionButton />
        </DeepOceanBackground>
      )}
    </>
  );
}