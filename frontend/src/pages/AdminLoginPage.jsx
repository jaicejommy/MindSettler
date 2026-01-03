import { useState } from 'react'
import API_BASE_URL from '../api'

function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Login failed')
      }

      const data = await res.json()
      localStorage.setItem('mindsettler_admin_token', data.token)
      window.location.href = '/admin'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page admin-login-page">
      <div
        className="container"
        style={{
          maxWidth: 520,
          margin: '4rem auto',
          padding: '2.75rem 2.5rem',
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255, 210, 231, 0.9))',
          boxShadow: '0 24px 60px rgba(63, 41, 101, 0.18)',
          border: '1px solid rgba(221, 23, 100, 0.18)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <header style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.72rem',
              color: 'var(--text-soft)',
              margin: 0,
            }}
          >
            MindSettler Console
          </p>
          <h1
            style={{
              margin: '0.5rem 0 0.35rem',
              fontSize: '1.9rem',
              letterSpacing: '-0.03em',
            }}
          >
            Admin Login
          </h1>
          <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>
            Sign in to review appointments and enquiries.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="form"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div className="form-group">
            <label
              htmlFor="username"
              style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              autoComplete="current-password"
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
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p
          className="muted"
          style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}
        >
          Default admin:&nbsp;
          <span style={{ fontWeight: 600 }}>admin</span>
          {' / '}
          <span style={{ fontFamily: 'monospace' }}>asdfghjkl123</span>
        </p>
      </div>
    </main>
  )
}

export default AdminLoginPage
