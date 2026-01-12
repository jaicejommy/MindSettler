import { useState, useEffect, useRef } from 'react'
import {
  auth,
  listenToAuthChanges,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithGoogle,
  logout,
  sendPasswordReset,
} from '../firebase'
import authedApi from '../authedApi'

function ProfileCompletionForm({ backendUser, firebaseUser, setBackendUser, setError, setLoading, isEditing, setIsEditing }) {
  const [username, setUsername] = useState(backendUser?.username || '')
  const [name, setName] = useState(backendUser?.name || firebaseUser?.displayName || '')
  const [phone, setPhone] = useState(backendUser?.phone || '')

  // Sync state when backendUser changes
  useEffect(() => {
    setUsername(backendUser?.username || '')
    setName(backendUser?.name || firebaseUser?.displayName || '')
    setPhone(backendUser?.phone || '')
  }, [backendUser, firebaseUser])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !name) {
      setError('Please fill in username and name')
      return
    }

    try {
      setLoading(true)
      const { data } = await authedApi.patch('/me', {
        username,
        name,
        phone,
      })
      const updatedUser = data.user || null
      setBackendUser(updatedUser)
      setIsEditing(false)
      window.dispatchEvent(
        new CustomEvent('mindsettler-profile-updated', { detail: { user: updatedUser } }),
      )
    } catch (err) {
      console.error('Failed to complete profile', err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to complete profile')
      }
    } finally {
      setLoading(false)
    }
  }

  // Display mode - show profile info nicely
  if (!isEditing) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241, 237, 255, 0.9))',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(63, 41, 101, 0.1)',
          boxShadow: '0 4px 20px rgba(63, 41, 101, 0.08)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'rgba(63, 41, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3f2965',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#1a1a2e' }}>{backendUser?.name || '—'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'rgba(63, 41, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3f2965',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#1a1a2e' }}>@{backendUser?.username || '—'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'rgba(63, 41, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3f2965',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#1a1a2e' }}>{backendUser?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit mode - show form
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241, 237, 255, 0.9))',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(63, 41, 101, 0.1)',
        boxShadow: '0 4px 20px rgba(63, 41, 101, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-soft)' }}>
        Update your profile details.
      </p>

      <div className="form-group">
        <label
          htmlFor="profile-username"
          style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
        >
          Username
        </label>
        <input
          id="profile-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%',
            height: '2.6rem',
            borderRadius: '999px',
            border: '1px solid rgba(63, 41, 101, 0.18)',
            padding: '0 1rem',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="profile-name"
          style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
        >
          Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            height: '2.6rem',
            borderRadius: '999px',
            border: '1px solid rgba(63, 41, 101, 0.18)',
            padding: '0 1rem',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="profile-phone"
          style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
        >
          Phone
        </label>
        <input
          id="profile-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%',
            height: '2.6rem',
            borderRadius: '999px',
            border: '1px solid rgba(63, 41, 101, 0.18)',
            padding: '0 1rem',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          style={{
            flex: 1,
            height: '2.6rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            background: 'transparent',
            border: '1px solid rgba(63, 41, 101, 0.2)',
            color: '#3f2965',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-secondary"
          style={{
            flex: 1,
            height: '2.6rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
          }}
        >
          Save changes
        </button>
      </div>
    </form>
  )
}

function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const strictLoginCheck = useRef(false)

  // Login state (username + password)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup state (email/password + profile details)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [isGoogleSignup, setIsGoogleSignup] = useState(false) // Track if signup is via Google

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendUser, setBackendUser] = useState(null)

  const [loginErrors, setLoginErrors] = useState({})
  const [signupErrors, setSignupErrors] = useState({})

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)


  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser)

      // Don't clear backend user immediately if we're just refreshing
      // setBackendUser(null) 

      setBookings([])
      setBookingsLoading(false)

      // When a Firebase user logs in, call /api/me to sync into MongoDB and load their bookings
      if (firebaseUser) {
        try {
          setBookingsLoading(true)
          const [meRes, bookingsRes] = await Promise.all([
            authedApi.get('/me'),
            authedApi.get('/me/bookings'),
          ])
          setBackendUser(meRes.data.user || null)
          setBookings(bookingsRes.data.bookings || [])
        } catch (err) {
          console.error('Failed to sync user with backend (probably new user):', err)
          setBackendUser(null) // Ensure backendUser is null if not found

          // If we have a firebase user but no backend profile, it's a new signup
          // Pre-fill form and show signup, BUT only if we are still logged in (avoid race with strict login check)
          // Also check strictLoginCheck ref to ensure we don't preempt handleGoogleSignIn's logic
          if (strictLoginCheck.current) return

          if (auth.currentUser) {
            setMode('signup')
            setIsGoogleSignup(true)
            setSignupEmail(firebaseUser.email || '')
            setSignupName(firebaseUser.displayName || '')
            setSuccessMessage('Please complete your profile to continue')
          }
        } finally {
          setBookingsLoading(false)
        }
      } else {
        setBackendUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setError('')
    setLoginErrors({})

    const fieldErrors = {}
    if (!loginUsername) fieldErrors.username = 'Username is required'
    if (!loginPassword) fieldErrors.password = 'Password is required'

    if (Object.keys(fieldErrors).length > 0) {
      setLoginErrors(fieldErrors)
      setError('Please fill in your username and password')
      return
    }

    try {
      setLoading(true)

      let emailToUse = loginUsername.trim()
      try {
        const { data } = await authedApi.get('/auth/resolve-username', {
          params: { identifier: emailToUse },
        })
        emailToUse = data.email
      } catch (resolveErr) {
        if (!emailToUse.includes('@')) {
          setLoginErrors((prev) => ({ ...prev, username: 'User not found for this username' }))
          throw new Error('User not found for this username')
        }
      }

      await signInWithEmailPassword(emailToUse, loginPassword)
      setLoginErrors({})
      setLoginUsername('')
      setLoginPassword('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault()
    setError('')
    setSignupErrors({})

    const fieldErrors = {}
    if (!signupUsername) fieldErrors.username = 'Username is required'
    if (!signupName) fieldErrors.name = 'Name is required'

    // Only require email/password for non-Google signups
    if (!isGoogleSignup) {
      if (!signupEmail) fieldErrors.email = 'Email is required'
      if (!signupPassword) fieldErrors.password = 'Password is required'
      if (!signupConfirmPassword) fieldErrors.confirmPassword = 'Please confirm your password'
    }

    if (Object.keys(fieldErrors).length > 0) {
      setSignupErrors(fieldErrors)
      setError('Please fix the highlighted fields')
      return
    }

    if (!isGoogleSignup && signupPassword !== signupConfirmPassword) {
      setSignupErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      // For non-Google signups, create Firebase account first
      if (!isGoogleSignup) {
        await signUpWithEmailPassword(signupEmail, signupPassword)
      }

      // Update profile in our backend (username, name, phone)
      try {
        const { data } = await authedApi.patch('/me', {
          username: signupUsername,
          name: signupName,
          phone: signupPhone,
        })
        setBackendUser(data.user || null)
      } catch (profileErr) {
        console.error('Failed to update profile after signup', profileErr)
        if (profileErr.response && profileErr.response.data && profileErr.response.data.message) {
          setError(profileErr.response.data.message)
          return
        }
      }

      // Reset form
      setSignupErrors({})
      setSignupEmail('')
      setSignupPassword('')
      setSignupConfirmPassword('')
      setSignupUsername('')
      setSignupName('')
      setSignupPhone('')
      setIsGoogleSignup(false)
      setSuccessMessage('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
    } catch (err) {
      console.error(err)
    }
  }



  async function handleGoogleSignIn() {
    setError('')
    try {
      setLoading(true)
      if (mode === 'login') strictLoginCheck.current = true
      const googleUser = await signInWithGoogle()

      // Check if user already exists in backend (returning user)
      try {
        const { data } = await authedApi.get('/me')
        if (data.user && data.user.username) {
          // User already has a complete profile, let them in
          return
        }
      } catch (err) {
        // User doesn't exist in backend yet (404)

        // If not in signup mode, reject new users
        if (mode !== 'signup') {
          await logout()
          setMode('login')
          setError('No account found with this email. Please create an account.')
          return
        }

        // If in signup mode, continue to profile completion
      }

      // Pre-fill signup form with Google info and switch to signup mode
      setSignupEmail(googleUser.email || '')
      setSignupName(googleUser.displayName || '')
      setIsGoogleSignup(true)
      setMode('signup')
      setSuccessMessage('Please complete your profile to continue')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Google sign-in failed')
    } finally {
      strictLoginCheck.current = false
      setLoading(false)
    }
  }

  async function handleResetSignup() {
    try {
      await logout()
    } catch (err) {
      console.error(err)
    }
    setSignupEmail('')
    setSignupName('')
    setSignupUsername('')
    setSignupPhone('')
    setIsGoogleSignup(false)
    setMode('signup') // Keep in signup mode or switch to 'login' if preferred
    setError('')
    setSuccessMessage('')
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!forgotEmail) {
      setError('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      await sendPasswordReset(forgotEmail)
      setResetSent(true)
      setSuccessMessage('Password reset email sent! Check your inbox.')
    } catch (err) {
      console.error(err)
      // Firebase error messages
      if (err?.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err?.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError(err?.message || 'Failed to send password reset email')
      }
    } finally {
      setLoading(false)
    }
  }

  // Only show profile page if BOTH Firebase Auth AND Backend Profile exist
  // If backendUser is missing, it means they need to complete signup
  if (user && backendUser) {
    const avatarLetter =
      (backendUser?.name && backendUser.name[0]) ||
      (backendUser?.username && backendUser.username[0]) ||
      (user.email && user.email[0]) ||
      'U'

    const hasProfilePic = backendUser && backendUser.profilePic

    return (
      <main className="page auth-page">
        <div className="container" style={{ maxWidth: 640, margin: '4rem auto' }}>
          {/* Profile Header with Avatar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            {/* Avatar with Edit Icon */}
            <div
              style={{
                position: 'relative',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(63, 41, 101, 0.15), rgba(107, 91, 149, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '2.2rem',
                  color: '#3f2965',
                  boxShadow: '0 8px 32px rgba(63, 41, 101, 0.2)',
                  border: '3px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                {hasProfilePic ? (
                  <img
                    src={backendUser.profilePic}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  avatarLetter.toUpperCase()
                )}
              </div>
              {/* Edit Icon Button */}
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isEditingProfile
                    ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                    : 'linear-gradient(135deg, #3f2965, #6b5b95)',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(63, 41, 101, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                title={isEditingProfile ? 'Cancel editing' : 'Edit profile'}
              >
                {isEditingProfile ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Name and Email */}
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 600, color: '#1a1a2e' }}>
              {backendUser?.name || 'User'}
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-soft)', fontSize: '0.9rem' }}>
              {user.email}
            </p>
          </div>

          {/* Profile Info / Edit Form */}
          <ProfileCompletionForm
            backendUser={backendUser}
            firebaseUser={user}
            setBackendUser={setBackendUser}
            setError={setError}
            setLoading={setLoading}
            isEditing={isEditingProfile}
            setIsEditing={setIsEditingProfile}
          />

          {error && (
            <p style={{ color: 'var(--danger)', margin: '0.25rem 0 0.75rem' }}>{error}</p>
          )}

          <section style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Your sessions</h2>
            {bookingsLoading && <p style={{ fontSize: '0.9rem' }}>Loading your sessions…</p>}
            {!bookingsLoading && bookings.length === 0 && (
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                You have not booked any sessions yet.
              </p>
            )}
            {!bookingsLoading && bookings.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid rgba(63, 41, 101, 0.12)',
                      padding: '0.75rem 1rem',
                      background: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <strong>
                        {b.date} at {b.time}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '999px',
                          background:
                            b.status === 'confirmed'
                              ? 'rgba(0, 150, 80, 0.12)'
                              : b.status === 'pending'
                                ? 'rgba(245, 186, 25, 0.16)'
                                : 'rgba(220, 53, 69, 0.1)',
                          color:
                            b.status === 'confirmed'
                              ? '#006644'
                              : b.status === 'pending'
                                ? '#806000'
                                : '#842029',
                        }}
                      >
                        {b.status || 'pending'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                      Mode: {b.mode || 'online'} • Focus: {b.sessionType || 'individual'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
            style={{ marginTop: '2rem' }}
          >
            Log out
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page auth-page">
      <div
        className="container"
        style={{
          maxWidth: 520,
          margin: '4rem auto',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(221, 231, 255, 0.9))',
          boxShadow: '0 24px 60px rgba(63, 41, 101, 0.18)',
          border: '1px solid rgba(63, 41, 101, 0.12)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.72rem',
              color: 'var(--text-soft)',
              margin: 0,
            }}
          >
            MindSettler account
          </p>
          <h1
            style={{
              margin: '0.5rem 0 0.35rem',
              fontSize: '1.9rem',
              letterSpacing: '-0.03em',
            }}
          >
            {mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Reset Password' : 'Sign in'}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>
            {mode === 'signup'
              ? 'Create an account with your details and password.'
              : mode === 'forgot'
                ? 'Enter your email to receive a password reset link.'
                : 'Sign in with your username and password.'}
          </p>
        </header>

        <form
          onSubmit={mode === 'signup' ? handleSignupSubmit : mode === 'forgot' ? handleForgotPassword : handleLoginSubmit}
          className="form"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {mode === 'login' && (
            <>
              <div className="form-group">
                <label
                  htmlFor="login-username"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoComplete="username"
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                {loginErrors.username && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {loginErrors.username}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="login-password"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                {loginErrors.password && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {loginErrors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b5b95',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'right',
                  marginTop: '-0.5rem',
                  textDecoration: 'underline',
                }}
              >
                Forgot Password?
              </button>
            </>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <>
              {!resetSent ? (
                <div className="form-group">
                  <label
                    htmlFor="forgot-email"
                    style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoComplete="email"
                    style={{
                      width: '100%',
                      height: '2.6rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(63, 41, 101, 0.18)',
                      padding: '0 1rem',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                    placeholder="Enter your email"
                  />
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(0, 150, 80, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#006644', margin: 0, fontSize: '0.95rem' }}>
                    ✓ {successMessage}
                  </p>
                </div>
              )}

              {/* Back to Sign In */}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); setResetSent(false); setForgotEmail(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b5b95',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'underline',
                }}
              >
                ← Back to Sign In
              </button>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label
                  htmlFor="signup-username"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Username *
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  autoComplete="username"
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                {signupErrors.username && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {signupErrors.username}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label
                  htmlFor="signup-name"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  autoComplete="name"
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                {signupErrors.name && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {signupErrors.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label
                  htmlFor="signup-phone"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Phone
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  autoComplete="tel"
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="signup-email"
                  style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                >
                  Email {isGoogleSignup ? '(from Google)' : '*'}
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  autoComplete="email"
                  readOnly={isGoogleSignup}
                  disabled={isGoogleSignup}
                  style={{
                    width: '100%',
                    height: '2.6rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(63, 41, 101, 0.18)',
                    padding: '0 1rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: isGoogleSignup ? 'rgba(63, 41, 101, 0.05)' : 'white',
                    cursor: isGoogleSignup ? 'not-allowed' : 'text',
                  }}
                />
                {isGoogleSignup && (
                  <button
                    type="button"
                    onClick={handleResetSignup}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      marginTop: '0.25rem',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Not you? Use a different email
                  </button>
                )}
                {signupErrors.email && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {signupErrors.email}
                  </p>
                )}
              </div>

              {/* Password fields - only show for non-Google signups */}
              {!isGoogleSignup && (
                <>
                  <div className="form-group">
                    <label
                      htmlFor="signup-password"
                      style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                    >
                      Password *
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      autoComplete="new-password"
                      style={{
                        width: '100%',
                        height: '2.6rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(63, 41, 101, 0.18)',
                        padding: '0 1rem',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                    {signupErrors.password && (
                      <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        {signupErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="signup-confirm-password"
                      style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
                    >
                      Confirm password *
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      style={{
                        width: '100%',
                        height: '2.6rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(63, 41, 101, 0.18)',
                        padding: '0 1rem',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                    {signupErrors.confirmPassword && (
                      <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        {signupErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Success message for Google signup */}
          {successMessage && (
            <p style={{ color: '#006644', background: 'rgba(0, 150, 80, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', margin: '0.25rem 0 0.1rem' }}>{successMessage}</p>
          )}

          {error && (
            <p style={{ color: 'var(--danger)', margin: '0.25rem 0 0.1rem' }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              height: '2.7rem',
              borderRadius: '999px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
            }}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating account…'
                : mode === 'forgot'
                  ? 'Sending…'
                  : 'Signing in…'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'forgot'
                  ? (resetSent ? 'Email Sent!' : 'Send Reset Link')
                  : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '0.75rem' }}>
            Or continue with
          </p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-secondary"
            disabled={loading}
            style={{
              height: '2.6rem',
              borderRadius: '999px',
              padding: '0 1.25rem',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>
        </div>

        <p
          className="muted"
          style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}
        >
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup')
              setError('')
            }}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              margin: 0,
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </main >
  )
}

export default AuthPage
