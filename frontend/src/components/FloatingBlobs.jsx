import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Top Left - Soft Pink */}
      <motion.div 
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Top Right - Soft Purple */}
      <motion.div 
        className="absolute top-[10%] -right-[10%] w-[400px] h-[400px] bg-secondary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom Center - Rose */}
      <motion.div 
        className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
