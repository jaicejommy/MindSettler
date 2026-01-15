import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import DesiGallery from '../components/DesiGallery'
import ParticleDivider from '../components/ParticleDivider'
import HeroParticleBackground from '../components/HeroParticleBackground'

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function HomePage() {
  const navigate = useNavigate()
  const [isFromIntro, setIsFromIntro] = useState(() => {
    // Check immediately on mount if we came from intro
    return sessionStorage.getItem('justFromIntro') === 'true'
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)
  
  // Handle redirect and animation state
  useEffect(() => {
    const fromIntro = sessionStorage.getItem('justFromIntro')
    if (fromIntro === 'true') {
      // Coming from intro - show page with animation
      setIsFromIntro(true)
      sessionStorage.removeItem('justFromIntro')
    } else if (!isFromIntro) {
      // Not from intro - redirect to intro (only once)
      setShouldRedirect(true)
    }
  }, [])

  // Separate effect for navigation to avoid re-render issues
  useEffect(() => {
    if (shouldRedirect) {
      navigate('/intro', { replace: true })
    }
  }, [shouldRedirect, navigate])

  const [aboutRef, aboutInView] = useInView()
  const [howRef, howInView] = useInView()
  const [diffRef, diffInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView()
  const [storyRef, storyInView] = useInView()
  const [journeyRef, journeyInView] = useInView()

  const [counts, setCounts] = useState({ reach: 0, help: 0, youth: 0 })
  const [imageIndex, setImageIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(null)
  const [isCrossfading, setIsCrossfading] = useState(false)
  const images = [
    'desi-1.jpg',
    'desi-2.jpg',
    'desi-3.jpg',
    'desi-4.jpg',
    'desi-5.jpg',
    'desi-6.jpg',
    'desi-7.jpg',
    'desi-8.jpg',
  ]

  function nextImage() {
    const next = (imageIndex + 1) % images.length
    setPrevIndex(imageIndex)
    setImageIndex(next)
    setIsCrossfading(true)
    setTimeout(() => {
      setPrevIndex(null)
      setIsCrossfading(false)
    }, 500) // match CSS duration
  }

  function prevImage() {
    const prev = (imageIndex - 1 + images.length) % images.length
    setPrevIndex(imageIndex)
    setImageIndex(prev)
    setIsCrossfading(true)
    setTimeout(() => {
      setPrevIndex(null)
      setIsCrossfading(false)
    }, 500) 
  }

  useEffect(() => {
    if (!statsInView) return

    const targets = { reach: 20, help: 75, youth: 50 } 
    const duration = 1200
    const start = performance.now()

    function step(now) {
      const t = Math.min(1, (now - start) / duration)
      setCounts({
        reach: Math.round(targets.reach * t),
        help: Math.round(targets.help * t),
        youth: Math.round(targets.youth * t),
      })
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [statsInView])

  useEffect(() => {
    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    function handleMove(e) {
      const sparkle = document.createElement('span')
      sparkle.className = 'sparkle'
      sparkle.style.left = `${e.clientX}px`
      sparkle.style.top = `${e.clientY}px`
      document.body.appendChild(sparkle)
      setTimeout(() => {
        sparkle.remove()
      }, 600)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <motion.main 
      id="top"
      initial={isFromIntro ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: 'easeOut'
      }}
    >
      <section className="hero-new" ref={heroRef}>
        <HeroParticleBackground />
        <div className="hero-content">
          <div className="hero-text-new">
            <h1 className="hero-heading">
              <span className="hero-heading-line">
                <span className="hero-word">Making sense</span>
              </span>
              <span className="hero-heading-line">
                <span className="hero-word">of what you</span>{' '}
                <span className="hero-word hero-accent">feel.</span>
              </span>
            </h1>
            
            <p className="hero-description">
              A calm space to pause, understand yourself better, and move forward—gently, at your own pace.
            </p>
            
            <div className="hero-cta">
              <a href="/booking" className="hero-btn-primary">
                Start when you're ready
              </a>
              <p className="hero-fine-print">
                Private and judgment-free · Move at your own pace
              </p>
            </div>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-hero-stats" />

      <section
        id="stats"
        className={`section-alt section stats-layout fade-in-section ${statsInView ? 'in-view' : ''}`}
        ref={statsRef}
      >
        <div className="section-header">
          <p className="eyebrow">Mental Wellness — By the numbers</p>
          <h2>Small facts, big reasons to care</h2>
        </div>

        <div className="stats-grid-minimal">
          <div className="stat-item-minimal">
            <span className="stat-number-minimal">{counts.reach}%</span>
            <span className="stat-label-minimal">of adults</span>
            <p className="stat-desc-minimal">Feel low, anxious or overwhelmed at some point</p>
          </div>

          <div className="stat-item-minimal">
            <span className="stat-number-minimal">{counts.help}%</span>
            <span className="stat-label-minimal">of people</span>
            <p className="stat-desc-minimal">Feel lighter when they speak to someone they trust</p>
          </div>

          <div className="stat-item-minimal">
            <span className="stat-number-minimal">{counts.youth}%</span>
            <span className="stat-label-minimal">of patterns</span>
            <p className="stat-desc-minimal">Begin in our younger years</p>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-stats-about" />

      {/* Section 3: Why MindSettler Exists */}
      <section id="why-mindsettler" className={`section-why fade-in-section ${aboutInView ? 'in-view' : ''}`} ref={aboutRef}>
        <div className="why-container">
          <header className="why-header">
            <h2 className="why-headline">A space to make sense of what you're feeling</h2>
            <p className="why-subtext">
              Not therapy. Not advice. Just a calm, structured place to slow down, reflect, and understand yourself a little better.
            </p>
          </header>

          <div className="why-grid">
            {/* Left panel: Why this exists */}
            <div className="why-panel">
              <h3 className="why-panel-title">Why this space was created</h3>
              <p className="why-panel-text">
                Many of us carry feelings we can't quite name—restlessness, confusion, a quiet sense that something is off. 
                But we don't always have the words, or the space, to figure it out.
              </p>
              <p className="why-panel-text">
                MindSettler was created for those moments. It's a contained space where you can pause, 
                make sense of your patterns, and move forward with a little more clarity—without pressure or judgment.
              </p>
            </div>

            {/* Right panel: How we support you */}
            <div className="why-panel">
              <h3 className="why-panel-title">How we support you</h3>
              <ul className="why-list">
                <li>
                  <span className="why-list-label">Conversation-based</span>
                  <span className="why-list-desc">We talk through what's on your mind, at your pace.</span>
                </li>
                <li>
                  <span className="why-list-label">Reflective and structured</span>
                  <span className="why-list-desc">Each session has a gentle shape—check-in, exploration, grounding.</span>
                </li>
                <li>
                  <span className="why-list-label">Psycho-education, simply</span>
                  <span className="why-list-desc">We share frameworks that help you understand yourself—without jargon.</span>
                </li>
                <li>
                  <span className="why-list-label">Clear boundaries</span>
                  <span className="why-list-desc">Confidentiality and ethics are explained upfront, always.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-why-journey" />

      {/* Section 4: Your Journey */}
      <section id="your-journey" className={`section-journey fade-in-section ${journeyInView ? 'in-view' : ''}`} ref={journeyRef}>
        <div className="journey-container">
          <header className="journey-header">
            <p className="journey-eyebrow">At your own pace</p>
            <h2 className="journey-headline">What the journey might look like</h2>
            <p className="journey-intro">
              There's no fixed path here. Every journey is shaped by what you need, when you need it. 
              These are simply the kinds of moments that often unfold—gently, and only when you're ready.
            </p>
          </header>

          <div className="journey-steps">
            <div className="journey-step">
              <div className="journey-step-marker" aria-hidden="true"></div>
              <div className="journey-step-content">
                <h3 className="journey-step-title">Sharing what's on your mind</h3>
                <p className="journey-step-text">
                  You begin wherever feels right—what's been weighing on you, what brought you here, 
                  or simply what's present today. There's no script to follow.
                </p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step-marker" aria-hidden="true"></div>
              <div className="journey-step-content">
                <h3 className="journey-step-title">Slowing down together</h3>
                <p className="journey-step-text">
                  We take time to sit with what you've shared. Patterns often become clearer 
                  when we're not rushing to fix them.
                </p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step-marker" aria-hidden="true"></div>
              <div className="journey-step-content">
                <h3 className="journey-step-title">Making sense of patterns</h3>
                <p className="journey-step-text">
                  Together, we explore what keeps showing up—not to judge, but to understand. 
                  Sometimes naming something is the first step toward easing it.
                </p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step-marker" aria-hidden="true"></div>
              <div className="journey-step-content">
                <h3 className="journey-step-title">Finding your ground</h3>
                <p className="journey-step-text">
                  Each session ends with a moment of grounding—a way to leave feeling a little more 
                  settled than when you arrived.
                </p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step-marker" aria-hidden="true"></div>
              <div className="journey-step-content">
                <h3 className="journey-step-title">Deciding what comes next</h3>
                <p className="journey-step-text">
                  Continuing is always a choice. Whether you return for another session or take time 
                  to process on your own, the door stays open.
                </p>
              </div>
            </div>
          </div>

          <p className="journey-closing">
            You won't be rushed. You won't be pushed. This space moves at your pace.
          </p>
        </div>
      </section>

      <ParticleDivider id="divider-journey-story" />

      <section id="mindsettler-story" className={`section section-alt fade-in-section ${storyInView ? 'in-view' : ''}`} ref={storyRef}>
        <div className="section-header">
          <p className="eyebrow">In the founder's words</p>
          <h2>What MindSettler really means</h2>
          <p className="section-subtitle">
            A short reflection from the creator of MindSettler on why this space exists and what it hopes
            to offer.
          </p>
        </div>

        <div className="two-column mindsettler-story-grid">
          <div className="card founder-note">
            <p className="eyebrow">A note from the founder</p>
            <h3>Why I created MindSettler</h3>
            <p>
              MindSettler began as a quiet question: what if there was a soft corner of the internet where
              people could slow down, name what they are feeling, and be met without judgement?
            </p>
            <p>
              Over the years, in my own therapy and in conversations with friends, I kept seeing how powerful
              it is when someone finally finds language for what has been sitting inside them for a long time.
            </p>
            <p>
              This space is my way of offering that to you – a contained, thoughtful studio where psychology
              meets everyday life, and where your stories are held with care.
            </p>
          <div className="founder-embed" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <div className="founder-embed-frame" style={{ width: '100%', maxWidth: 480, borderRadius: 12, overflow: 'hidden', boxShadow: '0 18px 40px rgba(63,41,101,0.12)' }}>
              <iframe
                src="https://www.instagram.com/p/DSuAGlojGV9/embed"
                title="Founder supplementary post"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                style={{ width: '100%', border: 'none' }}
              />
            </div>
          </div>
          </div>

          <div className="mindsettler-reel-wrapper">
            <div className="mindsettler-reel-frame">
              <iframe
                src="https://www.instagram.com/p/DQ_Nzguk50a/embed"
                title="MindSettler founder describing the meaning of MindSettler"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-story-services" />

      <section id="services" className={`section section-alt fade-in-section ${servicesInView ? 'in-view' : ''}`} ref={servicesRef}>
        <div className="section-header">
          <p className="eyebrow">Services we offer</p>
          <h2>Personalised therapy designed around you</h2>
          <p className="section-subtitle">
            A mix of evidence-based approaches and warm, human conversation – chosen according to what
            you are working through, not a one-size-fits-all plan.
          </p>
        </div>

        <div className="two-column services-list">
          <div className="card">
            <h3>Individual therapies</h3>
            <ul className="bullet-list">
              <li>Cognitive Behavioural Therapy (CBT)</li>
              <li>Dialectical Behavioural Therapy (DBT)</li>
              <li>Acceptance &amp; Commitment Therapy (ACT)</li>
              <li>Schema Therapy</li>
              <li>Emotion-Focused Therapy (EFT)</li>
            </ul>
          </div>

          <div className="card">
            <h3>Relational &amp; supportive work</h3>
            <ul className="bullet-list">
              <li>Emotion-Focused Couples Therapy</li>
              <li>Mindfulness-Based Cognitive Therapy</li>
              <li>Client-Centred Therapy</li>
              <li>Space to integrate these approaches gently at your pace</li>
            </ul>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-services-how" />

      <section id="how-it-works" className={`section fade-in-section ${howInView ? 'in-view' : ''}`} ref={howRef}>
        <div className="section-header">
          <p className="eyebrow">How it works</p>
          <h2>From first message to settled next steps</h2>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-number">1</span>
            <div>
              <h3>Share what brings you here</h3>
              <p>
                Use the booking or contact form to tell us a little about why you are seeking support now.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-number">2</span>
            <div>
              <h3>Choose a 60-minute slot</h3>
              <p>
                Select an online or offline session and pick from the available time slots.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-number">3</span>
            <div>
              <h3>Confirmation &amp; payment</h3>
              <p>
                Your appointment is reviewed and confirmed. You receive UPI or cash details for payment.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-number">4</span>
            <div>
              <h3>Your first session</h3>
              <p>
                A contained, confidential space to slow down, make sense of things, and feel a little more
                grounded.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-number">5</span>
            <div>
              <h3>Designing your journey</h3>
              <p>
                Together, you decide if you want to continue with follow-up sessions or a structured journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ParticleDivider id="divider-how-difference" />

      <section id="difference" className={`section fade-in-section ${diffInView ? 'in-view' : ''}`} ref={diffRef}>
        <div className="section-header">
          <p className="eyebrow">What makes MindSettler different</p>
          <h2>Gentle, structured, and grounded in real life</h2>
        </div>
        <div className="three-column">
          <div className="card">
            <h3>Structured sessions</h3>
            <p>
              Each session follows a clear flow – check-in, exploration, psycho-education, and grounding – so you
              do not feel lost or rushed.
            </p>
          </div>
          <div className="card">
            <h3>Confidential &amp; boundaried</h3>
            <p>
              You know what is confidential and what the limits are, right from the first session.
            </p>
          </div>
          <div className="card">
            <h3>Personalised guidance</h3>
            <p>
              The work adapts to your pace, your story, and the realities of your everyday life.
            </p>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
