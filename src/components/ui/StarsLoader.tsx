'use client';

import { StarsCanvas } from './StarsCanvas';

interface StarsLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarsLoader({
  message = 'Processing...',
  size = 'md',
  className = '',
}: StarsLoaderProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <StarsCanvas 
          transparent={true}
          maxStars={200}
          brightness={0.6}
          speedMultiplier={0.8}
          twinkleIntensity={10}
          className="relative"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        
        <p className={`${textSizes[size]} font-medium text-center`}>
          {message}
        </p>
        
        <div className="flex space-x-1 mt-2">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}