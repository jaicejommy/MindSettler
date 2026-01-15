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
  FADE_OUT: 'fade_out',
  COMPLETE: 'complete'
}

export default function IntroPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(PHASES.VIDEO_PLAYING)
  const videoRef = useRef(null)

  // Video ends -> Start fade out
  const handleVideoEnd = () => {
    setPhase(PHASES.FADE_OUT)
  }

  // After fade out, go to home
  useEffect(() => {
    if (phase === PHASES.FADE_OUT) {
      const fadeTimer = setTimeout(() => {
        sessionStorage.setItem('justFromIntro', 'true')
        navigate('/', { replace: true })
      }, 800)

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

  return (
    <motion.div 
      className="intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === PHASES.FADE_OUT ? 0 : 1 
      }}
      transition={{ 
        duration: 0.8,
        ease: 'easeInOut'
      }}
    >
      {/* Video */}
      <AnimatePresence mode="wait">
        {phase === PHASES.VIDEO_PLAYING && (
          <motion.video
            key="intro-video"
            ref={videoRef}
            className="intro-video"
            src="/Video%20Project%201.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
