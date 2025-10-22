'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StarsCanvas } from './StarsCanvas';

interface SimpleLoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function SimpleLoadingScreen({ 
  isLoading, 
  onComplete
}: SimpleLoadingScreenProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* StarCanvas Background */}
          <StarsCanvas
            transparent={false}
            maxStars={800}
            brightness={1.0}
            speedMultiplier={0.7}
            twinkleIntensity={20}
            hue={217}
          />

          {/* Simple loading indicator - no logos */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex items-center"
          >
            {/* Loading dots only */}
            <div className="flex items-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400/90 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
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