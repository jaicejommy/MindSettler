export default function FAQsPage() {
  const faqs = [
    {
      q: 'Is MindSettler a replacement for therapy or psychiatry?',
      a: 'No. MindSettler is a psycho-education and mental well-being space. It can sit alongside therapy or medical care, but does not replace them.',
    },
    {
      q: 'What exactly happens in the sessions?',
      a: 'Sessions combine reflective conversations, simple frameworks, and guided exercises that help you understand your patterns and make sense of your experiences.',
    },
    {
      q: 'Is everything I share confidential?',
      a: 'Yes, within clear ethical boundaries. Your information is kept confidential except where there is risk of harm to you or someone else. The confidentiality policy is shared before your first session.',
    },
    {
      q: 'How do I pay for sessions?',
      a: 'Once your slot is confirmed, you will receive UPI details. Offline sessions can also be paid for in cash at the studio.',
    },
    {
      q: 'Can I cancel or reschedule?',
      a: 'Cancellations and rescheduling are possible within the boundaries mentioned in the non-refund and rescheduling policy shared at the time of booking.',
    },
  ]

  return (
    <main>
      <section className="section" style={{ paddingTop: '6rem' }}>
        <div className="section-header">
          <p className="eyebrow">Questions you might have</p>
          <h2>FAQs</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
