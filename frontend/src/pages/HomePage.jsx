import React, { useState, useEffect, useRef } from 'react'
import {
  Heart,
  Brain,
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Users,
  Quote,
  Play,
  Zap,
  Shield,
  Activity,
  Plus,
  Minus,
  Map,
  Compass,
  Footprints,
  Mountain
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FloatingBlobs } from '../components/FloatingBlobs'
import { FadeIn } from '../components/FadeIn'
import CircularGallerySection from '../components/CircularGallerySection'

// --- Data ---
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Services', href: '#services' },
  { label: 'FAQs', href: '#faqs' },
]

const STATS = [
  { value: '20%', label: 'Of Adults', description: 'Feel low, anxious or overwhelmed at some point.' },
  { value: '75%', label: 'Of People', description: 'Feel lighter when they speak to someone they trust.' },
  { value: '50%', label: 'Of Patterns', description: 'Begin in our younger years and repeat until addressed.' },
]

const PSYCHO_ED_DATA = [
  {
    title: "Focus & Clarity",
    description: "Cut through the noise. Activate deep work states and clear mental fog with structured reasoning techniques.",
    icon: Zap,
  },
  {
    title: "Anxiety & Calm",
    description: "Soothe the alarm bells. Down-regulate your nervous system using evidence-based grounding methods.",
    icon: Shield,
  },
  {
    title: "Sensory Grounding",
    description: "Return to the present. Connect with your physical environment to stop spiraling thoughts instantly.",
    icon: Activity,
  },
  {
    title: "Self Confidence",
    description: "Reframe your narrative. Build quiet strength and resilience through cognitive reframing.",
    icon: Sparkles,
  },
]

const JOURNEY_STAGES = [
  {
    step: "01",
    title: "Valley of Overwhelm",
    description: "Things feel heavy, scattered, or confusing. You know something needs attention, but you are not sure where to begin.",
    icon: Mountain
  },
  {
    step: "02",
    title: "Bridge of Understanding",
    description: "Through conversations and psycho-education, you begin to see patterns and name what is going on.",
    icon: Map
  },
  {
    step: "03",
    title: "Path of Practice",
    description: "You experiment with small shifts, practices, and boundaries that support your mental well-being.",
    icon: Footprints
  },
  {
    step: "04",
    title: "Plateau of Integration",
    description: "You carry a clearer understanding of yourself and practical tools into your everyday life.",
    icon: Compass
  }
]

const FAQ_DATA = [
  {
    question: "Is MindSettler a replacement for therapy or psychiatry?",
    answer: "MindSettler focuses on psycho-education and counseling. While highly effective for navigating life's challenges, stress, and emotional clarity, it is not a medical replacement for clinical psychiatry or treatment for severe mental health disorders requiring medication."
  },
  {
    question: "What exactly happens in the sessions?",
    answer: "Sessions are a collaborative space. We typically start by checking in on how you're feeling, explore specific challenges you're facing, and use evidence-based frameworks to unpack them. You'll leave with clarity and often practical tools to try."
  },
  {
    question: "Is everything I share confidential?",
    answer: "Yes. Confidentiality is paramount. Your sessions are a safe space, and information is never shared with third parties unless there is an immediate risk of harm to yourself or others, as per standard ethical guidelines."
  },
  {
    question: "How do I pay for sessions?",
    answer: "Payment is simple and transparent. Once a slot is confirmed, you will receive details for UPI or bank transfer. Payment is generally required prior to the session to secure the booking."
  },
  {
    question: "Can I cancel or reschedule?",
    answer: "Life happens. You can reschedule or cancel your session up to 24 hours in advance without any fee. Cancellations made within 24 hours may incur a cancellation fee to respect the time reserved."
  }
]

const STEPS = [
  { number: 1, title: 'Share what brings you here', description: 'Use the booking or contact form to tell us a little about why you are seeking support now.' },
  { number: 2, title: 'Choose a 60-minute slot', description: 'Select an online or offline session and pick from the available time slots.' },
  { number: 3, title: 'Confirmation & payment', description: 'Your appointment is reviewed and confirmed. You receive UPI or cash details for payment.' },
  { number: 4, title: 'Your first session', description: 'A contained, confidential space to slow down, make sense of things, and feel a little more grounded.' },
  { number: 5, title: 'Designing your journey', description: 'Together, you decide if you want to continue with follow-up sessions or a structured journey.' },
]

// --- Sub-Components ---

const Navbar = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-lg backdrop-blur-sm group-hover:bg-white transition-colors">
            <Heart className={`w-5 h-5 text-secondary-600 fill-primary-200 transition-transform duration-500 group-hover:scale-110`} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold text-secondary-900 leading-none tracking-tight drop-shadow-sm">MindSettler</span>
            <span className="text-[10px] text-primary-800 font-bold tracking-widest uppercase ml-0.5 opacity-80">By Parnika</span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-secondary-900 hover:text-primary-700 transition-colors px-3 py-1 rounded-full hover:bg-white/50"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button onClick={() => navigate('/booking')} className="bg-secondary-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary-800 transition-all shadow-lg hover:shadow-primary-400/50 hover:-translate-y-0.5 flex items-center gap-2">
            Book a Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-secondary-900 bg-white/50 p-2 rounded-full backdrop-blur-md" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl absolute top-0 left-0 w-full z-[60] overflow-hidden flex flex-col"
          >
            <div className="p-6 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="p-2 bg-secondary-50 rounded-full">
                <X className="w-6 h-6 text-secondary-900" />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-6 items-center justify-center flex-1">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-display font-medium text-secondary-900"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <button onClick={() => {
                setIsOpen(false)
                navigate('/booking')
              }} className="bg-secondary-900 text-white py-4 px-10 rounded-full font-medium mt-8 text-lg w-full max-w-xs shadow-xl">
                Book a Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const Hero = ({ navigate }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
          poster="https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?q=80&w=2560&auto=format&fit=crop"
        >
          <source src="/main_page_vid.mp4" type="video/mp4" />
        </video>

        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-50/90 via-white/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        <div className="order-2 lg:order-1">
          <FadeIn delay={0.2}>
            <h1 className="font-display text-5xl lg:text-7xl xl:text-8xl font-bold text-secondary-950 leading-[1.1] mb-6 drop-shadow-sm">
              Making sense of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 relative">
                what you feel.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xl text-secondary-800 font-medium leading-relaxed mb-10 max-w-lg">
              A calm space to pause, understand yourself better, and move forward—gently, at your own pace.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <button
              onClick={() => navigate('/booking')}
              className="px-8 py-4 bg-secondary-900 text-white rounded-full font-medium text-lg hover:bg-secondary-800 transition-all shadow-xl hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Start your journey
              <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

const Stats = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/20 to-white"></div>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-16">
          <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-3 block">Mental Wellness by the numbers</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900">Small facts, big reasons to care</h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {STATS.map((stat, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <div className="h-full bg-white/60 backdrop-blur-sm rounded-[2rem] p-10 border border-white shadow-sm hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-500 hover:-translate-y-2">
                <div className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-secondary-800 to-primary-500 mb-6">
                  {stat.value}
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">{stat.label}</h3>
                <p className="text-secondary-600 leading-relaxed text-lg">{stat.description}</p>
                <div className="mt-8 w-16 h-1 bg-gradient-to-r from-primary-300 to-transparent rounded-full group-hover:w-full transition-all duration-500"></div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

const About = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section id="about" ref={containerRef} className="relative bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[800px]">

        {/* Left Side - Image Container */}
        <div className="relative h-[600px] lg:h-full order-1 lg:order-1 overflow-hidden group bg-primary-50 flex items-center justify-center p-8 lg:p-16">
          <motion.div style={{ y }} className="w-full h-full relative z-10">
            <img
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2560&auto=format&fit=crop"
              alt="Aesthetic calming plant and light"
              className="w-full h-full object-cover drop-shadow-2xl rounded-3xl"
            />
          </motion.div>

          {/* Decorative elements behind the image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 blur-3xl rounded-full -z-0"></div>
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center p-8 lg:p-24 order-2 lg:order-2 bg-gradient-to-br from-white to-secondary-50/30">
          <div className="max-w-xl">
            <FadeIn>
              <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-widest uppercase mb-6">About MindSettler</div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 mb-8">
                A psycho-education <span className="text-primary-600">studio</span> for everyday life
              </h2>
              <p className="text-lg text-secondary-700 leading-relaxed mb-6 font-medium">
                Explore our approach designed to help you find clarity, understanding, and peace of mind. Many of us sense that something inside is unsettled — but we do not always have the language to describe it.
              </p>
              <p className="text-lg text-secondary-600 leading-relaxed mb-10">
                MindSettler exists to make mental health understandable, relatable, and workable. Through structured conversations and simple frameworks, we help you see patterns clearly.
              </p>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                className="space-y-4 mb-12"
              >
                {[
                  "60-minute one-on-one or small group sessions",
                  "Blend of conversation, reflection, and psycho-education",
                  "Online or at a calm, contained physical studio"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
                    }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-secondary-50 hover:border-primary-200 transition-colors"
                  >
                    <div className="bg-green-100 p-1.5 rounded-full mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-secondary-800 font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quote Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Quote className="w-16 h-16 text-secondary-900" />
                </div>
                <p className="text-secondary-800 text-lg font-medium italic mb-6 leading-relaxed relative z-10">
                  "MindSettler began as a quiet question: what if there was a soft corner of the internet where people could slow down?"
                </p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-primary-100 overflow-hidden">
                    <img src="/parnika_p.png" className="w-full h-full object-cover" alt="Parnika - Founder of MindSettler" />
                  </div>
                  <div>
                    <p className="text-secondary-900 font-bold">Parnika</p>
                    <p className="text-secondary-500 text-sm uppercase tracking-wide">Founder</p>
                  </div>
                </div>
              </motion.div>

            </FadeIn>
          </div>
        </div>

      </div>
    </section>
  )
}

const Journey = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section id="journey" className="py-32 relative bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-transparent to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-50/50 via-transparent to-transparent -z-10"></div>

      <div ref={containerRef} className="max-w-6xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-24">
          <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-3 block">Your journey with MindSettler</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">From foggy to a little more clear</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">We walk this path together, transforming uncertainty into understanding through four key stages.</p>
        </FadeIn>

        <div className="relative">
          {/* The Organic Winding Path (Desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[600px] hidden md:block pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 600 1200" preserveAspectRatio="none">
              {/* Background Path (Dotted) */}
              <path
                d="M 300 0 C 300 100, 100 100, 100 300 C 100 500, 500 500, 500 700 C 500 900, 300 900, 300 1200"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
                strokeDasharray="10 10"
                strokeLinecap="round"
              />
              {/* Animated Foreground Path (Gradient) */}
              <motion.path
                d="M 300 0 C 300 100, 100 100, 100 300 C 100 500, 500 500, 500 700 C 500 900, 300 900, 300 1200"
                fill="none"
                stroke="url(#gradient-path)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="gradient-path" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#db2777" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Mobile Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-secondary-300 to-primary-200 md:hidden rounded-full"></div>

          <div className="space-y-16 md:space-y-32 py-12">
            {JOURNEY_STAGES.map((stage, i) => {
              const isEven = i % 2 === 0
              const Icon = stage.icon
              return (
                <div key={i} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>

                  {/* Mobile Node */}
                  <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary-500 border-4 border-white shadow-sm z-20 md:hidden"></div>

                  {/* Spacer for Desktop Grid */}
                  <div className="flex-1 hidden md:block"></div>

                  {/* Card Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${isEven ? 'md:pr-24' : 'md:pl-24'}`}>
                    <FadeIn delay={i * 0.1}>
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass-card p-8 rounded-[2rem] relative group border border-white/60 hover:border-primary-300 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary-900/10 bg-white/40"
                      >
                        {/* Step Badge */}
                        <div className="absolute -top-6 left-8 bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>Step {stage.step}</span>
                        </div>

                        <h3 className="text-2xl font-display font-bold text-secondary-900 mt-4 mb-3">{stage.title}</h3>
                        <p className="text-secondary-600 leading-relaxed text-lg">{stage.description}</p>
                      </motion.div>
                    </FadeIn>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const InnerState = () => {
  return (
    <section id="services" className="py-32 relative overflow-hidden bg-slate-900">
      {/* Dark theme for contrast */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary-600/20 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Text Content */}
          <div className="lg:col-span-4">
            <FadeIn>
              <span className="text-primary-400 font-bold tracking-widest text-sm uppercase mb-4 block">Psycho-education</span>
              <h2 className="text-5xl lg:text-7xl font-display font-medium text-white mb-8">
                Explore Your <br />
                <span className="italic text-primary-300">Inner State</span>
              </h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Select a dimension of mental well-being to understand common patterns. We believe that naming a feeling is the first step to taming it.
              </p>
              <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-primary-50 transition-colors">
                View All Resources
              </button>
            </FadeIn>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6">
              {PSYCHO_ED_DATA.map((item, i) => {
                const Icon = item.icon
                return (
                  <FadeIn key={i} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] transition-all duration-300 group cursor-pointer h-full"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-primary-500 transition-colors">
                          <Icon className="w-7 h-7" strokeWidth={1.5} />
                        </div>
                        <ArrowRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{item.description}</p>
                    </motion.div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Services = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const yIcon1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const yIcon2 = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      {/* Animated Background */}
      <FloatingBlobs />

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-3 block">Services we offer</span>
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">Personalised therapy designed around you</h2>
          <p className="text-secondary-800 text-lg font-medium">A mix of evidence-based approaches and warm, human conversation – chosen according to what you are working through.</p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Card 1 */}
          <FadeIn direction='up' className="h-full">
            <div className="glass-card rounded-[3rem] p-12 h-full hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-900/10 group border border-secondary-100/50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10 relative z-10">
                <motion.div style={{ y: yIcon1 }} className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform text-primary-600">
                  <Brain className="w-10 h-10" />
                </motion.div>
                <div className="px-5 py-2 rounded-full bg-secondary-900 text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              </div>

              <h3 className="text-4xl font-display font-bold text-secondary-900 mb-6 relative z-10">Individual Therapies</h3>
              <p className="text-secondary-600 mb-10 leading-relaxed text-lg relative z-10">Focused one-on-one sessions to help you understand your patterns, process emotions, and build resilience.</p>

              <div className="space-y-4 relative z-10">
                {['Cognitive Behavioural Therapy (CBT)', 'Dialectical Behavioural Therapy (DBT)', 'Acceptance & Commitment Therapy (ACT)', 'Schema Therapy'].map(item => (
                  <div key={item} className="flex items-center gap-4 text-secondary-800 font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn direction='up' delay={0.2} className="h-full">
            <div className="glass-card rounded-[3rem] p-12 h-full hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary-900/10 group border border-secondary-100/50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10 relative z-10">
                <motion.div style={{ y: yIcon2 }} className="w-20 h-20 bg-secondary-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform text-secondary-600">
                  <Users className="w-10 h-10" />
                </motion.div>
              </div>

              <h3 className="text-4xl font-display font-bold text-secondary-900 mb-6 relative z-10">Relational & Supportive</h3>
              <p className="text-secondary-600 mb-10 leading-relaxed text-lg relative z-10">Creating safe spaces for couples and individuals to explore relationships, communication, and emotional bonds.</p>

              <div className="space-y-4 relative z-10">
                {['Emotion-Focused Couples Therapy', 'Mindfulness-Based Cognitive Therapy', 'Client-Centred Therapy', 'Space to integrate these approaches'].map(item => (
                  <div key={item} className="flex items-center gap-4 text-secondary-800 font-medium">
                    <div className="w-2 h-2 rounded-full bg-secondary-400"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Single Learn More Button */}
        <FadeIn delay={0.3} className="mt-12 text-center">
          <a href="/therapies" className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl">
            Learn More About Our Therapies
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

const Process = () => {
  return (
    <section className="py-32 relative bg-secondary-50/50">
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Sticky Left Content */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              <FadeIn>
                <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-4 block">How it works</span>
                <h2 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 mb-8">From first message to settled next steps.</h2>
                <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                  We have made the process as simple and transparent as possible. No confusing forms, just a clear path to getting support.
                </p>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-primary-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">Need help deciding?</p>
                      <p className="text-sm text-secondary-500">Chat with us for a quick consultation.</p>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 bg-secondary-900 text-white rounded-xl font-medium hover:bg-secondary-800 transition-colors"
                    onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                  >Start Chat</button>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Scrolling Right Content */}
          <div className="lg:col-span-7">
            <div className="relative border-l-2 border-primary-200 ml-6 md:ml-0 space-y-16 py-4">
              {STEPS.map((step, index) => (
                <FadeIn key={step.number} delay={index * 0.1} className="relative pl-12 md:pl-16">
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-primary-500 border-4 border-white shadow-md"></div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-secondary-100 hover:shadow-lg transition-all duration-300">
                    <span className="text-4xl font-display font-bold text-primary-100 absolute top-4 right-6 select-none">{step.number}</span>
                    <h3 className="text-2xl font-bold text-secondary-900 mb-3 relative z-10">{step.title}</h3>
                    <p className="text-secondary-600 leading-relaxed relative z-10">{step.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faqs" className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Header Column */}
          <div className="lg:col-span-4">
            <FadeIn>
              <span className="text-primary-600 font-bold tracking-widest text-sm uppercase mb-3 block">Questions you might have</span>
              <h2 className="text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-8">FAQs</h2>
              <p className="text-lg text-secondary-600 mb-8">
                Can't find what you're looking for? Reach out to our support team directly.
              </p>
              <a href="#contact" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-800 transition-colors">
                Contact Support <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </FadeIn>
          </div>

          {/* Accordion Column */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {FAQ_DATA.map((faq, index) => {
                const isOpen = openIndex === index
                return (
                  <FadeIn key={index} delay={index * 0.1}>
                    <div
                      className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${isOpen ? 'bg-secondary-50 border-secondary-200' : 'bg-white border-gray-100 hover:border-secondary-200'}`}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      <div className="p-6 flex items-start justify-between gap-4">
                        <h3 className={`text-lg transition-colors leading-tight ${isOpen ? 'text-secondary-900 font-bold' : 'text-secondary-700 font-medium'}`}>
                          {faq.question}
                        </h3>
                        <div className={`p-1 rounded-full shrink-0 transition-colors mt-0.5 ${isOpen ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 text-secondary-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// --- Main Component ---

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-primary-200 selection:text-secondary-900 overflow-x-hidden">
      <main>
        <Hero navigate={navigate} />
        <Stats />
        <About />
        <CircularGallerySection />
        <Journey />
        <InnerState />
        <Services />
        <Process />
        <FAQ />
      </main>

      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 bg-secondary-900 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-secondary-800 transition-colors border-2 border-white/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  )
}
