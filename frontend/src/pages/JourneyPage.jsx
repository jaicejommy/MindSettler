export default function JourneyPage() {
  return (
    <main>
      <section className="section section-alt journey-section" style={{ paddingTop: '6rem' }}>
        <div className="section-header">
          <p className="eyebrow">Your journey with MindSettler</p>
          <h2>From foggy to a little more clear</h2>
        </div>
        <div className="journey-visual">
          <div className="journey-stage">
            <h3>Valley of overwhelm</h3>
            <p>
              Things feel heavy, scattered, or confusing. You know something needs attention, but you are not
              sure where to begin.
            </p>
          </div>
          <div className="journey-stage">
            <h3>Bridge of understanding</h3>
            <p>
              Through conversations and psycho-education, you begin to see patterns and name what is going on.
            </p>
          </div>
          <div className="journey-stage">
            <h3>Path of practice</h3>
            <p>
              You experiment with small shifts, practices, and boundaries that support your mental well-being.
            </p>
          </div>
          <div className="journey-stage">
            <h3>Plateau of integration</h3>
            <p>
              You carry a clearer understanding of yourself and practical tools into your everyday life.
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
