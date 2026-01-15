import { useEffect, useRef } from 'react'

/**
 * Subtle ambient particle background for hero section
 * Designed to feel like breathing and settling, not moving or animated
 */
export default function HeroParticleBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let time = 0

    function setSize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setSize()

    // Create a gentle particle field - very sparse, very subtle
    class Particle {
      constructor() {
        this.baseX = Math.random() * canvas.width
        this.baseY = Math.random() * canvas.height
        this.x = this.baseX
        this.y = this.baseY
        
        // Very small particles
        this.radius = Math.random() * 1.5 + 0.5
        
        // Subtle colors - mostly grays with slight purple tint
        this.opacity = Math.random() * 0.1 + 0.03
        const colorChoice = Math.random()
        if (colorChoice < 0.8) {
          // Mostly very subtle gray
          this.color = `rgba(170, 170, 180, ${this.opacity})`
        } else if (colorChoice < 0.95) {
          // Occasional very subtle purple
          this.color = `rgba(63, 41, 101, ${this.opacity * 0.5})`
        } else {
          // Rare very subtle pink
          this.color = `rgba(221, 23, 100, ${this.opacity * 0.3})`
        }
        
        // Breathing parameters - very slow, very subtle
        this.breathSpeed = 0.0002 + Math.random() * 0.0001
        this.breathRange = 0.3 + Math.random() * 0.8
        this.breathOffset = Math.random() * Math.PI * 2
      }

      update(time) {
        // Gentle breathing motion - barely perceptible
        const breath = Math.sin(time * this.breathSpeed + this.breathOffset)
        this.x = this.baseX + breath * this.breathRange
        this.y = this.baseY + breath * this.breathRange * 0.5
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Very sparse particle count - we want calm, not busy
    const particleCount = Math.floor((canvas.width * canvas.height) / 20000)
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle())

    function animate() {
      time++
      
      // Very subtle fade instead of clear
      ctx.fillStyle = 'rgba(252, 252, 253, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(time)
        particle.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      setSize()
      // Recreate particles on resize
      particlesRef.current = Array.from({ length: Math.floor((canvas.width * canvas.height) / 20000) }, () => new Particle())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (prefersReduced.current) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
