import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCircle2, Quote, RefreshCw, Shield, Target } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Scroll reveal variants for different sections
  const revealUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const revealScale = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <main>
      {/* Hero Section with Video and Founder Story */}
      <section id="about" ref={containerRef} className="relative overflow-hidden pt-20 pb-16">
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-white/30 -z-10"></div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto px-6 items-center">

          {/* Left Side - Video Container */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              {/* Video with decorative styling */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-pink-400 to-primary-500 rounded-[2.2rem] opacity-50 blur group-hover:opacity-70 transition-opacity duration-500"></div>

                <div className="relative rounded-[2rem] overflow-hidden bg-black">
                  <video
                    src="/mindsettler_intro.mp4"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full rounded-[2rem] object-cover"
                    style={{ maxHeight: '600px', aspectRatio: '9/16' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Founder Story */}
          <div className="order-1 lg:order-2">
            <FadeIn direction='left'>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-pink-100 border border-primary-200/50 mb-8 backdrop-blur-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                <span className="text-sm font-bold tracking-widest uppercase text-primary-700">A Note from the Founder</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-8 leading-tight"
              >
                Why I started{' '}
                <span className="bg-gradient-to-r from-primary-600 via-pink-500 to-primary-700 bg-clip-text text-transparent">
                  MindSettler
                </span>
              </motion.h2>

              {/* Founder Note Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white to-pink-50/50 p-8 rounded-3xl border border-primary-200/50 shadow-lg relative overflow-hidden group hover:border-primary-300 transition-all mb-8"
              >
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-pink-200/30 rounded-full blur-2xl -z-0"></div>

                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-primary-600" />
                </div>

                {/* Personal Message */}
                <div className="relative z-10 space-y-4">
                  <p className="text-secondary-700 text-lg leading-relaxed">
                    I started MindSettler after realizing that so many people struggle in silence — not because help isn't available, but because it doesn't always feel accessible or relatable.
                  </p>
                  <p className="text-secondary-700 text-lg leading-relaxed">
                    I wanted to create a gentle space where mental health could be understood without jargon, without judgment, and without rushing. A place where slowing down is welcomed, and where you can begin to make sense of what's happening inside.
                  </p>
                  <p className="text-secondary-800 text-lg leading-relaxed font-medium italic">
                    MindSettler is my small attempt to make that real.
                  </p>
                </div>

                {/* Signature */}
                <div className="flex items-center gap-4 mt-8 relative z-10 pt-6 border-t border-primary-100">
                  <div className="w-16 h-16 rounded-full border-2 border-primary-300 overflow-hidden shadow-md bg-white flex-shrink-0">
                    <img
                      src="/parnika_p.png"
                      className="w-full h-full object-cover"
                      alt="Parnika - Founder of MindSettler"
                      style={{ objectPosition: 'center center', transform: 'scale(1.3)', transformOrigin: 'center 30%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center text-primary-600 font-bold text-xl bg-gradient-to-br from-primary-100 to-pink-100">P</div>
                  </div>
                  <div>
                    <p className="text-secondary-900 font-bold text-lg">Parnika</p>
                    <p className="text-primary-600 text-sm uppercase tracking-wide font-semibold">Founder, MindSettler</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start">
                <motion.a
                  href="/booking"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-secondary-900 to-secondary-800 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:from-secondary-800 hover:to-secondary-700"
                >
                  <span>Begin Your Journey</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
              </div>

            </FadeIn>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-24 bg-gradient-to-b from-white/80 to-secondary-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-widest uppercase mb-6">What Makes Us Different</div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Gentle, structured, and <span className="text-primary-600">grounded in real life</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">Discover the principles that guide every interaction at MindSettler</p>
          </motion.div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Structured Sessions",
                description: "Each session follows a clear flow – check-in, exploration, psycho-education, and grounding – so you do not feel lost or rushed.",
                icon: RefreshCw,
                gradient: "from-primary-500 to-pink-500",
                bgGradient: "from-primary-50 to-pink-50"
              },
              {
                title: "Confidential & Boundaried",
                description: "You know what is confidential and what the limits are, right from the first session.",
                icon: Shield,
                gradient: "from-secondary-600 to-primary-600",
                bgGradient: "from-secondary-50 to-primary-50"
              },
              {
                title: "Personalized Guidance",
                description: "The work adapts to your pace, your story, and the realities of your everyday life.",
                icon: Target,
                gradient: "from-pink-500 to-primary-500",
                bgGradient: "from-pink-50 to-primary-50"
              }
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white p-8 rounded-3xl border border-secondary-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                  
                  {/* Decorative corner gradient */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}></div>
                  
                  {/* Icon container */}
                  <div className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-display font-bold text-secondary-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">{item.title}</h3>
                  <p className="text-secondary-600 leading-relaxed group-hover:text-secondary-700 transition-colors duration-300">{item.description}</p>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white via-secondary-50/30 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-widest uppercase mb-6">The Process</div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              From first message to <span className="text-primary-600">settled next steps</span>
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">A clear, compassionate journey designed for your comfort</p>
          </motion.div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            {/* Vertical connecting line */}
            <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-300 via-pink-300 to-primary-300"></div>
            
            <div className="space-y-4">
              {[
                {
                  number: "1",
                  title: "Share what brings you here",
                  description: "Use the booking or contact form to tell us a little about why you are seeking support now."
                },
                {
                  number: "2",
                  title: "Choose a 60-minute slot",
                  description: "Select an online or offline session and pick from the available time slots."
                },
                {
                  number: "3",
                  title: "Confirmation & Payment",
                  description: "Your appointment is reviewed and confirmed. You receive UPI or cash details for payment."
                },
                {
                  number: "4",
                  title: "Your First Session",
                  description: "A contained, confidential space to slow down, make sense of things, and feel a little more grounded."
                },
                {
                  number: "5",
                  title: "Designing Your Journey",
                  description: "Together, you decide if you want to continue with follow-up sessions or a structured journey."
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="group relative flex gap-6 lg:gap-8 items-start p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary-100 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Number badge */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-pink-500 text-white font-display font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow pt-1">
                    <h3 className="text-xl lg:text-2xl font-display font-bold text-secondary-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">{step.title}</h3>
                    <p className="text-secondary-600 leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Hover accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-pink-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            variants={revealScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Decorative badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 border border-primary-200 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-sm font-medium text-primary-700">Your Journey Starts Here</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 mb-6 leading-tight">
              Ready to{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-600 via-pink-500 to-primary-600 bg-clip-text text-transparent">settle in</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="url(#underline-gradient-light)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underline-gradient-light" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#a855f7"/>
                      <stop offset="0.5" stopColor="#ec4899"/>
                      <stop offset="1" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              ?
            </h2>
            <p className="text-xl text-secondary-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Take the first step towards understanding yourself better. Book a session with us today.
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="/booking"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-secondary-900 to-secondary-800 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10">Book a Session</span>
              <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-secondary-600 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                <span>Confidential & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                <span>Online & Offline Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                <span>Flexible Scheduling</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
