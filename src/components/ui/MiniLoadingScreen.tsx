'use client';

import { motion } from 'framer-motion';
import { StarsCanvas } from './StarsCanvas';

interface MiniLoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showStars?: boolean;
}

export default function MiniLoadingScreen({ 
  message = "", // Default to empty to hide text
  size = 'md',
  showStars = true 
}: MiniLoadingScreenProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48', 
    lg: 'w-64 h-64'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
      {showStars && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${sizeClasses[size]} mb-4 relative overflow-hidden rounded-lg`}
        >
          <StarsCanvas
            transparent={false}
            maxStars={300}
            brightness={1.0}
            speedMultiplier={0.8}
            twinkleIntensity={25}
            hue={217}
          />
        </motion.div>
      )}
      
      {/* Only show loading dots, no text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        {/* Loading dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400/80 rounded-full"
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
    </div>
  );
}