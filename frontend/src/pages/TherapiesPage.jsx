import { motion } from 'framer-motion'
import { Brain, Heart, Users, Sparkles, Shield, Target, Compass, Zap } from 'lucide-react'

const THERAPIES = [
  {
    id: 'cbt',
    name: 'Cognitive Behavioural Therapy (CBT)',
    shortName: 'CBT',
    icon: Brain,
    color: 'primary',
    description: 'CBT helps you identify and change negative thought patterns that affect your emotions and behaviors.',
    benefits: [
      'Challenge unhelpful thinking patterns',
      'Develop practical coping strategies',
      'Break cycles of anxiety and depression',
      'Build problem-solving skills'
    ],
    bestFor: 'Anxiety, depression, phobias, stress management, and building resilience.',
  },
  {
    id: 'dbt',
    name: 'Dialectical Behavioural Therapy (DBT)',
    shortName: 'DBT',
    icon: Heart,
    color: 'rose',
    description: 'DBT combines cognitive-behavioral techniques with mindfulness to help you manage intense emotions.',
    benefits: [
      'Regulate intense emotions',
      'Improve interpersonal relationships',
      'Develop distress tolerance skills',
      'Practice mindfulness techniques'
    ],
    bestFor: 'Emotional dysregulation, borderline personality traits, self-harm urges, and relationship difficulties.',
  },
  {
    id: 'act',
    name: 'Acceptance & Commitment Therapy (ACT)',
    shortName: 'ACT',
    icon: Compass,
    color: 'emerald',
    description: 'ACT helps you accept difficult thoughts and feelings while committing to actions aligned with your values.',
    benefits: [
      'Increase psychological flexibility',
      'Clarify personal values',
      'Reduce struggle with difficult emotions',
      'Take meaningful action despite challenges'
    ],
    bestFor: 'Chronic pain, anxiety, depression, and finding purpose and meaning in life.',
  },
  {
    id: 'schema',
    name: 'Schema Therapy',
    shortName: 'Schema',
    icon: Target,
    color: 'amber',
    description: 'Schema therapy addresses deep-rooted patterns developed in childhood that continue to affect adult life.',
    benefits: [
      'Understand lifelong patterns',
      'Heal emotional wounds from childhood',
      'Develop healthier coping modes',
      'Build a stronger sense of self'
    ],
    bestFor: 'Long-standing emotional issues, personality patterns, chronic relationship problems, and childhood trauma effects.',
  },
  {
    id: 'eft',
    name: 'Emotion-Focused Therapy (EFT)',
    shortName: 'EFT',
    icon: Sparkles,
    color: 'violet',
    description: 'EFT helps you become more aware of your emotions, understand them, and use them as a guide for change.',
    benefits: [
      'Access and process core emotions',
      'Transform painful emotional experiences',
      'Develop emotional intelligence',
      'Create new emotional responses'
    ],
    bestFor: 'Depression, trauma, emotional blocks, and difficulty expressing or understanding emotions.',
  },
  {
    id: 'efct',
    name: 'Emotion-Focused Couples Therapy',
    shortName: 'EFCT',
    icon: Users,
    color: 'pink',
    description: 'EFCT helps couples understand and reshape their emotional responses to create stronger, more secure bonds.',
    benefits: [
      'Improve emotional connection',
      'Break negative interaction cycles',
      'Build secure attachment',
      'Enhance communication patterns'
    ],
    bestFor: 'Couples experiencing disconnection, conflict, communication issues, or wanting to deepen their bond.',
  },
  {
    id: 'mbct',
    name: 'Mindfulness-Based Cognitive Therapy',
    shortName: 'MBCT',
    icon: Zap,
    color: 'teal',
    description: 'MBCT combines mindfulness practices with cognitive therapy to prevent relapse and manage ongoing mental health.',
    benefits: [
      'Develop present-moment awareness',
      'Recognize early warning signs',
      'Break rumination cycles',
      'Cultivate self-compassion'
    ],
    bestFor: 'Preventing depression relapse, chronic anxiety, stress reduction, and building long-term mental wellness.',
  },
  {
    id: 'cct',
    name: 'Client-Centred Therapy',
    shortName: 'CCT',
    icon: Shield,
    color: 'indigo',
    description: 'A supportive approach where the therapist provides unconditional positive regard, helping you explore your feelings at your own pace.',
    benefits: [
      'Feel truly heard and accepted',
      'Explore feelings safely',
      'Develop self-understanding',
      'Build self-acceptance'
    ],
    bestFor: 'Anyone seeking a supportive space to explore their thoughts and feelings without judgment.',
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
    border: 'border-primary-200',
    gradient: 'from-primary-500 to-primary-600',
    dot: 'bg-primary-500',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    border: 'border-rose-200',
    gradient: 'from-rose-500 to-rose-600',
    dot: 'bg-rose-500',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
    dot: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
    dot: 'bg-amber-500',
  },
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    border: 'border-violet-200',
    gradient: 'from-violet-500 to-violet-600',
    dot: 'bg-violet-500',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    border: 'border-pink-200',
    gradient: 'from-pink-500 to-pink-600',
    dot: 'bg-pink-500',
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    border: 'border-teal-200',
    gradient: 'from-teal-500 to-teal-600',
    dot: 'bg-teal-500',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    gradient: 'from-indigo-500 to-indigo-600',
    dot: 'bg-indigo-500',
  },
}

function TherapyCard({ therapy, index }) {
  const Icon = therapy.icon
  const colors = colorClasses[therapy.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className={`bg-white rounded-3xl p-8 h-full border ${colors.border} hover:shadow-xl hover:shadow-secondary-900/5 transition-all duration-500 hover:-translate-y-1`}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{therapy.shortName}</span>
            <h3 className="text-xl font-bold text-secondary-900 leading-tight">{therapy.name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary-600 mb-6 leading-relaxed">{therapy.description}</p>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          {therapy.benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 ${colors.dot} rounded-full mt-2 flex-shrink-0`}></div>
              <span className="text-secondary-700 text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Best For */}
        <div className={`${colors.bg} rounded-xl p-4`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-1">Best For</p>
          <p className={`text-sm ${colors.text} font-medium`}>{therapy.bestFor}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TherapiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6 leading-tight">
              Evidence-Based Therapies for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                Unique Journey
              </span>
            </h1>
            <p className="text-xl text-secondary-600 leading-relaxed max-w-3xl mx-auto">
              At MindSettler, we use a range of proven therapeutic approaches, carefully selected and adapted 
              to meet your individual needs. Each therapy offers unique tools for understanding yourself 
              and creating lasting change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Therapies Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
