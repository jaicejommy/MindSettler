import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getGoogleAccessToken } from '../firebase'
import authedApi from '../authedApi'
import API_BASE_URL from '../api'


export default function BookingPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    mode: 'online',
    clientType: '',
    sessionType: '',
    isFirstSession: true,
    date: '',
    time: '',
    notes: '',
    paymentScreenshot: null,
  })
  const [touched, setTouched] = useState({})
  const [acceptPolicies, setAcceptPolicies] = useState(false)
  const [paymentOption, setPaymentOption] = useState('online') // 'online' or 'studio'
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [calendarAdded, setCalendarAdded] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const { user, loading: authLoading } = useAuth()

  // Step validation
  const isStep1Valid = () => {
    const hasValidName = form.name.trim().length > 0
    const hasValidPhone = isValidPhone(form.phone)
    const hasClientType = form.clientType !== ''
    const hasSessionType = form.sessionType !== ''
    const hasPoliciesAccepted = !form.isFirstSession || acceptPolicies
    return hasValidName && hasValidPhone && hasClientType && hasSessionType && hasPoliciesAccepted
  }

  const isStep2Valid = () => {
    return form.date && form.time
  }

  const handleNext = () => {
    setError('')
    if (currentStep === 1) {
      if (!form.name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (form.phone && !isValidPhone(form.phone)) {
        setError('Please enter a valid phone number.')
        return
      }
      if (!form.clientType) {
        setError('Please select a client type.')
        return
      }
      if (!form.sessionType) {
        setError('Please select a session focus.')
        return
      }
      if (form.isFirstSession && !acceptPolicies) {
        setError('You must accept the policies to continue.')
        return
      }
    }
    if (currentStep === 2) {
      if (!form.date) {
        setError('Please select a date.')
        return
      }
      if (!form.time) {
        setError('Please select a time slot.')
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setError('')
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

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
    const { name, value, type, checked, files } = e.target
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
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
    
    // Validate policy acceptance for first-time sessions
    if (form.isFirstSession && !acceptPolicies) {
      setError('You must accept the policies to book your first session.')
      return
    }

    // Validate payment screenshot (only required for online payment)
    const requiresPaymentScreenshot = form.mode === 'online' || paymentOption === 'online'
    if (requiresPaymentScreenshot && !form.paymentScreenshot) {
      setError('Please upload a payment screenshot.')
      return
    }
    
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const formData = new FormData()
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key])
        }
      })

      const res = await authedApi.post('/bookings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const booking = res.data.booking
      setResult(booking)

      // Automatically add to Google Calendar if user signed in with Google
      const accessToken = getGoogleAccessToken()
      if (accessToken) {
        try {
          const startDateTime = `${booking.date}T${booking.time}:00`
          const endDate = new Date(startDateTime)
          endDate.setMinutes(endDate.getMinutes() + 60)
          const endDateTime = endDate.toISOString()

          const calendarEvent = {
            summary: 'MindSettler Session',
            description: `MindSettler psycho-education and counselling session.\n\nMode: ${booking.mode === 'offline' ? 'In-person at studio' : 'Online'}\n\nThis is not a crisis service. For emergencies, please contact your local emergency helpline.`,
            location: booking.mode === 'offline' ? 'MindSettler Studio' : 'Online (details from MindSettler)',
            start: {
              dateTime: startDateTime,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endDateTime,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
              ],
            },
          }

          const calendarRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarEvent),
          })
          if (calendarRes.ok) {
            setCalendarAdded(true)
          }
        } catch (calendarError) {
          console.error('Failed to add to Google Calendar:', calendarError)
          // Don't show error to user - booking was still successful
        }
      }

      setForm({
        name: '',
        phone: '',
        mode: 'online',
        sessionType: '',
        isFirstSession: true,
        date: '',
        time: '',
        notes: '',
        paymentScreenshot: null,
      })
      setTouched({})
      setAcceptPolicies(false)
      setPaymentOption('online')
      setCurrentStep(1)
    } catch (err) {
      console.error(err)
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Unable to submit booking at the moment.')
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

        {!authLoading && !user ? (
          <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h3>Sign in to Book</h3>
            <p>You need to be logged in to book a session.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/auth" className="primary-btn">
                Sign In / Register
              </Link>
            </div>
          </div>
        ) : result ? (
          <div className="booking-grid">
            <div className="card booking-highlight">
              <h3>Booking Request Sent!</h3>
              <p>
                Thank you, <strong>{result.name}</strong>! We're excited to connect with you. Your booking request has been received and we can't wait to support you on your journey. Once approved, a confirmation email will be sent to you.
              </p>
              <div className="info-pill">
                <p>
                  <strong>{result.date}</strong> at <strong>{result.time}</strong> • {result.mode === 'offline' ? 'In-person at studio' : 'Online'}
                </p>
              </div>
              {calendarAdded ? (
                <p className="muted" style={{ color: 'var(--primary)' }}>
                  ✓ This session has been automatically added to your Google Calendar.
                </p>
              ) : (
                <>
                  <p className="muted">
                    You can add this to your calendar in advance:
                  </p>
                  <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="primary-btn">
                    Add to Google Calendar
                  </a>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="booking-grid">
            <form className="card booking-form" onSubmit={handleSubmit}>
              {/* Step Progress Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                {/* Progress Line */}
                <div style={{ position: 'absolute', top: '18px', left: '15%', right: '15%', height: '2px', background: '#e0e0e0', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '18px', left: '15%', height: '2px', background: '#7c3aed', zIndex: 0, width: currentStep === 1 ? '0%' : currentStep === 2 ? '35%' : '70%', transition: 'width 0.3s ease' }} />
                
                {[1, 2, 3].map((step) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: currentStep >= step ? '#7c3aed' : '#ffffff',
                        color: currentStep >= step ? '#ffffff' : '#666666',
                        border: currentStep >= step ? '2px solid #7c3aed' : '2px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        lineHeight: 1,
                        boxSizing: 'border-box',
                      }}
                    >
                      <span>{step}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: currentStep >= step ? 'var(--primary)' : '#666', fontWeight: currentStep === step ? 600 : 400 }}>
                      {step === 1 ? 'Details' : step === 2 ? 'Schedule' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Your Details & Session Preferences */}
              {currentStep === 1 && (
                <>
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
                      <label htmlFor="clientType">Client Type *</label>
                      <select
                        id="clientType"
                        name="clientType"
                        value={form.clientType}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Who are you booking for?</option>
                        <option value="kids">Kids (5+)</option>
                        <option value="teens">Teens</option>
                        <option value="adults">Adults (up to 65)</option>
                        <option value="couples">Couples</option>
                        <option value="families">Families</option>
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="sessionType">Session focus *</label>
                      <select
                        id="sessionType"
                        name="sessionType"
                        value={form.sessionType}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Choose your focus</option>
                        <option value="cbt">Cognitive Behavioural Therapy (CBT)</option>
                        <option value="dbt">Dialectical Behavioural Therapy (DBT)</option>
                        <option value="act">Acceptance & Commitment Therapy (ACT)</option>
                        <option value="schema">Schema Therapy</option>
                        <option value="eft">Emotion-Focused Therapy (EFT)</option>
                        <option value="efct">Emotion-Focused Couples Therapy</option>
                        <option value="mbct">Mindfulness-Based Cognitive Therapy</option>
                        <option value="cct">Client-Centred Therapy</option>
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

                    {form.isFirstSession && (
                      <div className="field field-checkbox" style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={acceptPolicies}
                            onChange={(e) => setAcceptPolicies(e.target.checked)}
                            style={{ marginTop: '0.2rem' }}
                          />
                          <span>
                            I have read and accept the{' '}
                            <Link
                              to="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                            >
                              Privacy Policy
                            </Link>
                            ,{' '}
                            <Link
                              to="/non-refund"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                            >
                              Non-Refund Policy
                            </Link>
                            , and{' '}
                            <Link
                              to="/confidentiality"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                            >
                              Confidentiality Policy
                            </Link>
                            {' '}*
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Pick a Slot */}
              {currentStep === 2 && (
                <>
                  <h3>Pick a slot</h3>
                  <div className="field-grid">
                    <div className="field">
                      <label htmlFor="date">Preferred date *</label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
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
                          .filter((s) => {
                            if (!s.isAvailable) return false
                            // If selected date is today, filter out past times
                            const today = new Date().toISOString().split('T')[0]
                            if (form.date === today) {
                              const now = new Date()
                              const [hours, minutes] = s.time.split(':').map(Number)
                              const slotTime = new Date()
                              slotTime.setHours(hours, minutes, 0, 0)
                              return slotTime > now
                            }
                            return true
                          })
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

                  {/* Summary of selections */}
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(63, 41, 101, 0.05)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                      <strong>Session summary:</strong> {form.mode === 'online' ? 'Online' : 'Offline Studio'} • {{
                        'kids': 'Kids (5+)',
                        'teens': 'Teens',
                        'adults': 'Adults (up to 65)',
                        'couples': 'Couples',
                        'families': 'Families'
                      }[form.clientType] || form.clientType} • {{
                        'cbt': 'Cognitive Behavioural Therapy (CBT)',
                        'dbt': 'Dialectical Behavioural Therapy (DBT)',
                        'act': 'Acceptance & Commitment Therapy (ACT)',
                        'schema': 'Schema Therapy',
                        'eft': 'Emotion-Focused Therapy (EFT)',
                        'efct': 'Emotion-Focused Couples Therapy',
                        'mbct': 'Mindfulness-Based Cognitive Therapy',
                        'cct': 'Client-Centred Therapy'
                      }[form.sessionType] || form.sessionType}
                    </p>
                  </div>
                </>
              )}

              {/* Step 3: Complete Payment */}
              {currentStep === 3 && (
                <>
                  <div className="card booking-payment" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Complete Payment</h3>
                    
                    {/* Payment option selection for offline bookings */}
                    {form.mode === 'offline' && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ marginBottom: '1rem' }}>Choose your payment method:</p>
                        <div className="pill-group">
                          <button
                            type="button"
                            className={paymentOption === 'online' ? 'pill active' : 'pill'}
                            onClick={() => setPaymentOption('online')}
                          >
                            Pay Now (Scan QR)
                          </button>
                          <button
                            type="button"
                            className={paymentOption === 'studio' ? 'pill active' : 'pill'}
                            onClick={() => setPaymentOption('studio')}
                          >
                            Pay Later at Studio
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Show QR payment for online mode OR if offline user chooses to pay now */}
                    {(form.mode === 'online' || paymentOption === 'online') && (
                      <>
                        <p>Please scan the QR code to pay for your session. Upload the screenshot below to confirm your booking.</p>
                        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                          <img src="/payment-qr.png" alt="Payment QR Code" style={{ maxWidth: '200px', border: '1px solid #ddd', borderRadius: '8px' }} />
                        </div>
                        <div className="field">
                          <label htmlFor="paymentScreenshot">Upload Payment Screenshot *</label>
                          <input
                            id="paymentScreenshot"
                            name="paymentScreenshot"
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleChange}
                            className={touched.paymentScreenshot && !form.paymentScreenshot ? 'error' : ''}
                          />
                          {touched.paymentScreenshot && !form.paymentScreenshot && <p className="form-error">Payment screenshot is required</p>}
                        </div>
                      </>
                    )}

                    {/* Show pay at studio message */}
                    {form.mode === 'offline' && paymentOption === 'studio' && (
                      <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text)' }}>You can pay at the studio before your session begins.</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginTop: '0.5rem' }}>Please arrive 10 minutes early to complete the payment.</p>
                      </div>
                    )}
                  </div>

                  {/* Booking Summary */}
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(63, 41, 101, 0.05)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Booking Summary</h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)', lineHeight: '1.6' }}>
                      <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {form.name}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {user?.email}</p>
                      {form.phone && <p style={{ margin: '0.25rem 0' }}><strong>Phone:</strong> {form.phone}</p>}
                      <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {form.date}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {form.time}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Mode:</strong> {form.mode === 'online' ? 'Online' : 'Offline Studio'}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Client Type:</strong> {{
                        'kids': 'Kids (5+)',
                        'teens': 'Teens',
                        'adults': 'Adults (up to 65)',
                        'couples': 'Couples',
                        'families': 'Families'
                      }[form.clientType] || form.clientType}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Focus:</strong> {{
                        'cbt': 'Cognitive Behavioural Therapy (CBT)',
                        'dbt': 'Dialectical Behavioural Therapy (DBT)',
                        'act': 'Acceptance & Commitment Therapy (ACT)',
                        'schema': 'Schema Therapy',
                        'eft': 'Emotion-Focused Therapy (EFT)',
                        'efct': 'Emotion-Focused Couples Therapy',
                        'mbct': 'Mindfulness-Based Cognitive Therapy',
                        'cct': 'Client-Centred Therapy'
                      }[form.sessionType] || form.sessionType}</p>
                    </div>
                  </div>
                </>
              )}

              {error && <p className="form-error" style={{ marginTop: '1rem' }}>{error}</p>}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleBack}
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleNext}
                    style={{ flex: 1 }}
                  >
                    Next
                  </button>
                ) : (
                  <button type="submit" className="primary-btn" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? 'Submitting…' : 'Book session'}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  )
}
