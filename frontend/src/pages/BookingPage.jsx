import { useEffect, useMemo, useState } from 'react'

import API_BASE_URL from '../api'


export default function BookingPage() {
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
  const [touched, setTouched] = useState({})
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
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = (phone) => !phone || /^\d{10,}$/.test(phone.replace(/\D/g, ''))

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
      setForm({
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
      setTouched({})
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
    <main>
      <section className="section section-alt" style={{ paddingTop: '6rem' }}>
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
                  onBlur={handleBlur}
                  className={form.name && touched.name ? 'success' : ''}
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
                  onBlur={handleBlur}
                  className={touched.email ? (isValidEmail(form.email) ? 'success' : '') : ''}
                />
                {touched.email && !isValidEmail(form.email) && form.email && (
                  <span className="form-error">Please enter a valid email address</span>
                )}
              </div>
              <div className="field">
                <label htmlFor="phone">Phone (WhatsApp preferred)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={form.phone && touched.phone ? (isValidPhone(form.phone) ? 'success' : '') : ''}
                />
                {touched.phone && form.phone && !isValidPhone(form.phone) && (
                  <span className="form-error">Please enter a valid phone number</span>
                )}
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
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Book session'}
            </button>
          </form>

          {result && (
            <div className="card booking-highlight">
              <h3>Session confirmed</h3>
              <p>
                <strong>{result.name}</strong>, your booking has been marked as pending. You will receive a
                confirmation email or WhatsApp message within 24 hours.
              </p>
              <div className="info-pill">
                <p>
                  <strong>{result.date}</strong> at <strong>{result.time}</strong> • {result.mode === 'offline' ? 'In-person at studio' : 'Online'}
                </p>
              </div>
              <p className="muted">
                Once confirmed, you will receive payment details and a final message with the meeting link (for
                online) or studio address (for offline).
              </p>
              <p className="muted">
                In the meantime, you can add this to your calendar:
              </p>
              <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="primary-btn">
                Add to Google Calendar
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
