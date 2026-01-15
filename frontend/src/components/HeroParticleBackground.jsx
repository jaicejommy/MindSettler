import { useEffect, useRef } from 'react'

/**
 * Geometric heart structure that morphs into particles forming around text
 * Designed for hero section to represent MindSettler's logo transformation
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
    let animationProgress = 0
    const animationDuration = 3500
    let startTime = null

    function setSize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setSize()

    // Create geometric polygonal heart shape (angular, like logo)
    function createPolygonalHeartVertices(centerX, centerY, size) {
      const vertices = []
      
      // Define key points for angular heart shape
      // Top left curve (angular)
      vertices.push({ x: centerX, y: centerY - size * 0.3 })
      vertices.push({ x: centerX - size * 0.3, y: centerY - size * 0.6 })
      vertices.push({ x: centerX - size * 0.6, y: centerY - size * 0.6 })
      vertices.push({ x: centerX - size * 0.75, y: centerY - size * 0.4 })
      vertices.push({ x: centerX - size * 0.75, y: centerY - size * 0.1 })
      vertices.push({ x: centerX - size * 0.6, y: centerY + size * 0.1 })
      vertices.push({ x: centerX - size * 0.4, y: centerY + size * 0.3 })
      
      // Bottom point
      vertices.push({ x: centerX - size * 0.2, y: centerY + size * 0.6 })
      vertices.push({ x: centerX, y: centerY + size * 0.85 })
      vertices.push({ x: centerX + size * 0.2, y: centerY + size * 0.6 })
      
      // Right side (mirror of left)
      vertices.push({ x: centerX + size * 0.4, y: centerY + size * 0.3 })
      vertices.push({ x: centerX + size * 0.6, y: centerY + size * 0.1 })
      vertices.push({ x: centerX + size * 0.75, y: centerY - size * 0.1 })
      vertices.push({ x: centerX + size * 0.75, y: centerY - size * 0.4 })
      vertices.push({ x: centerX + size * 0.6, y: centerY - size * 0.6 })
      vertices.push({ x: centerX + size * 0.3, y: centerY - size * 0.6 })
      
      return vertices
    }

    // Create brain-like structure in center
    function createBrainStructure(centerX, centerY, size) {
      const brainLines = []
      const brainSize = size * 0.35
      
      // Create organic brain-like curves using bezier-style points
      const brainPoints = [
        // Left hemisphere
        { x: centerX - brainSize * 0.4, y: centerY - brainSize * 0.3 },
        { x: centerX - brainSize * 0.5, y: centerY },
        { x: centerX - brainSize * 0.4, y: centerY + brainSize * 0.3 },
        { x: centerX - brainSize * 0.2, y: centerY + brainSize * 0.4 },
        
        // Right hemisphere
        { x: centerX + brainSize * 0.2, y: centerY + brainSize * 0.4 },
        { x: centerX + brainSize * 0.4, y: centerY + brainSize * 0.3 },
        { x: centerX + brainSize * 0.5, y: centerY },
        { x: centerX + brainSize * 0.4, y: centerY - brainSize * 0.3 },
        
        // Top connections
        { x: centerX, y: centerY - brainSize * 0.4 },
      ]
      
      // Create connections between brain points
      for (let i = 0; i < brainPoints.length - 1; i++) {
        brainLines.push({ start: brainPoints[i], end: brainPoints[i + 1] })
      }
      
      // Add some internal brain structure lines
      brainLines.push({ start: brainPoints[0], end: brainPoints[4] })
      brainLines.push({ start: brainPoints[1], end: brainPoints[5] })
      brainLines.push({ start: brainPoints[2], end: brainPoints[6] })
      
      return { points: brainPoints, lines: brainLines }
    }

    // Create geometric triangulation effect (like logo's polygonal structure)
    function createGeometricLines(vertices) {
      const lines = []
      const vertexCount = vertices.length
      
      // Create edges of heart (connecting consecutive vertices for angular look)
      for (let i = 0; i < vertexCount; i++) {
        const nextIndex = (i + 1) % vertexCount
        lines.push({ start: vertices[i], end: vertices[nextIndex], isOutline: true })
      }
      
      // Create internal geometric structure (triangulation) - fewer lines for cleaner look
      for (let i = 0; i < vertexCount; i += 2) {
        const targetIndex = (i + 5) % vertexCount
        lines.push({ start: vertices[i], end: vertices[targetIndex], isOutline: false })
      }
      
      // Add some cross-connections for geometric effect
      lines.push({ start: vertices[0], end: vertices[8], isOutline: false }) // top to bottom
      lines.push({ start: vertices[3], end: vertices[13], isOutline: false }) // left to right
      lines.push({ start: vertices[6], end: vertices[10], isOutline: false })
      
      return lines
    }

    class Particle {
      constructor(index, heartVertex, total) {
        this.index = index
        // Start position - on the heart shape
        this.startX = heartVertex.x
        this.startY = heartVertex.y
        
        // Target position - dispersed around where text will appear
        const angle = (index / total) * Math.PI * 2
        const radius = 200 + Math.random() * 300
        this.targetX = canvas.width / 2 + Math.cos(angle) * radius
        this.targetY = canvas.height / 2 + Math.sin(angle) * radius - 50
        
        // Current position
        this.x = this.startX
        this.y = this.startY
        
        // Visual properties
        this.radius = Math.random() * 2.5 + 1.5
        this.opacity = 0.8
        
        // Color - alternating pink and purple
        this.isPink = Math.random() > 0.5
        this.color = this.isPink ? 'rgba(221, 23, 100, 0.8)' : 'rgba(63, 41, 101, 0.8)'
      }

      update(progress) {
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        
        // Phase 1 (0-0.5): Heart stays visible, subtle pulse
        // Phase 2 (0.5-1.0): Heart disperses, particles spread out
        
        if (progress < 0.5) {
          // Subtle pulsing effect on heart
          const pulse = Math.sin(progress * Math.PI * 4) * 2
          this.x = this.startX + pulse
          this.y = this.startY + pulse
          this.opacity = 0.8
        } else {
          // Disperse particles
          const disperseProgress = (progress - 0.5) / 0.5
          const easedDisperse = easeOutCubic(disperseProgress)
          
          this.x = this.startX + (this.targetX - this.startX) * easedDisperse
          this.y = this.startY + (this.targetY - this.startY) * easedDisperse
          this.opacity = 0.8 * (1 - easedDisperse * 0.7)
        }
        
        // Update color with current opacity
        this.color = this.isPink 
          ? `rgba(221, 23, 100, ${this.opacity})` 
          : `rgba(63, 41, 101, ${this.opacity})`
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Initialize heart structure
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 - 50
    const heartSize = Math.min(canvas.width, canvas.height) * 0.15 // Slightly larger for polygonal style
    const heartVertices = createPolygonalHeartVertices(centerX, centerY, heartSize)
    const geometricLines = createGeometricLines(heartVertices)
    const brainStructure = createBrainStructure(centerX, centerY, heartSize)

    // Create particles from heart vertices
    particlesRef.current = heartVertices.map((vertex, i) => 
      new Particle(i, vertex, heartVertices.length)
    )
    
    // Add brain particles
    const brainParticles = brainStructure.points.map((point, i) => {
      const particle = new Particle(heartVertices.length + i, point, brainStructure.points.length)
      particle.isPink = false // Brain is purple
      particle.color = 'rgba(63, 41, 101, 0.9)'
      particle.radius = 2.5
      return particle
    })
    
    particlesRef.current = [...particlesRef.current, ...brainParticles]

    function animate(timestamp) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      animationProgress = Math.min(1, elapsed / animationDuration)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Phase 1: Draw geometric heart structure
      if (animationProgress < 0.5) {
        const heartOpacity = 0.8
        
        // Draw geometric heart lines
        geometricLines.forEach(line => {
          // Outline is pink, internal lines are lighter
          if (line.isOutline) {
            ctx.strokeStyle = `rgba(221, 23, 100, ${heartOpacity})`
            ctx.lineWidth = 2.5
          } else {
            ctx.strokeStyle = `rgba(221, 23, 100, ${heartOpacity * 0.4})`
            ctx.lineWidth = 1.5
          }
          ctx.beginPath()
          ctx.moveTo(line.start.x, line.start.y)
          ctx.lineTo(line.end.x, line.end.y)
          ctx.stroke()
        })
        
        // Draw brain structure in purple
        brainStructure.lines.forEach(line => {
          ctx.strokeStyle = `rgba(63, 41, 101, ${heartOpacity * 0.85})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(line.start.x, line.start.y)
          ctx.lineTo(line.end.x, line.end.y)
          ctx.stroke()
        })
      } else {
        // Phase 2: Draw dispersing connections that fade out
        const fadeProgress = (animationProgress - 0.5) / 0.5
        const connectionOpacity = 0.3 * (1 - fadeProgress)
        
        ctx.strokeStyle = `rgba(221, 23, 100, ${connectionOpacity})`
        ctx.lineWidth = 1
        
        // Draw some connections between dispersing particles
        for (let i = 0; i < particlesRef.current.length; i += 5) {
          for (let j = i + 1; j < Math.min(i + 8, particlesRef.current.length); j++) {
            const p1 = particlesRef.current[i]
            const p2 = particlesRef.current[j]
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(animationProgress)
        particle.draw(ctx)
      })

      // Continue animation until complete
      if (animationProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    // Handle window resize
    const handleResize = () => {
      setSize()
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
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,245,255,0.9) 100%)'
      }}
    />
  )
}
