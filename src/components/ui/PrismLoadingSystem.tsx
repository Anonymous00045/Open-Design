'use client';

import Prism from './Prism';

interface PrismLoadingProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'thinking' | 'processing' | 'generating' | 'analyzing';
  className?: string;
  showDots?: boolean;
}

export function PrismLoading({
  message = 'Processing...',
  submessage,
  size = 'md',
  type = 'thinking',
  className = '',
  showDots = true
}: PrismLoadingProps) {
  const sizeConfig = {
    sm: { container: 'w-20 h-20', text: 'text-sm', prism: { height: 2.5, baseWidth: 4, scale: 2.8 } },
    md: { container: 'w-32 h-32', text: 'text-base', prism: { height: 3.5, baseWidth: 5.5, scale: 3.6 } },
    lg: { container: 'w-48 h-48', text: 'text-lg', prism: { height: 4.5, baseWidth: 7, scale: 4.5 } },
    xl: { container: 'w-64 h-64', text: 'text-xl', prism: { height: 5.5, baseWidth: 8.5, scale: 5.5 } }
  };

  const typeConfig = {
    thinking: {
      hueShift: 0.3,
      colorFrequency: 1.0,
      glow: 1.2,
      timeScale: 0.6,
      colors: ['bg-blue-400', 'bg-cyan-400', 'bg-indigo-400']
    },
    processing: {
      hueShift: 0.8,
      colorFrequency: 1.5,
      glow: 1.5,
      timeScale: 1.0,
      colors: ['bg-purple-400', 'bg-violet-400', 'bg-fuchsia-400']
    },
    generating: {
      hueShift: 0.1,
      colorFrequency: 1.8,
      glow: 1.8,
      timeScale: 1.2,
      colors: ['bg-green-400', 'bg-emerald-400', 'bg-teal-400']
    },
    analyzing: {
      hueShift: 0.6,
      colorFrequency: 0.8,
      glow: 1.0,
      timeScale: 0.8,
      colors: ['bg-orange-400', 'bg-amber-400', 'bg-yellow-400']
    }
  };

  const config = sizeConfig[size];
  const typeSettings = typeConfig[type];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${config.container} mb-4 relative`}>
        <Prism
          height={config.prism.height}
          baseWidth={config.prism.baseWidth}
          animationType="3drotate"
          glow={typeSettings.glow}
          noise={0.2}
          transparent={true}
          scale={config.prism.scale}
          hueShift={typeSettings.hueShift}
          colorFrequency={typeSettings.colorFrequency}
          bloom={1.5}
          timeScale={typeSettings.timeScale}
          suspendWhenOffscreen={true}
        />
      </div>
      
      <div className="text-center max-w-xs">
        <p className={`${config.text} font-medium text-foreground mb-1`}>
          {message}
        </p>
        
        {submessage && (
          <p className="text-sm text-muted-foreground mb-3">
            {submessage}
          </p>
        )}
        
        {showDots && (
          <div className="flex space-x-1 justify-center">
            {typeSettings.colors.map((color, index) => (
              <div 
                key={index}
                className={`w-2 h-2 ${color} rounded-full animate-pulse`}
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Specific AI loading components
export function AIThinkingPrism({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <PrismLoading 
      message="AI is thinking..."
      submessage="Analyzing your request"
      size={size}
      type="thinking"
    />
  );
}

export function AIProcessingPrism({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <PrismLoading 
      message="Processing..."
      submessage="Working on your design"
      size={size}
      type="processing"
    />
  );
}

export function AIGeneratingPrism({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <PrismLoading 
      message="Generating code..."
      submessage="Creating your components"
      size={size}
      type="generating"
    />
  );
}

export function AIAnalyzingPrism({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <PrismLoading 
      message="Analyzing design..."
      submessage="Understanding your layout"
      size={size}
      type="analyzing"
    />
  );
}

// Fullscreen prism loader
export function PrismFullscreenLoader({
  message = 'AI is working...',
  submessage = 'Please wait while we process your request',
  type = 'thinking'
}: {
  message?: string;
  submessage?: string;
  type?: 'thinking' | 'processing' | 'generating' | 'analyzing';
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Open Design
          </h1>
        </div>
        
        <PrismLoading 
          message={message}
          submessage={submessage}
          size="xl"
          type={type}
        />
      </div>
    </div>
  );
}