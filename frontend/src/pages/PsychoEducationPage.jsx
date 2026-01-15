import { useInView } from '../hooks/useInView'
import NeuralNetwork from '../components/NeuralNetwork'

export default function PsychoEducationPage() {
  const [cardRef1, cardInView1] = useInView()
  const [cardRef2, cardInView2] = useInView()

  return (
    <main>
      <section className="section section-alt" style={{ paddingTop: '6rem' }}>
        <div className="section-header">
          <p className="eyebrow">Psycho-education</p>
          <h2>Mental health, in language you can actually use</h2>
          <p className="section-subtitle">
            Instead of diagnosing you from a distance, MindSettler walks with you – helping you understand what
            stress, anxiety, burnout, or emotional overwhelm look like in your own life.
          </p>
        </div>

        {/* Neural Network Feature Section */}
        <div className="neural-feature-section">
          {/* Top Row */}
          <div className="neural-feature-row neural-feature-top">
            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v16m-8-8h16" />
                </svg>
              </div>
              <h3>5-Minute Exercises</h3>
              <p>Quick techniques you can use anywhere</p>
            </div>
            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
              </div>
              <h3>Evidence-Based</h3>
              <p>CBT, DBT, mindfulness techniques</p>
            </div>
          </div>

          {/* Middle Row with Neural Network */}
          <div className="neural-feature-row neural-feature-middle">
            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <h3>Real-Life Focus</h3>
              <p>Tools for your daily challenges</p>
            </div>

            <div className="neural-network-wrapper">
              <NeuralNetwork />
            </div>

            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="7" r="4" />
                  <circle cx="17" cy="17" r="4" />
                  <path d="M9 11v4a2 2 0 002 2h4" />
                </svg>
              </div>
              <h3>Personalized Path</h3>
              <p>Adapted to your unique needs</p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="neural-feature-row neural-feature-bottom">
            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3>Compassionate Care</h3>
              <p>Judgment-free support space</p>
            </div>
            <div className="neural-feature-card">
              <div className="neural-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <h3>Progress Tracking</h3>
              <p>See your growth over time</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section section-alt ${cardRef1 ? 'in-view' : ''}`} ref={cardRef1}>
        <div className="section-header">
          <p className="eyebrow">Psycho-education</p>
          <h2>Resources to begin your journey</h2>
          <p className="section-subtitle">
            Simple, human explanations that help you name what you are feeling, without overwhelming jargon.
          </p>
        </div>
        <div className="resources-grid">
          <article className="card resource-card">
            <p className="eyebrow">Article</p>
            <h3>Stress vs. burnout: what is the difference?</h3>
            <p>
              Why feeling tired is not the same as being emotionally exhausted, and how to notice early warning
              signs.
            </p>
          </article>
          <article className="card resource-card">
            <p className="eyebrow">Article</p>
            <h3>Emotional hygiene for everyday life</h3>
            <p>
              Small, doable practices that help you check in with yourself before things start to feel too heavy.
            </p>
          </article>
          <article className="card resource-card">
            <p className="eyebrow">Reflection prompt</p>
            <h3>Where do I feel it in my body?</h3>
            <p>
              A short, guided prompt that connects physical sensations with emotional patterns.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
