'use client';

import { useState } from 'react';
import { 
  UniversalLoader, 
  FullscreenLoader, 
  OverlayLoader, 
  InlineLoader,
  AIThinkingLoader,
  ProjectLoadingLoader,
  SaveLoadingLoader,
  ExportLoadingLoader
} from '@/components/ui/UniversalLoader';
import { StarsCanvas } from '@/components/ui/StarsCanvas';

export default function LoadingDemoPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Open Design Loading Components Demo
        </h1>

        {/* Stars Canvas Background */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Stars Canvas Background</h2>
          <div className="relative h-64 bg-black rounded-lg overflow-hidden">
            <StarsCanvas 
              transparent={false}
              maxStars={600}
              brightness={0.8}
              speedMultiplier={0.5}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Animated Stars Background</h3>
                <p className="text-gray-300">Perfect for loading screens</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Loaders */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Inline Loaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Small Loader</h3>
              <InlineLoader message="Loading..." size="sm" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Medium Loader</h3>
              <InlineLoader message="Processing..." size="md" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Large Loader</h3>
              <InlineLoader message="Generating..." size="lg" />
            </div>
          </div>
        </div>

        {/* Specific Use Case Loaders */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Specific Use Case Loaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">AI Thinking</h3>
              <AIThinkingLoader />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Save Loading</h3>
              <SaveLoadingLoader />
            </div>
          </div>
        </div>

        {/* Interactive Demos */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Interactive Demos</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowFullscreen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Show Fullscreen Loader
            </button>
            
            <button
              onClick={() => setShowOverlay(true)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors ml-4"
            >
              Show Overlay Loader
            </button>
          </div>
        </div>

        {/* Universal Loader Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Universal Loader Configurations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Custom Message</h3>
              <UniversalLoader 
                type="inline"
                message="Custom loading message"
                size="md"
              />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">With Submessage</h3>
              <UniversalLoader 
                type="inline"
                message="Processing request"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Import the loaders
import { 
  AIThinkingLoader, 
  FullscreenLoader, 
  UniversalLoader 
} from '@/components/ui/UniversalLoader';

// Use specific loaders
<AIThinkingLoader />

// Use fullscreen loader
<FullscreenLoader 
  message="Loading Application"
  submessage="Setting up your workspace..."
/>

// Use universal loader with custom config
<UniversalLoader 
  type="overlay"
  message="Custom Message"
  size="lg"
  transparent={true}
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Fullscreen Loader Demo */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50">
          <FullscreenLoader 
            message="Demo Fullscreen Loader"
            submessage="This is how the fullscreen loader looks"
          />
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      )}

      {/* Overlay Loader Demo */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="relative h-full">
            <OverlayLoader 
              message="Demo Overlay Loader"
              submessage="This overlay can be placed over any content"
            />
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 z-60 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}