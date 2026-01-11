import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_BASE_URL from '../api'

function AdminLoginPage() {
    const navigate = useNavigate()
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
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="admin-login-page">
            <div className="login-container">
                <header className="login-header">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M20 8 L20 32 M12 16 L20 8 L28 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="eyebrow">MindSettler Console</p>
                    <h1>Admin Login</h1>
                    <p className="subtitle">Sign in to review appointments and enquiries.</p>
                </header>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in…' : 'Login'}
                    </button>

                    <Link to="/forgot-password" className="forgot-password-link">
                        Forgot Password?
                    </Link>
                </form>

                <p className="hint">
                    Default credentials: <strong>admin</strong> / <code>asdfghjkl123</code>
                </p>
            </div>
        </main>
    )
}

export default AdminLoginPage

