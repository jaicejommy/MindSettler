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
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
  }

  return (
    <main>
      {/* About Section with Image and Content */}
      <section id="about" ref={containerRef} className="relative bg-gradient-to-br from-primary-50 via-white to-pink-50 overflow-hidden pt-20 pb-16">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-primary-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-pink-200/20 rounded-full blur-3xl -z-10"></div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto px-6 items-center">
          
          {/* Left Side - Image Container */}
          <div className="relative h-[500px] lg:h-[600px] order-2 lg:order-1 overflow-hidden group">
             <motion.div style={{ y }} className="w-full h-full relative z-10">
               <img 
                 src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2560&auto=format&fit=crop"
                 alt="Aesthetic calming plant and light" 
                 className="w-full h-full object-cover drop-shadow-2xl rounded-[2rem]"
               />
             </motion.div>
             
             {/* Decorative frame effect */}
             <div className="absolute inset-0 rounded-[2rem] border-4 border-primary-300/30 pointer-events-none"></div>
             <div className="absolute -inset-6 rounded-[2rem] border border-pink-200/20 pointer-events-none"></div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
             <FadeIn direction='left'>
               {/* Badge */}
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-pink-100 border border-primary-200/50 mb-8 backdrop-blur-sm"
               >
                 <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                 <span className="text-sm font-bold tracking-widest uppercase text-primary-700">About MindSettler</span>
               </motion.div>

               {/* Heading */}
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-8 leading-tight"
               >
                 A psycho-education <br />
                 <span className="bg-gradient-to-r from-primary-600 via-pink-500 to-primary-700 bg-clip-text text-transparent">
                   studio for everyday
                 </span>
                 <br />
                 life
               </motion.h2>

               {/* Description */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="mb-10"
               >
                 <p className="text-lg text-secondary-700 leading-relaxed mb-5 font-medium">
                   Explore our approach designed to help you find clarity, understanding, and peace of mind.
                 </p>
                 <p className="text-lg text-secondary-600 leading-relaxed">
                   Many of us sense that something inside is unsettled — but we do not always have the language to describe it. MindSettler exists to make mental health understandable, relatable, and workable.
                 </p>
               </motion.div>
               
               {/* Feature List */}
               <motion.div 
                 variants={listVariants}
                 initial="hidden"
                 whileInView="show"
                 viewport={{ once: true, margin: "-50px" }}
                 className="space-y-4 mb-12"
               >
                  {[
                    "60-minute one-on-one or small group sessions",
                    "Blend of conversation, reflection, and psycho-education",
                    "Online or at a calm, contained physical studio"
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants} 
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-pink-50/80 backdrop-blur-sm border border-primary-200/30 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-300 group/item"
                    >
                      <div className="bg-gradient-to-br from-primary-200 to-pink-200 p-1.5 rounded-full mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      </div>
                      <span className="text-secondary-800 font-medium">{item}</span>
                    </motion.div>
                  ))}
               </motion.div>

               {/* Founder Quote Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 }}
                 className="bg-gradient-to-br from-white to-pink-50/50 p-8 rounded-3xl border border-primary-200/50 shadow-lg relative overflow-hidden group hover:border-primary-300 transition-all"
               >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-pink-200/30 rounded-full blur-2xl -z-0"></div>
                  
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-16 h-16 text-primary-600" />
                  </div>

                  {/* Quote text */}
                  <p className="text-secondary-800 text-lg font-medium italic mb-8 leading-relaxed relative z-10">
                    "MindSettler began as a quiet question: what if there was a soft corner of the internet where people could slow down?"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-12 h-12 rounded-full border-3 border-primary-300 overflow-hidden shadow-md">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop" className="w-full h-full object-cover" alt="Founder Parnika" />
                     </div>
                     <div>
                        <p className="text-secondary-900 font-bold">Parnika</p>
                        <p className="text-primary-600 text-sm uppercase tracking-wide font-semibold">Founder</p>
                     </div>
                  </div>
               </motion.div>

             </FadeIn>
           </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-widest uppercase mb-6">What Makes Us Different</div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                Gentle, structured, and <span className="text-primary-600">grounded in real life</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">Discover the principles that guide every interaction at MindSettler</p>
            </div>
          </FadeIn>

          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
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
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-widest uppercase mb-6">The Process</div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                From first message to <span className="text-primary-600">settled next steps</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">A clear, compassionate journey designed for your comfort</p>
            </div>
          </FadeIn>

          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
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
          <FadeIn>
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
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
