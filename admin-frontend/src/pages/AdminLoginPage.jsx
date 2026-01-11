import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailPassword } from '../firebase'

function AdminLoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await signInWithEmailPassword(email, password)
            const token = await user.getIdToken()
            localStorage.setItem('mindsettler_admin_token', token)
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            setError(err.message || 'Login failed')
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
                    <p className="subtitle">Sign in with your admin email</p>
                </header>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            placeholder="bhanugovindu2007@gmail.com"
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
                    Ensure you are registered as an admin in Firebase.
                </p>
            </div>
        </main>
    )
}

export default AdminLoginPage
