'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarsCanvas } from './StarsCanvas';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
  minDuration?: number;
}

export default function LoadingScreen({ 
  isLoading, 
  onComplete, 
  minDuration = 1500
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Start exit animation immediately when loading is false
      setIsVisible(false);
      return;
    }

    // Set minimum duration timer
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [isLoading, minDuration]);

  // Call onComplete when visibility changes to false
  useEffect(() => {
    if (!isVisible && onComplete) {
      const completeTimer = setTimeout(onComplete, 300); // Wait for exit animation
      return () => clearTimeout(completeTimer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* StarCanvas Background */}
          <StarsCanvas
            transparent={false}
            maxStars={1500}
            brightness={1.2}
            speedMultiplier={0.6}
            twinkleIntensity={30}
            hue={217} // Deep ocean blue
          />

          {/* Simple loading indicator - no text or logos */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex items-center"
          >
            {/* Minimal loading dots only */}
            <div className="flex items-center space-x-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400/90 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}