import { useState, useEffect } from 'react'
import {
  auth,
  listenToAuthChanges,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  logout,
} from '../firebase'
import authedApi from '../authedApi'

function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendUser, setBackendUser] = useState(null)

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser)
      setBackendUser(null)

      // When a Firebase user logs in, call /api/me to sync into MongoDB
      if (firebaseUser) {
        try {
          const { data } = await authedApi.get('/me')
          setBackendUser(data.user || null)
        } catch (err) {
          console.error('Failed to sync user with backend:', err)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      if (mode === 'signup') {
        await signUpWithEmailPassword(email, password)
      } else {
        await signInWithEmailPassword(email, password)
      }
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Something went wrong')
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

  if (user) {
    return (
      <main className="page auth-page">
        <div className="container" style={{ maxWidth: 480, margin: '4rem auto' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Your account</h1>
          <p style={{ marginBottom: '0.75rem', color: 'var(--text-soft)' }}>
            Signed in as <strong>{user.email}</strong>
          </p>
          {backendUser && (
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
              Backend user ID: <code>{backendUser._id}</code>
            </p>
          )}
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
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
          maxWidth: 480,
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
            Use your email and password.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="form"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div className="form-group">
            <label
              htmlFor="email"
              style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              htmlFor="password"
              style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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

          {mode === 'signup' && (
            <div className="form-group">
              <label
                htmlFor="confirmPassword"
                style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
            {loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : mode === 'signup' ? 'Sign up' : 'Sign in'}
          </button>
        </form>

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
