import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './IntroAnimation.css'

/**
 * IntroAnimation Component
 * 
 * A sophisticated 4-phase intro sequence:
 * Phase 1: Video plays full-screen
 * Phase 2: Video swaps to static logo (imperceptible), holds for 800ms
 * Phase 3: Logo animates from center to navbar position
 * Phase 4: Overlay fades out to reveal content
 */

// Animation phases
const PHASES = {
  VIDEO_PLAYING: 'video_playing',
  LOGO_HOLD: 'logo_hold',
  LOGO_TRANSITIONING: 'logo_transitioning',
  COMPLETE: 'complete'
}

export default function IntroAnimation({ onComplete, onLogoArrived }) {
  const [phase, setPhase] = useState(PHASES.VIDEO_PLAYING)
  const [logoTargetRect, setLogoTargetRect] = useState(null)
  const videoRef = useRef(null)

  // Get the target position of the logo in the navbar
  const calculateTargetPosition = useCallback(() => {
    // Find the brand logo in the header
    const headerLogo = document.querySelector('.brand-logo-img')
    if (headerLogo) {
      const rect = headerLogo.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      }
    }
    // Fallback position (top-left area)
    return {
      x: 120,
      y: 40,
      width: 140,
      height: 50
    }
  }, [])

  // Phase 1 -> Phase 2: Video ends, swap to static logo
  const handleVideoEnd = () => {
    setPhase(PHASES.LOGO_HOLD)
  }

  // Phase 2 -> Phase 3: After hold delay, start transition
  useEffect(() => {
    if (phase === PHASES.LOGO_HOLD) {
      // Calculate target position before starting animation
      const target = calculateTargetPosition()
      setLogoTargetRect(target)

      // Hold for 800ms, then start transition
      const holdTimer = setTimeout(() => {
        setPhase(PHASES.LOGO_TRANSITIONING)
      }, 800)

      return () => clearTimeout(holdTimer)
    }
  }, [phase, calculateTargetPosition])

  // Phase 3 -> Phase 4: Logo animation complete
  const handleLogoAnimationComplete = () => {
    // Notify parent that logo has arrived (to show header logo)
    if (onLogoArrived) {
      onLogoArrived()
    }
    
    // Small delay before completing to ensure smooth handoff
    setTimeout(() => {
      setPhase(PHASES.COMPLETE)
      if (onComplete) {
        onComplete()
      }
    }, 100)
  }

  // Skip functionality
  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    // Skip directly to complete
    if (onLogoArrived) {
      onLogoArrived()
    }
    setPhase(PHASES.COMPLETE)
    if (onComplete) {
      onComplete()
    }
  }

  // Don't render if complete
  if (phase === PHASES.COMPLETE) {
    return null
  }

  // Calculate center position for logo - match the CSS .intro-logo-centered size
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  const startWidth = typeof window !== 'undefined' ? Math.min(900, window.innerWidth * 0.9) : 900

  return (
    <motion.div 
      className="intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === PHASES.LOGO_TRANSITIONING ? 0 : 1 
      }}
      transition={{ 
        duration: 0.8,
        ease: 'easeInOut',
        delay: phase === PHASES.LOGO_TRANSITIONING ? 0.3 : 0
      }}
    >
      {/* Phase 1: Video */}
      <AnimatePresence mode="wait">
        {phase === PHASES.VIDEO_PLAYING && (
          <motion.video
            key="intro-video"
            ref={videoRef}
            className="intro-video"
            src="/intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }} // No fade, instant swap
          />
        )}
      </AnimatePresence>

      {/* Phase 2: Static Logo during hold */}
      <AnimatePresence>
        {phase === PHASES.LOGO_HOLD && (
          <motion.img
            key="logo-hold"
            src="/logo.png"
            alt="MindSettler Logo"
            className="intro-logo-centered"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Phase 3: Animating logo during transition */}
      <AnimatePresence>
        {phase === PHASES.LOGO_TRANSITIONING && logoTargetRect && (
          <motion.img
            key="logo-transitioning"
            src="/logo.png"
            alt="MindSettler Logo"
            className="intro-logo-floating"
            initial={{
              position: 'fixed',
              left: centerX,
              top: centerY,
              x: '-50%',
              y: '-50%',
              width: startWidth,
              opacity: 1
            }}
            animate={{
              left: logoTargetRect.x,
              top: logoTargetRect.y,
              width: logoTargetRect.width,
              opacity: 1
            }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 20,
              mass: 1
            }}
            onAnimationComplete={handleLogoAnimationComplete}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <motion.button 
        className="intro-skip-btn" 
        onClick={handleSkip}
        aria-label="Skip intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Skip
      </motion.button>

      {/* Loading indicator for video */}
      {phase === PHASES.VIDEO_PLAYING && (
        <div className="intro-loading-fallback">
          <motion.div 
            className="intro-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  )
}
