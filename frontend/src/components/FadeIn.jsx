import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const FadeIn = React.forwardRef(({ 
  children, 
  delay = 0, 
  className = "", 
  direction = 'up' 
}, ref) => {
  const localRef = useRef(null);
  const finalRef = ref || localRef;
  const isInView = useInView(finalRef, { once: true, margin: "-50px" });

  const getDirectionVariants = () => {
    switch (direction) {
      case 'up': return { y: 40, x: 0 };
      case 'down': return { y: -40, x: 0 };
      case 'left': return { x: 40, y: 0 };
      case 'right': return { x: -40, y: 0 };
      case 'none': return { x: 0, y: 0 };
      default: return { y: 40, x: 0 };
    }
  };

  const initial = { opacity: 0, ...getDirectionVariants() };
  const animate = isInView ? { opacity: 1, x: 0, y: 0 } : initial;

  return (
    <motion.div
      ref={finalRef}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.8, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

FadeIn.displayName = 'FadeIn';
