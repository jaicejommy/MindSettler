import { useState } from 'react'

import API_BASE_URL from '../api'

export default function CorporatePage() {
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
    <main>
      <section className="section section-alt" style={{ paddingTop: '6rem' }}>
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
    </main>
  )
}
