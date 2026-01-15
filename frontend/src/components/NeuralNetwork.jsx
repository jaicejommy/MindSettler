import { useEffect, useRef } from 'react'

/**
 * Clean neural network with SVG brain
 */
export default function NeuralNetwork() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let pulses = []
    let time = 0

    function setSize() {
      canvas.width = 380
      canvas.height = 380
    }

    setSize()

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 6 connection lines radiating out
    const connections = [
      { angle: -Math.PI / 2, length: 130 },
      { angle: -Math.PI / 6, length: 125 },
      { angle: Math.PI / 6, length: 125 },
      { angle: Math.PI / 2, length: 130 },
      { angle: Math.PI - Math.PI / 6, length: 125 },
      { angle: -Math.PI + Math.PI / 6, length: 125 },
    ].map(({ angle, length }) => ({
      startX: centerX + Math.cos(angle) * 62,
      startY: centerY + Math.sin(angle) * 62,
      endX: centerX + Math.cos(angle) * length,
      endY: centerY + Math.sin(angle) * length,
      angle
    }))

    class Pulse {
      constructor(conn) {
        this.conn = conn
        this.progress = Math.random()
        this.speed = 0.004 + Math.random() * 0.002
      }

      update() {
        this.progress += this.speed
        if (this.progress >= 1) this.progress = 0
      }

      draw(ctx) {
        const x = this.conn.startX + (this.conn.endX - this.conn.startX) * this.progress
        const y = this.conn.startY + (this.conn.endY - this.conn.startY) * this.progress
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(221, 23, 100, 0.9)'
        ctx.fill()
      }
    }

    pulses = connections.map(conn => new Pulse(conn))

    function animate() {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      connections.forEach(conn => {
        ctx.beginPath()
        ctx.moveTo(conn.startX, conn.startY)
        ctx.lineTo(conn.endX, conn.endY)
        ctx.strokeStyle = 'rgba(221, 23, 100, 0.35)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        const pulseSize = 4 + Math.sin(time * 0.04 + conn.angle) * 1
        ctx.beginPath()
        ctx.arc(conn.endX, conn.endY, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(221, 23, 100, 0.8)'
        ctx.fill()
      })

      pulses.forEach(p => {
        p.update()
        p.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // SVG Brain matching the reference structure
  const BrainSVG = () => (
    <svg 
      width="140" 
      height="140" 
      viewBox="0 0 140 140" 
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2
      }}
    >
      {/* Soft pink glow background */}
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(252, 230, 245, 0.55)" />
          <stop offset="100%" stopColor="rgba(252, 230, 245, 0)" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="62" fill="url(#brainGlow)" />

      {/* Left hemisphere (clean rounded lobe) */}
      <path
        d="M70 28 C52 22 34 36 34 62 C34 90 46 112 66 112 C68 112 70 108 70 100 C70 82 70 60 70 28 Z"
        fill="#fff8fc"
        stroke="#9080b0"
        strokeWidth="2"
      />

      {/* Right hemisphere (clean rounded lobe) */}
      <path
        d="M70 28 C88 22 106 36 106 62 C106 90 94 112 74 112 C72 112 70 108 70 100 C70 82 70 60 70 28 Z"
        fill="#fff8fc"
        stroke="#9080b0"
        strokeWidth="2"
      />

      {/* Left hemisphere folds */}
      <path d="M 38 42 Q 52 36 66 42" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 36 58 Q 52 52 66 58" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 36 74 Q 52 68 66 74" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 38 90 Q 52 84 66 90" fill="none" stroke="#a090c0" strokeWidth="1.5" />

      {/* Right hemisphere folds */}
      <path d="M 74 42 Q 88 36 102 42" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 74 58 Q 88 52 102 58" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 74 74 Q 88 68 102 74" fill="none" stroke="#a090c0" strokeWidth="1.5" />
      <path d="M 74 90 Q 88 84 102 90" fill="none" stroke="#a090c0" strokeWidth="1.5" />

      {/* Center dotted line */}
      <line
        x1="70" y1="30" x2="70" y2="110"
        stroke="#9080b0"
        strokeWidth="1.5"
        strokeDasharray="4,4"
      />
    </svg>
  )

  return (
    <div className="neural-network-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} className="neural-network-canvas" style={{ position: 'relative', zIndex: 1 }} />
      <BrainSVG />
      <p className="neural-network-label">MindSettler Neural Network</p>
    </div>
  )
}
