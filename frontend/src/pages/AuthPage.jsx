import { useState, useEffect } from 'react'
import {
  auth,
  listenToAuthChanges,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithGoogle,
  logout,
} from '../firebase'
import authedApi from '../authedApi'

function ProfileCompletionForm({ backendUser, firebaseUser, setBackendUser, setError, setLoading }) {
  const [username, setUsername] = useState(backendUser?.username || '')
  const [name, setName] = useState(backendUser?.name || firebaseUser?.displayName || '')
  const [phone, setPhone] = useState(backendUser?.phone || '')

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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

      <button
        type="submit"
        className="btn btn-secondary"
        style={{
          marginTop: '0.5rem',
          height: '2.6rem',
          borderRadius: '999px',
          fontSize: '0.85rem',
        }}
      >
        Save profile
      </button>
    </form>
  )
}

function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'

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

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendUser, setBackendUser] = useState(null)

  const [loginErrors, setLoginErrors] = useState({})
  const [signupErrors, setSignupErrors] = useState({})

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [uploadingPic, setUploadingPic] = useState(false)

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser)
      setBackendUser(null)
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
          console.error('Failed to sync user with backend:', err)
        } finally {
          setBookingsLoading(false)
        }
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
    if (!signupEmail) fieldErrors.email = 'Email is required'
    if (!signupPassword) fieldErrors.password = 'Password is required'
    if (!signupConfirmPassword) fieldErrors.confirmPassword = 'Please confirm your password'

    if (Object.keys(fieldErrors).length > 0) {
      setSignupErrors(fieldErrors)
      setError('Please fix the highlighted fields')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      await signUpWithEmailPassword(signupEmail, signupPassword)

      // Immediately update profile in our backend (username, name, phone)
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
        }
      }

      setSignupErrors({})
      setSignupEmail('')
      setSignupPassword('')
      setSignupConfirmPassword('')
      setSignupUsername('')
      setSignupName('')
      setSignupPhone('')
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

  async function handleProfilePicChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    setError('')
    try {
      setUploadingPic(true)
      const formData = new FormData()
      formData.append('profilePic', file)

      const { data } = await authedApi.post('/me/profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const updatedUser = data.user || backendUser
      setBackendUser(updatedUser)
      window.dispatchEvent(
        new CustomEvent('mindsettler-profile-updated', { detail: { user: updatedUser } }),
      )
    } catch (err) {
      console.error('Failed to upload profile picture', err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to upload profile picture')
      }
    } finally {
      setUploadingPic(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    try {
      setLoading(true)
      await signInWithGoogle()
      // auth state listener will run and sync with backend
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    const avatarLetter =
      (backendUser?.name && backendUser.name[0]) ||
      (backendUser?.username && backendUser.username[0]) ||
      (user.email && user.email[0]) ||
      'U'

    const hasProfilePic = backendUser && backendUser.profilePic

    return (
      <main className="page auth-page">
        <div className="container" style={{ maxWidth: 640, margin: '4rem auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Your profile</h1>
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-soft)' }}>
            Signed in as <strong>{user.email}</strong>
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(63, 41, 101, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '1.6rem',
                color: '#3f2965',
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
            <div>
              <label
                htmlFor="profile-photo"
                style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.35rem' }}
              >
                Profile photo
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                disabled={uploadingPic}
              />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                JPG or PNG, up to 5 MB.
                {uploadingPic && ' Uploading…'}
              </p>
            </div>
          </div>

          <ProfileCompletionForm
            backendUser={backendUser}
            firebaseUser={user}
            setBackendUser={setBackendUser}
            setError={setError}
            setLoading={setLoading}
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
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>
            {mode === 'signup'
              ? 'Create an account with your details and password.'
              : 'Sign in with your username and password.'}
          </p>
        </header>

        <form
          onSubmit={mode === 'signup' ? handleSignupSubmit : handleLoginSubmit}
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
                  Email *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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
                />
                {signupErrors.email && (
                  <p style={{ color: 'var(--danger)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                    {signupErrors.email}
                  </p>
                )}
              </div>
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
                : 'Signing in…'
              : mode === 'signup'
              ? 'Create account'
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
    </main>
  )
}

export default AuthPage
