import { useEffect, useState, useRef } from 'react'
import { useInView } from '../hooks/useInView'

const journeySteps = [
  {
    id: 1,
    title: "Sharing what's on your mind",
    description: "You begin wherever feels right—what's been weighing on you, what brought you here, or simply what's present today. There's no script to follow.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    id: 2,
    title: "Slowing down together",
    description: "We take time to sit with what you've shared. Patterns often become clearer when we're not rushing to fix them.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  {
    id: 3,
    title: "Making sense of patterns",
    description: "Together, we explore what keeps showing up—not to judge, but to understand. Sometimes naming something is the first step toward easing it.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  },
  {
    id: 4,
    title: "Finding your ground",
    description: "Each session ends with a moment of grounding—a way to leave feeling a little more settled than when you arrived.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    id: 5,
    title: "Deciding what comes next",
    description: "Continuing is always a choice. Whether you return for another session or take time to process on your own, the door stays open.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    )
  }
]

export default function JourneySection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 })
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const pathRefs = useRef([])
  
  const [pathData, setPathData] = useState([])
  const [lineProgress, setLineProgress] = useState([0, 0, 0, 0])
  const [completedLines, setCompletedLines] = useState([false, false, false, false])
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate path data based on actual card positions
  const calculatePaths = () => {
    if (!containerRef.current || isMobile) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const cards = cardRefs.current.filter(c => c)
    
    if (cards.length < 2) return

    setSvgDimensions({
      width: containerRect.width,
      height: containerRect.height
    })

    const paths = []
    
    for (let i = 0; i < cards.length - 1; i++) {
      const currentCard = cards[i]
      const nextCard = cards[i + 1]
      
      if (!currentCard || !nextCard) continue

      const currentRect = currentCard.getBoundingClientRect()
      const nextRect = nextCard.getBoundingClientRect()
      
      // Calculate positions relative to container
      const isCurrentLeft = i % 2 === 0
      
      // Start point: bottom edge of current card
      const startX = isCurrentLeft 
        ? (currentRect.right - containerRect.left - 30)
        : (currentRect.left - containerRect.left + 30)
      const startY = currentRect.bottom - containerRect.top - 20
      
      // End point: top edge of next card
      const endX = !isCurrentLeft
        ? (nextRect.right - containerRect.left - 30)
        : (nextRect.left - containerRect.left + 30)
      const endY = nextRect.top - containerRect.top + 20
      
      // Create smooth S-curve
      const deltaY = endY - startY
      const controlY1 = startY + deltaY * 0.4
      const controlY2 = startY + deltaY * 0.6
      
      const pathD = `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`
      
      paths.push(pathD)
    }
    
    setPathData(paths)
  }

  // Calculate paths when in view and on resize
  useEffect(() => {
    if (!isInView) return
    
    const t1 = setTimeout(calculatePaths, 100)
    const t2 = setTimeout(calculatePaths, 300)
    const t3 = setTimeout(calculatePaths, 600)
    
    const handleResize = () => setTimeout(calculatePaths, 50)
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      window.removeEventListener('resize', handleResize)
    }
  }, [isInView, isMobile])

  // Scroll-based line animation
  useEffect(() => {
    if (!isInView || !containerRef.current) return

    const handleScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const containerHeight = rect.height

      const sectionStart = windowHeight * 0.75
      const sectionEnd = -containerHeight * 0.4
      const overallProgress = Math.max(0, Math.min(1,
        (sectionStart - rect.top) / (sectionStart - sectionEnd)
      ))

      const numLines = 4
      const newProgress = []
      const newCompleted = []

      for (let i = 0; i < numLines; i++) {
        const lineStart = i / (numLines + 0.5)
        const lineEnd = (i + 1.2) / (numLines + 0.5)
        
        let progress = 0
        if (overallProgress > lineStart) {
          progress = Math.min(1, (overallProgress - lineStart) / (lineEnd - lineStart))
        }
        
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        
        newProgress.push(eased)
        newCompleted.push(eased >= 0.98)
      }

      setLineProgress(newProgress)
      setCompletedLines(newCompleted)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isInView])

  // Apply stroke animation to paths
  useEffect(() => {
    pathRefs.current.forEach((path, index) => {
      if (!path) return
      try {
        const length = path.getTotalLength()
        const offset = length * (1 - lineProgress[index])
        path.style.strokeDasharray = length
        path.style.strokeDashoffset = offset
      } catch (e) {}
    })
  }, [lineProgress, pathData])

  return (
    <section 
      id="your-journey" 
      className={`journey-section ${isInView ? 'in-view' : ''}`}
      ref={sectionRef}
    >
      <div className="journey-wrapper">
        <header className="journey-header">
          <span className="journey-eyebrow">At your own pace</span>
          <h2 className="journey-headline">What the journey might look like</h2>
          <p className="journey-intro">
            There's no fixed path here. Every journey is shaped by what you need, when you need it. 
            These are simply the kinds of moments that often unfold—gently, and only when you're ready.
          </p>
        </header>

        <div className="journey-flow-container" ref={containerRef}>
          {/* SVG Paths - Positioned absolutely over the cards */}
          {!isMobile && pathData.length > 0 && svgDimensions.width > 0 && (
            <svg 
              className="journey-svg"
              width={svgDimensions.width}
              height={svgDimensions.height}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'visible'
              }}
            >
              <defs>
                <linearGradient id="journeyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DD1764" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#3F2965" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="journeyGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3F2965" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#DD1764" stopOpacity="0.85" />
                </linearGradient>
                <filter id="journeyGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {pathData.map((d, index) => (
                <g key={index} className={`journey-path-group ${hoveredCard === index || hoveredCard === index + 1 ? 'hovered' : ''}`}>
                  <path
                    ref={(el) => pathRefs.current[index] = el}
                    className="journey-path"
                    d={d}
                    stroke={index % 2 === 0 ? "url(#journeyGradient1)" : "url(#journeyGradient2)"}
                    strokeWidth={hoveredCard === index || hoveredCard === index + 1 ? "4" : "3"}
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#journeyGlow)"
                    style={{
                      opacity: hoveredCard === index || hoveredCard === index + 1 ? 1 : 0.9,
                      transition: 'stroke-width 0.4s ease, opacity 0.4s ease'
                    }}
                  />
                  
                  {completedLines[index] && (
                    <circle
                      className="journey-pulse-dot"
                      r="5"
                      fill="#DD1764"
                      filter="url(#journeyGlow)"
                    >
                      <animateMotion
                        dur="1.2s"
                        repeatCount="1"
                        fill="freeze"
                        path={d}
                      />
                      <animate
                        attributeName="opacity"
                        values="1;1;0"
                        dur="1.2s"
                        fill="freeze"
                      />
                    </circle>
                  )}
                </g>
              ))}
            </svg>
          )}

          {/* Journey Cards */}
          <div className="journey-cards">
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => cardRefs.current[index] = el}
                className={`journey-card ${index % 2 === 0 ? 'card-left' : 'card-right'} ${hoveredCard === index ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ transitionDelay: `${index * 0.12}s` }}
              >
                <div className="journey-card-content">
                  <div className="journey-card-number">{String(step.id).padStart(2, '0')}</div>
                  <div className="journey-card-icon">
                    {step.icon}
                  </div>
                  <h3 className="journey-card-title">{step.title}</h3>
                  <p className="journey-card-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="journey-closing">
          You won't be rushed. You won't be pushed. This space moves at your pace.
        </p>
      </div>
    </section>
  )
}
