'use client';

import { StarsCanvas } from './StarsCanvas';
import { StarsLoader } from './StarsLoader';
import { StarsLoadingScreen } from './StarsLoadingScreen';

interface UniversalLoaderProps {
  type?: 'fullscreen' | 'inline' | 'overlay';
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  transparent?: boolean;
  className?: string;
  showLogo?: boolean;
}

export function UniversalLoader({
  type = 'inline',
  message = 'Loading...',
  submessage,
  size = 'md',
  transparent = false,
  className = '',
  showLogo = true,
}: UniversalLoaderProps) {
  switch (type) {
    case 'fullscreen':
      return (
        <StarsLoadingScreen
          message={message}
          submessage={submessage}
          transparent={transparent}
          className={className}
          showLogo={showLogo}
        />
      );
    
    case 'overlay':
      return (
        <div className={`absolute inset-0 z-50 flex items-center justify-center ${className}`}>
          <StarsCanvas 
            transparent={transparent}
            maxStars={400}
            brightness={0.6}
            speedMultiplier={0.7}
            className="absolute inset-0"
          />
          <div className="relative z-10 text-center text-white">
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{message}</h3>
            {submessage && (
              <p className="text-gray-300 text-sm mt-2">{submessage}</p>
            )}
          </div>
        </div>
      );
    
    case 'inline':
    default:
      return (
        <StarsLoader
          message={message}
          size={size}
          className={className}
        />
      );
  }
}

// Convenience components for common use cases
export const FullscreenLoader = (props: Omit<UniversalLoaderProps, 'type'>) => (
  <UniversalLoader {...props} type="fullscreen" />
);

export const OverlayLoader = (props: Omit<UniversalLoaderProps, 'type'>) => (
  <UniversalLoader {...props} type="overlay" />
);

export const InlineLoader = (props: Omit<UniversalLoaderProps, 'type'>) => (
  <UniversalLoader {...props} type="inline" />
);

// Specific loaders for common scenarios
export const AIThinkingLoader = () => (
  <StarsLoader message="AI is thinking..." size="md" />
);

export const ProjectLoadingLoader = () => (
  <OverlayLoader message="Loading Project" submessage="Preparing your design workspace..." />
);

export const SaveLoadingLoader = () => (
  <InlineLoader message="Saving..." size="sm" />
);

export const ExportLoadingLoader = () => (
  <OverlayLoader message="Exporting" submessage="Generating your files..." />
);