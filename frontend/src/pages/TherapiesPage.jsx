import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const THERAPIES = [
  {
    id: 'cbt',
    name: 'Cognitive Behavioural Therapy (CBT)',
    image: '/CBT.png',
    gradient: 'from-blue-100 via-purple-50 to-pink-50',
    color: '#3B82F6',
    benefits: [
      'Identify and change unhelpful thought patterns',
      'Develop better coping skills and emotional regulation',
      'Improve problem-solving in everyday life',
      'Structured, goal-oriented approach'
    ],
  },
  {
    id: 'dbt',
    name: 'Dialectical Behavioural Therapy (DBT)',
    image: '/DBT.png',
    gradient: 'from-purple-100 via-indigo-50 to-blue-50',
    color: '#8B5CF6',
    benefits: [
      'Build emotional regulation skills',
      'Develop distress tolerance techniques',
      'Improve interpersonal effectiveness',
      'Practice mindfulness in daily life'
    ],
  },
  {
    id: 'act',
    name: 'Acceptance & Commitment Therapy (ACT)',
    image: '/ACT.png',
    gradient: 'from-amber-50 via-orange-50 to-rose-50',
    color: '#F59E0B',
    benefits: [
      'Develop psychological flexibility',
      'Learn to accept difficult thoughts and feelings',
      'Commit to values-aligned actions',
      'Focus on meaningful living'
    ],
  },
  {
    id: 'schema',
    name: 'Schema Therapy',
    image: '/ST.png',
    gradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    color: '#14B8A6',
    benefits: [
      'Explore deep-rooted patterns from early life',
      'Understand long-standing emotional challenges',
      'Create healthier ways of thinking and relating',
      'Address core emotional needs'
    ],
  },
  {
    id: 'eft',
    name: 'Emotion-Focused Therapy (EFT)',
    image: '/EFT.png',
    gradient: 'from-orange-100 via-amber-50 to-yellow-50',
    color: '#EC4899',
    benefits: [
      'Understand and process emotions effectively',
      'Build emotional awareness and resilience',
      'Develop healthier responses to challenges',
      'Create lasting emotional change'
    ],
  },
  {
    id: 'efct',
    name: 'Emotion-Focused Couples Therapy',
    image: '/EFCT.png',
    gradient: 'from-teal-50 via-emerald-50 to-green-50',
    color: '#10B981',
    benefits: [
      'Strengthen emotional bonds between partners',
      'Improve communication and rebuild trust',
      'Create secure, supportive relationships',
      'Structured, research-based approach'
    ],
  },
  {
    id: 'mbct',
    name: 'Mindfulness-Based Cognitive Therapy (MBCT)',
    image: '/MBCT.png',
    gradient: 'from-violet-100 via-purple-50 to-fuchsia-50',
    color: '#6366F1',
    benefits: [
      'Combine cognitive techniques with mindfulness',
      'Increase awareness of thoughts and emotions',
      'Reduce emotional reactivity',
      'Promote mental balance and clarity'
    ],
  },
  {
    id: 'cct',
    name: 'Client-Centred Therapy',
    image: '/CCT.png',
    gradient: 'from-rose-50 via-pink-50 to-red-50',
    color: '#F43F5E',
    benefits: [
      'Person-centered therapeutic process',
      'Emphasis on empathy and acceptance',
      'Self-exploration at your own pace',
      'Non-directive, compassionate approach'
    ],
  },
  {
    id: 'custom',
    name: 'Custom Therapy Plan',
    image: '/Custom.png',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    color: '#84CC16',
    benefits: [
      'Personalized approach tailored to your unique needs',
      'Combine multiple therapeutic techniques',
      'Flexible scheduling based on your availability',
      'Continuous adaptation to your progress'
    ],
  },
]

function TherapyCard({ therapy, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden h-full shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-secondary-100/50 flex flex-col">
        {/* Image Area */}
        <div className={`h-48 bg-gradient-to-br ${therapy.gradient} relative overflow-hidden`}>
          <img 
            src={therapy.image} 
            alt={therapy.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          {/* Fallback gradient decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-32 h-32 rounded-full bg-white/50 blur-2xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-secondary-900 text-center mb-5 leading-tight">
            {therapy.name}
          </h3>

          {/* Benefits with checkmarks */}
          <div className="space-y-3 flex-grow mb-6">
            {therapy.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: therapy.color }} />
                <span className="text-secondary-600 text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/therapy/${therapy.id}`)}
              className="flex-1 px-4 py-3 rounded-full font-medium text-sm transition-all shadow-lg hover:shadow-primary-400/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 border-2 border-primary-500 text-primary-500 bg-white hover:bg-primary-500 hover:text-white hover:border-primary-500 no-underline"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/booking"
              className="flex-1 px-4 py-3 rounded-full font-medium text-sm text-white bg-secondary-900 transition-all shadow-lg hover:shadow-primary-400/50 hover:-translate-y-0.5 flex items-center justify-center hover:bg-secondary-800"
              style={{ textDecoration: 'none' }}
            >
              Book Session
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TherapiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-6">
              Our Therapeutic Approaches
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6 leading-tight">
              Evidence-Based Therapies for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                Healing Journey
              </span>
            </h1>
            <p className="text-lg text-secondary-600 leading-relaxed max-w-3xl mx-auto">
              At MindSettler, we use a range of proven therapeutic approaches, carefully selected and adapted 
              to meet your individual needs. Each therapy offers unique tools for understanding yourself 
              and creating lasting change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Therapies Grid */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {THERAPIES.map((therapy, index) => (
              <TherapyCard key={therapy.id} therapy={therapy} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-[2rem] p-12 lg:p-16 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                  Not Sure Which Approach is Right for You?
                </h2>
                <p className="text-secondary-300 text-lg mb-8 max-w-2xl mx-auto">
                  That's completely okay. During your first session, we'll explore your needs together 
                  and find the therapeutic approach that resonates with you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/booking"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
                  >
                    Book a Session
                  </a>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
                  >
                    Chat With Us
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 lg:p-10 border border-primary-100"
            >
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">How We Work</h3>
              <div className="space-y-4 text-secondary-600">
                <p>
                  Our approach is integrative – meaning we don't rigidly stick to one model. Instead, we draw 
                  from various evidence-based therapies to create a personalized experience that works for you.
                </p>
                <p>
                  Each session is a collaborative space where you set the pace. Whether you're dealing with 
                  anxiety, navigating relationships, processing past experiences, or simply seeking clarity, 
                  we meet you where you are.
                </p>
                <p className="font-medium text-secondary-800">
                  Remember: Choosing to seek support is a sign of strength, not weakness. You don't have to 
                  have everything figured out before reaching out.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
