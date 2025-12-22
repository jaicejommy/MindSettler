export default function AboutPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: '6rem' }}>
        <div className="section-header">
          <p className="eyebrow">About MindSettler</p>
          <h2>A psycho-education studio for everyday life</h2>
        </div>
        <div className="two-column">
          <div className="card">
            <h3>Why MindSettler exists</h3>
            <p>
              Many of us sense that something inside is unsettled – but we do not always have the language to
              describe it. MindSettler exists to make mental health understandable, relatable, and workable.
            </p>
            <p>
              Through structured conversations and simple frameworks, we help you see your patterns more clearly
              so that you can make gentler, more intentional choices.
            </p>
          </div>
          <div className="card">
            <h3>How we work</h3>
            <ul className="bullet-list">
              <li>60-minute one-on-one or small group sessions</li>
              <li>Blend of conversation, reflection, and psycho-education</li>
              <li>Online or at a calm, contained physical studio</li>
              <li>Clear boundaries around confidentiality and ethics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
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

      <section className="section">
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
    </main>
  )
}
