import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react'

const THERAPY_ARTICLES = {
  cbt: {
    name: 'Cognitive Behavioural Therapy (CBT)',
    shortName: 'CBT',
    image: '/CBT.png',
    color: '#3B82F6',
    readTime: '8 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Cognitive Behavioural Therapy, or CBT, is one of the most researched and effective forms of psychotherapy. It works on the principle that our thoughts, feelings, and behaviors are interconnected, and by changing our thought patterns, we can positively impact our emotions and actions.',
    sections: [
      {
        title: 'What is CBT?',
        content: 'CBT is a form of talking therapy that focuses on how your thoughts, beliefs, and attitudes affect your feelings and behavior. It is primarily focused on your current problems and finding practical solutions.'
      },
      {
        title: 'How Does CBT Work?',
        content: 'CBT works through a collaborative process between you and your therapist. You will learn to identify negative thought patterns, challenge them, and replace them with more balanced perspectives.'
      },
      {
        title: 'Key Benefits',
        content: 'Practical and goal-focused: You will work toward specific, measurable goals. Time-limited: CBT is typically 12-20 sessions. Evidence-based: Extensive research supports its effectiveness. Empowering: You learn skills you can use independently after therapy ends.'
      }
    ],
    conclusion: 'Cognitive Behavioural Therapy is a powerful approach to improving mental health and well-being. If you are struggling with anxiety, depression, or other challenges, CBT offers evidence-based techniques that can help you think differently, feel better, and live more fully.'
  },
  dbt: {
    name: 'Dialectical Behavioural Therapy (DBT)',
    shortName: 'DBT',
    image: '/DBT.png',
    color: '#8B5CF6',
    readTime: '9 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Dialectical Behaviour Therapy, or DBT, is a specialized form of therapy designed to help people who experience intense emotions, struggle with self-harm, or have difficulty managing relationships. DBT has proven effective for many conditions.',
    sections: [
      {
        title: 'What is DBT?',
        content: 'DBT combines elements of CBT with concepts from dialectics and Zen Buddhism. DBT teaches that while you should accept yourself as you are right now, you also have the capacity and responsibility to change.'
      },
      {
        title: 'The Four Pillars',
        content: 'Individual Therapy: One-on-one sessions with your DBT therapist. Skills Training: Group sessions where you learn practical skills. Phone Coaching: Brief calls with your therapist between sessions. Therapist Consultation Team: Your therapist meets with colleagues to discuss cases.'
      },
      {
        title: 'Who Benefits?',
        content: 'DBT is effective for self-harm, suicidal thoughts, intense emotions, relationship difficulties, anger management, eating disorders, substance use, PTSD, depression and anxiety. DBT is particularly helpful for anyone struggling with emotional intensity and behavioral patterns that feel out of control.'
      }
    ],
    conclusion: 'If you have struggled with intense emotions or relationship difficulties, DBT offers a comprehensive, evidence-based approach that has helped thousands of people build a life worth living.'
  },
  act: {
    name: 'Acceptance & Commitment Therapy (ACT)',
    shortName: 'ACT',
    image: '/ACT.png',
    color: '#F59E0B',
    readTime: '7 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Acceptance & Commitment Therapy (ACT) is a powerful approach that helps you live a meaningful life by accepting what you cannot control and committing to what matters most to you. ACT teaches you to change your relationship with difficult thoughts and feelings.',
    sections: [
      {
        title: 'Core Principles',
        content: 'ACT is built on six core processes: Acceptance, Cognitive Defusion, Being Present, Self as Context, Values, and Committed Action. Together these help you live according to your deepest values.'
      },
      {
        title: 'Focus on Values',
        content: 'A central part of ACT is identifying your personal values. This might include family, career, health, creativity, spirituality, adventure, or helping others. Once you clarify your values, ACT helps you take committed action toward them.'
      },
      {
        title: 'What ACT Helps With',
        content: 'ACT is effective for anxiety, worry, depression, chronic pain, PTSD, trauma, perfectionism, relationship issues, work stress, health anxiety, addictions, and life transitions. ACT helps with any situation where you are struggling to live the life you want.'
      }
    ],
    conclusion: 'Acceptance & Commitment Therapy offers a refreshing perspective on mental health. By helping you live a meaningful life despite challenges that come with being human, ACT supports lasting change.'
  },
  schema: {
    name: 'Schema Therapy',
    shortName: 'Schema',
    image: '/ST.png',
    color: '#14B8A6',
    readTime: '10 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Schema Therapy is a powerful approach for addressing deep-rooted patterns and beliefs that developed early in life. It combines elements of CBT, psychodynamic therapy, attachment theory, and emotion-focused therapy to create lasting change.',
    sections: [
      {
        title: 'What Are Schemas?',
        content: 'Schemas are deeply ingrained patterns of thinking, feeling, and behaving that develop in childhood and continue to influence us into adulthood. They are formed based on early experiences with parents, peers, and life events.'
      },
      {
        title: 'How Schemas Affect You',
        content: 'When a schema is triggered, you experience strong emotions and automatically respond in certain ways. This might involve avoiding situations, overcompensating, surrendering to the schema, or unhealthy relationships and patterns. These automatic patterns can lead to relationship difficulties, self-sabotage, anxiety, and depression.'
      },
      {
        title: 'Schema Therapy Process',
        content: 'Schema therapy involves three components: Schema Assessment, Understanding Origin, and Schema Change. The therapeutic relationship is important as your therapist provides emotional nourishment that may have been missing in childhood.'
      }
    ],
    conclusion: 'If you have spent years in therapy but feel like you are repeating the same patterns, Schema Therapy might be exactly what you need. By addressing the roots of your patterns rather than just the symptoms, you can create lasting change.'
  },
  eft: {
    name: 'Emotion-Focused Therapy (EFT)',
    shortName: 'EFT',
    image: '/EFT.png',
    color: '#EC4899',
    readTime: '8 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Emotion-Focused Therapy (EFT) recognizes emotions as central to our well-being and helps you understand, experience, and transform your emotional life. Rather than managing or controlling emotions, EFT helps you work with them as sources of wisdom.',
    sections: [
      {
        title: 'The Role of Emotions',
        content: 'EFT is based on the understanding that emotions are not problems to be solved. They are sources of information and wisdom. Your emotions tell you what matters, what you need, and what is important for your well-being.'
      },
      {
        title: 'Primary vs Secondary Emotions',
        content: 'Primary emotions are your genuine, initial emotional response to a situation. Secondary emotions are reactions to your primary emotions. EFT helps you identify and work with your primary emotions, which leads to greater authenticity and effectiveness.'
      },
      {
        title: 'EFT for Relationships',
        content: 'While EFT can be used in individual therapy, it is particularly powerful for relationships. Emotionally Focused Couples Therapy helps partners understand each other emotional needs and create emotional safety and security.'
      }
    ],
    conclusion: 'Emotion-Focused Therapy offers a compassionate, effective path to greater emotional well-being and more authentic relationships. By honoring your emotions and learning to work with them, you can access deeper wisdom about yourself.'
  },
  efct: {
    name: 'Emotion-Focused Couples Therapy (EFCT)',
    shortName: 'Couples',
    image: '/EFCT.png',
    color: '#10B981',
    readTime: '9 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Emotion-Focused Couples Therapy (EFCT) is a highly effective approach for couples struggling with disconnection, conflict, or hurt. It helps partners understand each other emotional needs and rebuild secure, intimate bonds.',
    sections: [
      {
        title: 'What is EFCT?',
        content: 'EFCT recognizes that at the heart of relationship problems is emotional disconnection. Partners often get caught in negative cycles that push them further apart. EFCT helps couples break these cycles by focusing on underlying emotions and needs.'
      },
      {
        title: 'The Pursue-Withdraw Pattern',
        content: 'One partner pursues while the other withdraws. The pursuer experiences rejection and pushes harder. The withdrawer feels overwhelmed and pulls back. EFCT helps both partners understand what is actually happening beneath the conflict.'
      },
      {
        title: 'The EFCT Process',
        content: 'EFCT typically involves three phases: De-escalation, Restructuring, and Consolidation. The process usually takes 10-20 sessions. Research shows 70-75% of couples who complete EFCT move from distressed to stable or happy relationships.'
      }
    ],
    conclusion: 'If your relationship feels disconnected, conflicted, or broken, EFCT offers hope and practical tools to rebuild emotional intimacy and security. EFCT can help you create the emotionally secure partnership you both deserve.'
  },
  mbct: {
    name: 'Mindfulness-Based Cognitive Therapy (MBCT)',
    shortName: 'MBCT',
    image: '/MBCT.png',
    color: '#6366F1',
    readTime: '8 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Mindfulness-Based Cognitive Therapy (MBCT) combines the practical strategies of CBT with the present-moment awareness of mindfulness. This powerful combination helps you break free from rumination and develop a fundamentally different relationship with your thoughts.',
    sections: [
      {
        title: 'CBT and Mindfulness Combined',
        content: 'MBCT brings together two powerful approaches. CBT teaches you to identify and challenge unhelpful thought patterns. Mindfulness teaches you to observe thoughts without judgment or reaction. Together these give you both tools to change unhelpful thinking AND ability to step back and observe thoughts as just thoughts.'
      },
      {
        title: 'Mindfulness Practices',
        content: 'MBCT teaches Body Scan Meditation, Sitting Meditation, Mindful Movement, and Informal Practice. These practices train your brain to focus on the present moment rather than getting caught in repetitive thoughts.'
      },
      {
        title: 'How Thoughts Work',
        content: 'MBCT teaches that thoughts are not facts. The problem is not having negative thoughts, but believing them and acting on them. Through mindfulness, you learn to notice thoughts arising without getting caught in them.'
      }
    ],
    conclusion: 'Mindfulness-Based Cognitive Therapy offers a transformative approach to breaking free from rumination and building lasting resilience. By combining the best of CBT with the wisdom of mindfulness, MBCT helps you live more fully in the present moment.'
  },
  cct: {
    name: 'Client-Centred Therapy',
    shortName: 'CCT',
    image: '/CCT.png',
    color: '#F43F5E',
    readTime: '7 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'Client-Centred Therapy, also known as Person-Centred Therapy, is a humanistic approach that trusts in your inherent capacity for growth and self-direction. Your therapist provides conditions for you to find your own answers.',
    sections: [
      {
        title: 'Core Principles',
        content: 'Client-centred therapy is based on the belief that you have within you the resources to understand yourself and resolve your difficulties. Your therapist provides three core conditions: Unconditional Positive Regard, Empathy, and Congruence.'
      },
      {
        title: 'How It Works',
        content: 'In client-centred therapy, you lead the conversation. You decide what to talk about at your own pace. Your therapist listens deeply, reflects back what they hear, and helps you explore your experience more fully.'
      },
      {
        title: 'Self-Actualization',
        content: 'Client-centred therapy is based on the concept that all organisms have an innate drive toward growth. When you are in an environment of acceptance and understanding, this natural drive toward growth emerges and you move toward greater authenticity and meaning.'
      }
    ],
    conclusion: 'If you are looking for a therapeutic approach that trusts in your inherent wisdom and capacity for growth, Client-Centred Therapy offers a warm, accepting space to explore yourself and your life.'
  },
  custom: {
    name: 'Custom Therapy Plan',
    shortName: 'Custom',
    image: '/Custom.png',
    color: '#84CC16',
    readTime: '8 min read',
    author: 'MindSettler Team',
    date: 'January 2024',
    introduction: 'At MindSettler, we believe that one size does not fit all. A Custom Therapy Plan combines elements from different therapeutic approaches, tailored specifically to your unique needs, goals, and preferences.',
    sections: [
      {
        title: 'Why Personalized?',
        content: 'Everyone comes to therapy with different challenges, strengths, and preferences. A Custom Therapy Plan works with you to design an approach that addresses your specific challenges, builds on your strengths, fits your communication style, and respects your values.'
      },
      {
        title: 'How We Design It',
        content: 'In your initial sessions, your therapist will understand your background and challenges, assess what approaches might help, discuss your preferences, design an integrated plan, and refine it based on what you learn together.'
      },
      {
        title: 'Flexibility and Evolution',
        content: 'Your custom plan is not static. It evolves as you progress. Your therapist continuously assesses what is working well, where you are making progress, and what new challenges are emerging. This flexibility keeps your therapy responsive to your actual experience.'
      }
    ],
    conclusion: 'A Custom Therapy Plan recognizes that you are unique. By combining therapeutic approaches tailored to your situation, we create a plan that works for you. Let us work together to design the therapy that is right for you.'
  }
}

export default function TherapyArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const article = THERAPY_ARTICLES[id]

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate('/therapies')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600"
          >
            Back to Therapies
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="relative h-80 overflow-hidden"
        style={{ backgroundColor: `${article.color}15` }}
      >
        <div className="absolute inset-0 opacity-10">
          <img
            src={article.image}
            alt={article.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative h-full flex flex-col justify-between p-6 lg:p-12">
          <button
            onClick={() => navigate('/therapies')}
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Therapies
          </button>

          <div>
            <h1
              className="text-4xl lg:text-5xl font-display font-bold mb-6"
              style={{ color: article.color }}
            >
              {article.name}
            </h1>

            <div className="flex flex-wrap gap-6 text-secondary-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{article.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg text-secondary-700 leading-relaxed mb-12 pb-12 border-b border-secondary-200"
        >
          {article.introduction}
        </motion.div>

        {/* Sections */}
        {article.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2
              className="text-2xl lg:text-3xl font-bold mb-4"
              style={{ color: article.color }}
            >
              {section.title}
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-secondary-50 rounded-2xl p-8 border-l-4 mb-12"
          style={{ borderColor: article.color }}
        >
          <p className="text-secondary-700 leading-relaxed mb-6">
            {article.conclusion}
          </p>
        </motion.div>

        {/* Share and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-12 border-t border-secondary-200"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.name,
                  text: article.introduction,
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Article
          </button>

          <div className="flex gap-4">
            <a
              href="/booking"
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: article.color }}
            >
              Book a Session
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300"
              style={{
                borderColor: article.color,
                color: article.color,
                backgroundColor: `${article.color}10`
              }}
            >
              Ask a Question
            </button>
          </div>
        </motion.div>
      </article>

      {/* Related Articles */}
      <section className="bg-secondary-50/30 py-16 border-t border-secondary-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <h3 className="text-2xl font-bold text-secondary-900 mb-8">Explore Other Approaches</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(THERAPY_ARTICLES)
              .filter(([key]) => key !== id)
              .slice(0, 3)
              .map(([key, otherArticle]) => (
                <motion.button
                  key={key}
                  onClick={() => navigate(`/therapy/${key}`)}
                  whileHover={{ y: -4 }}
                  className="text-left p-6 bg-white rounded-xl border border-secondary-200 hover:border-secondary-300 transition-all"
                >
                  <h4 className="font-bold mb-2" style={{ color: otherArticle.color }}>
                    {otherArticle.name}
                  </h4>
                  <p className="text-sm text-secondary-600">{otherArticle.readTime}</p>
                </motion.button>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
