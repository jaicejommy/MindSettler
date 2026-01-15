
import { useEffect, useRef } from 'react'

// Reusable particle disintegration divider.
// Props allow tuning particle count, color, duration, and drift without changing the component internals.
export default function ParticleDivider({
  id,
  color = 'rgba(221, 23, 100, 0.65)',
  particleCount = 120,
  duration = 2000,
  drift = 38,
  lineHeight = 1.6,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef()
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const el = containerRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []
    let animating = false
    let startTime = 0
    let lastHoverX = null
    let wavePhase = 0
    let waveAnimationFrame = null

    function animateWave() {
      if (!animating) {
        wavePhase += 0.03
        drawLine(1, wavePhase)
      }
      waveAnimationFrame = requestAnimationFrame(animateWave)
    }

    function setSize() {
      const { width } = el.getBoundingClientRect()
      canvas.width = width
      canvas.height = 170
    }

    function createParticles() {
      const width = canvas.width
      const baseY = canvas.height / 2
      particles = new Array(particleCount).fill(0).map((_, i) => {
        const x = (width / particleCount) * i + (width / particleCount) * 0.5
        return {
          x,
          y: baseY,
          baseY,
          targetY: baseY - (Math.random() * drift + drift * 0.35),
          life: Math.random() * 0.2 + 0.8, // relative life multiplier
          radius: Math.random() * 1.2 + 1.2,
        }
      })
    }

    function drawLine(opacity = 1, phase = 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = opacity
      ctx.fillStyle = color
      ctx.beginPath()
      const amplitude = 8
      const frequency = 0.008
      const y = canvas.height / 2
      ctx.moveTo(0, y)
      for (let x = 0; x <= canvas.width; x += 2) {
        const waveY = y + Math.sin(x * frequency + phase) * amplitude
        ctx.lineTo(x, waveY)
      }
      ctx.lineWidth = lineHeight
      ctx.strokeStyle = color
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    function animateParticles(timestamp) {
      if (!animating) return
      if (!startTime) startTime = timestamp
      const t = Math.min(1, (timestamp - startTime) / duration)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad

      wavePhase += 0.03
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = Math.max(0, 1 - ease * 1.8) // line fades more prominently
      ctx.beginPath()
      const amplitude = 8
      const frequency = 0.008
      const baseY = canvas.height / 2
      ctx.moveTo(0, baseY)
      for (let x = 0; x <= canvas.width; x += 2) {
        const waveY = baseY + Math.sin(x * frequency + wavePhase) * amplitude
        ctx.lineTo(x, waveY)
      }
      ctx.lineWidth = lineHeight
      ctx.strokeStyle = color
      ctx.stroke()

      ctx.globalAlpha = 1
      particles.forEach((p) => {
        const upward = p.baseY - p.targetY
        const y = p.baseY - upward * ease * p.life
        const fade = 1 - ease * p.life
        const hoverOffset = lastHoverX == null ? 0 : (p.x - lastHoverX) * 0.0006 * drift
        ctx.globalAlpha = Math.max(0, fade)
        ctx.beginPath()
        ctx.arc(p.x + hoverOffset, y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      if (t >= 1) {
        animating = false
        startTime = 0
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawLine(1)
        return
      }

      animationRef.current = requestAnimationFrame(animateParticles)
    }

    function trigger() {
      if (prefersReduced.current) {
        drawLine(1)
        return
      }
      createParticles()
      animating = true
      startTime = 0
      animationRef.current = requestAnimationFrame(animateParticles)
    }

    function handleResize() {
      setSize()
      drawLine(1)
    }

    setSize()
    drawLine(1)
    animateWave()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trigger()
          }
        })
      },
      { threshold: 0.85, rootMargin: '0px 0px -100px 0px' }
    )

    observer.observe(el)
    window.addEventListener('resize', handleResize)

    function handleMouseMove(e) {
      if (prefersReduced.current) return
      const rect = canvas.getBoundingClientRect()
      lastHoverX = e.clientX - rect.left
    }

    function handleMouseLeave() {
      lastHoverX = null
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (waveAnimationFrame) cancelAnimationFrame(waveAnimationFrame)
    }
  }, [color, particleCount, duration, drift, lineHeight])

  return (
    <div id={id} className="particle-divider" aria-hidden="true" ref={containerRef}>
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  )
}
