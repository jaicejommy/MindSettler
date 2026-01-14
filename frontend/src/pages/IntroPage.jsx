import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import '../components/IntroAnimation.css'

/**
 * IntroPage - A standalone intro page with video and logo effect
 * 
 * Flow:
 * 1. Video plays full-screen
 * 2. When video ends, swap to static logo (imperceptible)
 * 3. Hold logo for 800ms
 * 4. Fade out and navigate to home page
 */

const PHASES = {
  VIDEO_PLAYING: 'video_playing',
  LOGO_HOLD: 'logo_hold',
  FADE_OUT: 'fade_out',
  COMPLETE: 'complete'
}

export default function IntroPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(PHASES.VIDEO_PLAYING)
  const videoRef = useRef(null)

  // Phase 1 -> Phase 2: Video ends, swap to static logo
  const handleVideoEnd = () => {
    setPhase(PHASES.LOGO_HOLD)
  }

  // Phase 2 -> Phase 3: After hold delay, start fade out
  useEffect(() => {
    if (phase === PHASES.LOGO_HOLD) {
      const holdTimer = setTimeout(() => {
        setPhase(PHASES.FADE_OUT)
      }, 800)

      return () => clearTimeout(holdTimer)
    }
  }, [phase])

  // Phase 3 -> Navigate: After fade out, go to home
  useEffect(() => {
    if (phase === PHASES.FADE_OUT) {
      const fadeTimer = setTimeout(() => {
        // Navigate to home page
        sessionStorage.setItem('justFromIntro', 'true')
        navigate('/', { replace: true })
      }, 1000) // Match the fade duration

      return () => clearTimeout(fadeTimer)
    }
  }, [phase, navigate])

  // Skip functionality
  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    sessionStorage.setItem('justFromIntro', 'true')
    navigate('/', { replace: true })
  }

  // Calculate center position for logo
  const startWidth = typeof window !== 'undefined' ? Math.min(900, window.innerWidth * 0.9) : 900

  return (
    <motion.div 
      className="intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === PHASES.FADE_OUT ? 0 : 1 
      }}
      transition={{ 
        duration: 1.0,
        ease: [0.4, 0, 0.2, 1]
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

      {/* Phase 2 & 3: Static Logo during hold and fade */}
      <AnimatePresence>
        {(phase === PHASES.LOGO_HOLD || phase === PHASES.FADE_OUT) && (
          <motion.img
            key="logo-hold"
            src="/Mindsettler_logo.jpg"
            alt="MindSettler Logo"
            className="intro-logo-centered"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            style={{ width: startWidth }}
          />
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <motion.button 
        className="intro-skip-btn" 
        onClick={handleSkip}
        aria-label="Skip intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === PHASES.FADE_OUT ? 0 : 1 }}
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
