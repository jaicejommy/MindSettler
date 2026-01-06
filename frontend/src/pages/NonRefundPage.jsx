export default function NonRefundPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: '6rem' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>Non-Refund Policy</h2>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius-lg)' }}>
          <p>
            This Non-Refund Policy outlines the terms and conditions regarding refunds for sessions booked with
            MindSettler. Please read this policy carefully before booking a session.
          </p>

          <h3>1. General Policy</h3>
          <p>
            Once a session has been booked and confirmed, the payment is non-refundable. This policy applies to all
            session bookings, whether online or offline.
          </p>

          <h3>2. Cancellation by Client</h3>
          <p>
            If you need to cancel your session, please do so at least <strong>48 hours before</strong> the scheduled
            appointment. While cancellations are non-refundable, you may request to reschedule your session to another
            available date and time at no additional cost.
          </p>
          <p>
            Cancellations made less than 48 hours before the scheduled appointment may not be eligible for
            rescheduling without additional charges.
          </p>

          <h3>3. Cancellation by MindSettler</h3>
          <p>
            In the rare event that MindSettler needs to cancel a session due to unforeseen circumstances, we will
            provide advance notice where possible and offer you the option to:
          </p>
          <ul className="bullet-list">
            <li>Reschedule to another available date and time</li>
            <li>Receive a full refund if rescheduling is not possible</li>
          </ul>

          <h3>4. No-Show Policy</h3>
          <p>
            If you fail to show up for your scheduled session without prior notice, the session will be considered
            completed, and no refund or rescheduling will be provided. We encourage you to provide advance notice if
            you are unable to attend.
          </p>

          <h3>5. Technical Issues</h3>
          <p>
            In the event of technical difficulties during an online session, MindSettler will make reasonable efforts
            to reconnect. If the session cannot be completed due to technical issues on our end, we will offer you the
            option to reschedule at no additional cost.
          </p>

          <h3>6. Medical or Emergency Situations</h3>
          <p>
            If you need to cancel due to a genuine medical emergency or unforeseen circumstance, please contact us as
            soon as possible. We will review your request on a case-by-case basis and may consider alternatives such
            as rescheduling or partial credits.
          </p>

          <h3>7. Payment Methods</h3>
          <p>
            We accept UPI and cash payments. In cases where refunds are approved, refunds for UPI payments will be
            processed to the original UPI ID. Cash payments, where applicable, may be adjusted via rescheduling or
            session credits instead of direct cash refunds.
          </p>

          <h3>8. Corporate Bookings</h3>
          <p>
            Special terms may apply for corporate bookings. Please contact us directly to discuss refund policies for
            group sessions or workshops.
          </p>

          <h3>9. Dispute Resolution</h3>
          <p>
            If you have concerns about a charge or believe an exception should be made to this policy, please contact
            us to discuss your situation. We will do our best to find a fair resolution.
          </p>

          <h3>10. Changes to This Policy</h3>
          <p>
            MindSettler reserves the right to modify this Non-Refund Policy at any time. Changes will be effective
            immediately upon posting to our website. Continued booking of sessions constitutes acceptance of the
            updated policy.
          </p>

          <h3>11. Contact Us</h3>
          <p>
            If you have questions about this Non-Refund Policy, please reach out to us at:
          </p>
          <ul className="bullet-list">
            <li>Email: support@mindsettler.in</li>
            <li>
              Instagram:{' '}
              <a href="https://www.instagram.com/mindsettlerbypb/" target="_blank" rel="noreferrer">
                @mindsettlerbypb
              </a>
            </li>
          </ul>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            <em>Last updated: January 2026</em>
          </p>
        </div>
      </section>
    </main>
  )
}
