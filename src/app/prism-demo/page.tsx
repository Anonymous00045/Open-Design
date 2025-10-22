'use client';

import { useState } from 'react';
import { 
  PrismLoading,
  AIThinkingPrism,
  AIProcessingPrism,
  AIGeneratingPrism,
  AIAnalyzingPrism,
  PrismFullscreenLoader
} from '@/components/ui/PrismLoadingSystem';
import { PrismLoader } from '@/components/ui/PrismLoader';
import Prism from '@/components/ui/Prism';

export default function PrismDemoPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenType, setFullscreenType] = useState<'thinking' | 'processing' | 'generating' | 'analyzing'>('thinking');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Open Design Prism Loading System
        </h1>

        {/* Raw Prism Component */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Raw Prism Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">3D Rotate</h3>
              <div className="w-32 h-32 mx-auto">
                <Prism
                  height={3.5}
                  baseWidth={5.5}
                  animationType="3drotate"
                  glow={1.2}
                  transparent={true}
                  scale={3.6}
                  hueShift={0.3}
                  colorFrequency={1.0}
                  timeScale={0.8}
                />
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Hover Interactive</h3>
              <div className="w-32 h-32 mx-auto">
                <Prism
                  height={3.5}
                  baseWidth={5.5}
                  animationType="hover"
                  glow={1.5}
                  transparent={true}
                  scale={3.6}
                  hueShift={0.8}
                  colorFrequency={1.5}
                  hoverStrength={2}
                />
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Base Wobble</h3>
              <div className="w-32 h-32 mx-auto">
                <Prism
                  height={3.5}
                  baseWidth={5.5}
                  animationType="rotate"
                  glow={1.0}
                  transparent={true}
                  scale={3.6}
                  hueShift={0.1}
                  colorFrequency={1.8}
                  timeScale={1.2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Loading States */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">AI Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">AI Thinking</h3>
              <AIThinkingPrism size="md" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">AI Processing</h3>
              <AIProcessingPrism size="md" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">AI Generating</h3>
              <AIGeneratingPrism size="md" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">AI Analyzing</h3>
              <AIAnalyzingPrism size="md" />
            </div>
          </div>
        </div>

        {/* Different Sizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Different Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Small</h3>
              <AIThinkingPrism size="sm" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Medium</h3>
              <AIThinkingPrism size="md" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Large</h3>
              <AIThinkingPrism size="lg" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Extra Large</h3>
              <div className="scale-75 origin-center">
                <AIThinkingPrism size="xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Prism Loading */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Custom Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Custom Message</h3>
              <PrismLoading 
                message="Custom AI Task"
                submessage="Performing specialized operation"
                size="md"
                type="processing"
              />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">No Dots</h3>
              <PrismLoading 
                message="Clean Loading"
                submessage="Minimal design approach"
                size="md"
                type="generating"
                showDots={false}
              />
            </div>
          </div>
        </div>

        {/* Simple Prism Loader */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Simple Prism Loader</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">3D Rotate</h3>
              <PrismLoader 
                message="Loading..."
                size="md"
                animationType="3drotate"
              />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Hover</h3>
              <PrismLoader 
                message="Interactive"
                size="md"
                animationType="hover"
              />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-4">Rotate</h3>
              <PrismLoader 
                message="Wobbling"
                size="md"
                animationType="rotate"
              />
            </div>
          </div>
        </div>

        {/* Fullscreen Demo Buttons */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Fullscreen Demos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['thinking', 'processing', 'generating', 'analyzing'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFullscreenType(type);
                  setShowFullscreen(true);
                  setTimeout(() => setShowFullscreen(false), 3000);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-lg font-medium transition-all capitalize"
              >
                {type} Demo
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Click any button to see a 3-second fullscreen demo
          </p>
        </div>

        {/* Usage Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Import the components
import { 
  AIThinkingPrism, 
  AIProcessingPrism,
  PrismFullscreenLoader,
  PrismLoading 
} from '@/components/ui/PrismLoadingSystem';

// Use specific AI loaders
<AIThinkingPrism size="md" />
<AIProcessingPrism size="lg" />

// Use fullscreen loader
<PrismFullscreenLoader 
  message="AI is working..."
  submessage="Processing your design request"
  type="generating"
/>

// Use custom prism loading
<PrismLoading 
  message="Custom Task"
  submessage="Detailed description"
  size="lg"
  type="analyzing"
  showDots={true}
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Fullscreen Demo */}
      {showFullscreen && (
        <PrismFullscreenLoader 
          message={`AI is ${fullscreenType}...`}
          submessage="This is a demo of the fullscreen prism loader"
          type={fullscreenType}
        />
      )}
    </div>
  );
}