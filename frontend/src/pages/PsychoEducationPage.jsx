import { useInView } from '../hooks/useInView'

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
        <div className="three-column">
          <div className="card">
            <h3>Awareness</h3>
            <p>
              Naming what you are experiencing – emotionally, mentally, and physically – without judgement.
            </p>
          </div>
          <div className="card">
            <h3>Understanding</h3>
            <p>
              Connecting your patterns to your history, context, and current life stage using simple, robust
              psychological ideas.
            </p>
          </div>
          <div className="card">
            <h3>Navigation</h3>
            <p>
              Co-creating small, realistic steps that move you from surviving to living with a little more ease.
            </p>
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
