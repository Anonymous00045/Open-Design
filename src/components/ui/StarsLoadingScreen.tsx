'use client';

import { StarsCanvas } from './StarsCanvas';

interface StarsLoadingScreenProps {
  message?: string;
  submessage?: string;
  transparent?: boolean;
  className?: string;
  showLogo?: boolean;
}

export function StarsLoadingScreen({
  message = '',
  submessage = '',
  transparent = false,
  className = '',
  showLogo = false, // Default to false to hide logos
}: StarsLoadingScreenProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      <StarsCanvas 
        transparent={transparent}
        maxStars={1200}
        brightness={1.2}
        speedMultiplier={0.8}
        twinkleIntensity={25}
        hue={217} // Deep ocean blue hue
      />
      
      {/* Only show minimal loading indicator, no text or logos */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400/80 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-cyan-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-teal-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}