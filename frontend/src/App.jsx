import { useEffect, useMemo, useState } from 'react'
import './index.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const ADMIN_ACCESS_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'mindsettler-admin'

function useFadeInOnLoad() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [])
  return ready
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function BookingSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    mode: 'online',
    sessionType: 'individual',
    isFirstSession: true,
    date: '',
    time: '',
    notes: '',
  })
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchSlots() {
      if (!form.date) return
      try {
        setLoadingSlots(true)
        setError('')
        const res = await fetch(`${API_BASE_URL}/slots?date=${form.date}`)
        if (!res.ok) {
          throw new Error('Unable to load available slots')
        }
        const data = await res.json()
        setSlots(data.slots || [])
      } catch (e) {
        console.error(e)
        setError('Could not load available time slots. Please try again or contact us directly.')
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [form.date])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      setResult(data.booking)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to submit booking at the moment.')
    } finally {
      setSubmitting(false)
    }
  }

  const googleCalendarUrl = useMemo(() => {
    if (!result) return ''
    const startDateTime = `${result.date.replace(/-/g, '')}T${result.time.replace(':', '')}00`
    const end = new Date(`${result.date}T${result.time}:00`)
    end.setMinutes(end.getMinutes() + 60)
    const endIso = `${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, '0')}${String(
      end.getDate(),
    ).padStart(2, '0')}T${String(end.getHours()).padStart(2, '0')}${String(
      end.getMinutes(),
    ).padStart(2, '0')}00`

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'MindSettler Session',
      details:
        'MindSettler psycho-education and counselling session. This is not a crisis service. For emergencies, please contact your local emergency helpline.',
      location: result.mode === 'offline' ? 'MindSettler Studio' : 'Online (details from MindSettler)',
      dates: `${startDateTime}/${endIso}`,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }, [result])

  return (
    <section id="booking" className="section section-alt">
      <div className="section-header">
        <p className="eyebrow">Take your first step</p>
        <h2>Book a 60-minute MindSettler session</h2>
        <p className="section-subtitle">
          The first session is a gentle, structured conversation that helps us understand your story, your
          patterns, and where you feel stuck.
        </p>
      </div>

      <div className="booking-grid">
        <form className="card booking-form" onSubmit={handleSubmit}>
          <h3>Your details</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone (WhatsApp preferred)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3>Session preferences</h3>
          <div className="field-grid">
            <div className="field">
              <label>Mode</label>
              <div className="pill-group">
                <button
                  type="button"
                  className={form.mode === 'online' ? 'pill active' : 'pill'}
                  onClick={() => setForm((f) => ({ ...f, mode: 'online' }))}
                >
                  Online
                </button>
                <button
                  type="button"
                  className={form.mode === 'offline' ? 'pill active' : 'pill'}
                  onClick={() => setForm((f) => ({ ...f, mode: 'offline' }))}
                >
                  Offline Studio
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="sessionType">Session focus</label>
              <select
                id="sessionType"
                name="sessionType"
                value={form.sessionType}
                onChange={handleChange}
              >
                <option value="individual">Individual psycho-education</option>
                <option value="relationship">Relationships & family</option>
                <option value="career">Career & performance</option>
                <option value="stress">Stress, burnout & anxiety</option>
              </select>
            </div>

            <div className="field field-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isFirstSession"
                  checked={form.isFirstSession}
                  onChange={handleChange}
                />
                This is my first session with MindSettler
              </label>
            </div>
          </div>

          <h3>Pick a slot</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="date">Preferred date *</label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, date: e.target.value, time: '' }))
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="time">Available time slots *</label>
              <select
                id="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                disabled={!form.date || loadingSlots}
              >
                <option value="">
                  {form.date ? (loadingSlots ? 'Loading slots…' : 'Select a slot') : 'Choose a date first'}
                </option>
                {slots
                  .filter((s) => s.isAvailable)
                  .map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Anything you would like us to know before we meet?</label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional. You can also share this during the first session."
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {result && (
            <div className="form-success">
              <p>
                Your request has been received. Your appointment is currently <strong>{result.status}</strong>.
                MindSettler will confirm your slot over email/WhatsApp.
              </p>
              {googleCalendarUrl && (
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-link"
                >
                  Add to Google Calendar
                </a>
              )}
            </div>
          )}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Sending your request…' : 'Request session'}
          </button>
          <p className="fine-print">
            MindSettler is <strong>not</strong> a crisis or emergency service. If you are in immediate danger,
            please contact your local emergency helpline.
          </p>
        </form>

        <div className="card booking-highlight">
          <p className="eyebrow">What happens in the first session?</p>
          <h3>A gentle, structured 60-minute conversation</h3>
          <ul className="checklist">
            <li>Understanding your story, context, and current challenges</li>
            <li>Mapping patterns in thoughts, emotions, and behaviours</li>
            <li>Psycho-education on what you might be experiencing</li>
            <li>Clarifying expectations and boundaries of the work</li>
            <li>Designing a personalised journey for the next few sessions</li>
          </ul>
          <div className="info-pill">
            <p>
              Payment is currently via UPI or cash only. You will receive payment details along with your
              confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function AdminPanel() {
  const [accessCode, setAccessCode] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE_URL}/bookings`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Unable to load bookings')
      }
      setBookings(data.bookings || [])
    } catch (e) {
      console.error(e)
      setError(e.message || 'Unable to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (accessCode === ADMIN_ACCESS_CODE) {
      setAuthenticated(true)
      loadBookings()
    } else {
      setError('Invalid access code')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id)
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Unable to update status')
      }
      setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)))
    } catch (e) {
      console.error(e)
      setError(e.message || 'Unable to update status')
    } finally {
      setUpdatingId('')
    }
  }

  if (!authenticated) {
    return (
      <section id="admin" className="section">
        <div className="section-header">
          <p className="eyebrow">For MindSettler only</p>
          <h2>Admin access</h2>
          <p className="section-subtitle">
            Simple panel to view, confirm, or reject appointment requests. This is intentionally lightweight
            and kept separate from the client experience.
          </p>
        </div>
        <form className="card admin-login" onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="accessCode">Access code</label>
            <input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="primary-btn">
            Enter admin panel
          </button>
        </form>
      </section>
    )
  }

  return (
    <section id="admin" className="section section-alt">
      <div className="section-header">
        <p className="eyebrow">Admin</p>
        <h2>Appointments overview</h2>
        <p className="section-subtitle">
          View all requested sessions and update their status. Slots are automatically marked as unavailable
          when pending or confirmed.
        </p>
      </div>
      <div className="card admin-table-wrapper">
        {loading ? (
          <p>Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                  <th>First session</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.name}</strong>
                      <br />
                      <span className="muted">{b.sessionType}</span>
                    </td>
                    <td>
                      <div>{b.email}</div>
                      {b.phone && <div className="muted">{b.phone}</div>}
                    </td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.mode}</td>
                    <td>{b.isFirstSession ? 'Yes' : 'No'}</td>
                    <td>
                      <span className={`status-pill status-${b.status}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="pill small"
                          disabled={updatingId === b.id}
                          onClick={() => updateStatus(b.id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="pill small pill-outline"
                          disabled={updatingId === b.id}
                          onClick={() => updateStatus(b.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && <p className="form-error mt-16">{error}</p>}
        <button type="button" className="secondary-btn mt-16" onClick={loadBookings}>
          Refresh list
        </button>
      </div>
    </section>
  )
}

function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredChannel: 'email',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setDone(false)
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Unable to send message')
      setDone(true)
      setForm({ name: '', email: '', phone: '', preferredChannel: 'email', message: '' })
    } catch (e) {
      console.error(e)
      setError(e.message || 'Unable to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className="section-header">
        <p className="eyebrow">Still unsure?</p>
        <h2>Reach out and we will guide you</h2>
        <p className="section-subtitle">
          If you are not sure whether MindSettler is right for you, send us a short note. We will respond with
          clarity – not pressure.
        </p>
      </div>
      <div className="contact-grid">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="c-name">Name *</label>
              <input
                id="c-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email *</label>
              <input
                id="c-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="c-phone">Phone (optional)</label>
              <input
                id="c-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="preferredChannel">Preferred way to reach you</label>
            <select
              id="preferredChannel"
              name="preferredChannel"
              value={form.preferredChannel}
              onChange={handleChange}
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Phone call</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="c-message">Message *</label>
            <textarea
              id="c-message"
              name="message"
              rows={4}
              required
              value={form.message}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {done && <p className="form-success">Thank you for writing in. We will get back to you soon.</p>}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>

        <div className="card contact-info">
          <h3>Practical details</h3>
          <ul className="bullet-list">
            <li>Session duration: 60 minutes</li>
            <li>Format: Online (video) or offline at the MindSettler Studio</li>
            <li>Languages: English and Hindi (you can specify preference while booking)</li>
            <li>Payment: UPI or cash, shared after confirmation</li>
          </ul>
          <p className="muted">Exact address and online meeting link are shared after confirmation.</p>
        </div>
      </div>
    </section>
  )
}

function CorporateSection() {
  const [form, setForm] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    groupSize: '',
    requirements: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setDone(false)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/corporate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Unable to submit request')
      setDone(true)
      setForm({
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        groupSize: '',
        requirements: '',
      })
    } catch (e) {
      console.error(e)
      setError(e.message || 'Unable to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="corporate" className="section section-alt">
      <div className="section-header">
        <p className="eyebrow">For organisations</p>
        <h2>Workshops and mental health programs for teams</h2>
        <p className="section-subtitle">
          MindSettler designs experiential workshops and ongoing psycho-education spaces for companies,
          startups, colleges, and communities.
        </p>
      </div>
      <div className="corporate-grid">
        <div className="card">
          <h3>Common formats</h3>
          <ul className="bullet-list">
            <li>Interactive workshops on stress, burnout, and emotional hygiene</li>
            <li>Group spaces for teams navigating change, conflict, or burnout</li>
            <li>Longer journeys that combine psycho-education and reflective practice</li>
          </ul>
          <p className="muted">
            Every organisation and team is different. We begin with a conversation to understand your context and
            then design something that fits.
          </p>
        </div>
        <form className="card" onSubmit={handleSubmit}>
          <h3>Share what you are looking for</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="org-name">Organisation *</label>
              <input
                id="org-name"
                name="organizationName"
                type="text"
                required
                value={form.organizationName}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="contactPerson">Contact person *</label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                required
                value={form.contactPerson}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="corp-email">Email *</label>
              <input
                id="corp-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="corp-phone">Phone</label>
              <input
                id="corp-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="groupSize">Approximate group size</label>
              <input
                id="groupSize"
                name="groupSize"
                type="text"
                value={form.groupSize}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="requirements">Tell us a little about what you need *</label>
            <textarea
              id="requirements"
              name="requirements"
              rows={4}
              required
              value={form.requirements}
              onChange={handleChange}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          {done && (
            <p className="form-success">
              Thank you. We will write back to explore a suitable format for your organisation.
            </p>
          )}
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send request'}
          </button>
        </form>
      </div>
    </section>
  )
}

function FAQsSection() {
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
    <section id="faqs" className="section">
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
  )
}

function ResourcesSection() {
  return (
    <section id="resources" className="section section-alt">
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
  )
}

function PoliciesSection() {
  return (
    <section id="policies" className="section policies">
      <div className="policies-grid">
        <div className="policy-block">
          <h3>Privacy Policy</h3>
          <p>
            Your personal information and what you share in sessions are kept confidential and used only for the
            purpose of offering you services, as described in the detailed policy shared before your first
            session.
          </p>
        </div>
        <div className="policy-block">
          <h3>Non-Refund Policy</h3>
          <p>
            Sessions are held for you once confirmed. Cancellations, rescheduling, and refunds follow a clear
            policy that is shared at the time of booking.
          </p>
        </div>
        <div className="policy-block">
          <h3>Confidentiality Policy</h3>
          <p>
            Before your first session, you will review and agree to a confidentiality policy that explains what is
            held in confidence and the few exceptions related to safety.
          </p>
        </div>
      </div>
    </section>
  )
}

function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('intro')

  const restart = () => setStep('intro')

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="eyebrow">MindSettler guide</p>
              <h3>How can we help you today?</h3>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close chatbot"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-body">
            {step === 'intro' && (
              <>
                <p>
                  I am a simple guide that can help you understand MindSettler&apos;s services and how to book a
                  session.
                </p>
                <p className="muted">
                  I do <strong>not</strong> provide psychological advice or crisis support.
                </p>
                <div className="chatbot-options">
                  <button type="button" onClick={() => setStep('services')} className="pill">
                    Understand services
                  </button>
                  <button type="button" onClick={() => setStep('booking')} className="pill">
                    How to book a session
                  </button>
                  <button type="button" onClick={() => setStep('corporate')} className="pill">
                    Corporate / group enquiries
                  </button>
                </div>
              </>
            )}
            {step === 'services' && (
              <>
                <p>
                  MindSettler offers structured psycho-education sessions that help you understand your patterns,
                  emotions, and behaviours. It is not a substitute for therapy or psychiatry, but can complement
                  them.
                </p>
                <p>
                  If you have personal questions about your mental health, the best place to explore them is inside
                  a session with a trained professional.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => scrollToSection('booking')}
                >
                  Go to booking section
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
            {step === 'booking' && (
              <>
                <p>
                  You can request a 60-minute session by filling the booking form on this page. You will be able to
                  pick a date and see available time slots.
                </p>
                <p>
                  Your appointment is first marked as pending, and is then confirmed by MindSettler over
                  email/WhatsApp. Payment details are shared only after confirmation.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => scrollToSection('booking')}
                >
                  Open booking form
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
            {step === 'corporate' && (
              <>
                <p>
                  MindSettler partners with organisations for workshops, group spaces, and long-term mental
                  well-being journeys.
                </p>
                <p>
                  You can share your context and requirements in the corporate section. Someone from MindSettler
                  will write back to you.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => scrollToSection('corporate')}
                >
                  Go to corporate section
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
            {step === 'unsupported' && (
              <>
                <p>
                  I&apos;m here only to explain MindSettler&apos;s services and booking process.
                </p>
                <p>
                  For any personal, psychological, or crisis-related questions, please book a session or contact a
                  local emergency helpline.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={() => scrollToSection('booking')}
                >
                  Book a session
                </button>
                <button type="button" className="secondary-link" onClick={restart}>
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close guide' : 'Need guidance?'}
      </button>
    </div>
  )
}

export default function App() {
  const ready = useFadeInOnLoad()

  return (
    <div className={ready ? 'app-root app-ready' : 'app-root'}>
      <header className="top-nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => scrollToSection('top')}>
            <span className="brand-logo">MS</span>
            <span className="brand-text">
              <span className="brand-name">MindSettler</span>
              <span className="brand-tagline">Psycho-education &amp; mental well-being studio</span>
            </span>
          </div>
          <nav className="nav-links">
            <button type="button" onClick={() => scrollToSection('about')}>
              About
            </button>
            <button type="button" onClick={() => scrollToSection('psycho-education')}>
              Psycho-education
            </button>
            <button type="button" onClick={() => scrollToSection('journey')}>
              Journey
            </button>
            <button type="button" onClick={() => scrollToSection('booking')}>
              Book a session
            </button>
            <button type="button" onClick={() => scrollToSection('corporate')}>
              Corporate
            </button>
            <button type="button" onClick={() => scrollToSection('faqs')}>
              FAQs
            </button>
            <button type="button" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-text">
              <p className="eyebrow">Online psycho-education &amp; counselling</p>
              <h1>Settle your inner world, one session at a time.</h1>
              <p className="hero-subtitle">
                MindSettler is a gentle, structured space to understand your emotions, patterns, and life
                questions – and to navigate them with clarity and care.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => scrollToSection('booking')}
                >
                  Book your first session
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => scrollToSection('psycho-education')}
                >
                  Explore psycho-education
                </button>
              </div>
              <p className="fine-print">
                Safe, confidential, human. Available online and at the MindSettler Studio.
              </p>
            </div>
            <div className="hero-visual">
              <div className="journey-card">
                <p className="eyebrow">Your journey</p>
                <ol className="journey-list">
                  <li>Notice something feels heavy, confusing, or stuck.</li>
                  <li>Reach out and book your first 60-minute session.</li>
                  <li>Understand what is happening inside you with gentle guidance.</li>
                  <li>Design a personalised journey with follow-up sessions.</li>
                  <li>Build language, tools, and practices that stay with you.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
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

        <section id="psycho-education" className="section section-alt">
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

        <section id="how-it-works" className="section">
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

        <section id="journey" className="section section-alt journey-section">
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

        <section id="difference" className="section">
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

        <BookingSection />

        <CorporateSection />

        <FAQsSection />

        <ResourcesSection />

        <ContactSection />

        <PoliciesSection />

        <AdminPanel />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="brand-name">MindSettler</p>
            <p className="muted">Psycho-education &amp; mental well-being platform</p>
            <p className="muted small">
              This website is for informational purposes only and is not a substitute for professional medical or
              psychiatric care.
            </p>
          </div>
          <div className="footer-links">
            <a href="#policies">Privacy</a>
            <a href="#policies">Non-refund policy</a>
            <a href="#policies">Confidentiality</a>
          </div>
          <div className="footer-links">
            <a
              href="https://www.instagram.com/mindsettlerbypb/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}