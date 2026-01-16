import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCircle2, Quote } from 'lucide-react'
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

                <div className="relative rounded-[2rem] overflow-hidden">
                  <video
                    src="/mindsettler_intro.mp4"
                    controls
                    muted
                    playsInline
                    poster="/video-poster.jpg"
                    className="w-full h-full rounded-[2rem] object-cover"
                    style={{ maxHeight: '600px', aspectRatio: '9/16' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Play hint badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-primary-100 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="text-sm font-medium text-secondary-700">Watch our story</span>
              </motion.div>
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
                icon: "🔄"
              },
              {
                title: "Confidential & Boundaried",
                description: "You know what is confidential and what the limits are, right from the first session.",
                icon: "🔒"
              },
              {
                title: "Personalized Guidance",
                description: "The work adapts to your pace, your story, and the realities of your everyday life.",
                icon: "🎯"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white p-8 rounded-3xl border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-display font-bold text-secondary-900 mb-4">{item.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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
            className="space-y-6"
          >
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
                className="flex gap-6 lg:gap-10 items-start p-8 bg-gradient-to-br from-white to-secondary-50/50 rounded-3xl border border-secondary-100 hover:border-primary-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-display font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl lg:text-2xl font-display font-bold text-secondary-900 mb-2">{step.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-100 via-pink-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            variants={revealScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Ready to settle in?
            </h2>
            <p className="text-xl text-secondary-700 mb-10 max-w-2xl mx-auto font-medium">
              Take the first step towards understanding yourself better. Book a session with us today.
            </p>
            <motion.a
              href="/booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-4 bg-gradient-to-r from-secondary-900 to-secondary-800 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:from-secondary-800 hover:to-secondary-700"
            >
              Book a Session
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
