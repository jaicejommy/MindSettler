import { useState } from 'react'
import { useInView } from '../hooks/useInView'

import API_BASE_URL from '../api'


export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredChannel: 'email',
    message: '',
  })
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [infoRef, infoInView] = useInView()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
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
      setTouched({})
    } catch (e) {
      console.error(e)
      setError(e.message || 'Unable to send message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className="section" style={{ paddingTop: '6rem' }}>
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
                  onBlur={handleBlur}
                  className={form.name && touched.name ? 'success' : ''}
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
                  onBlur={handleBlur}
                  className={form.email && touched.email ? 'success' : ''}
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
                  onBlur={handleBlur}
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

          <div className={`card contact-info ${infoInView ? 'in-view' : ''}`} ref={infoRef}>
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
    </main>
  )
}
