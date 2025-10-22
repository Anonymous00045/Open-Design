'use client';

import Prism from './Prism';

interface PrismLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animationType?: "rotate" | "3drotate" | "hover";
}

export function PrismLoader({
  message = 'AI is thinking...',
  size = 'md',
  className = '',
  animationType = '3drotate'
}: PrismLoaderProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} mb-4 relative`}>
        <Prism
          height={3.5}
          baseWidth={5.5}
          animationType={animationType}
          glow={1.2}
          noise={0.3}
          transparent={true}
          scale={3.6}
          hueShift={0.5}
          colorFrequency={1.2}
          bloom={1.5}
          timeScale={0.8}
        />
      </div>
      
      <div className="text-center">
        <p className={`${textSizes[size]} font-medium text-foreground mb-2`}>
          {message}
        </p>
        
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Specific AI loading component
export function AIPrismLoader() {
  return (
    <PrismLoader 
      message="AI is thinking..."
      size="md"
      animationType="3drotate"
    />
  );
}