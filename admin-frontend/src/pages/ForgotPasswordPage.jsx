import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordReset } from '../firebase'

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            await sendPasswordReset(email)
            setMessage('If an account exists with this email, a reset link has been sent.')
            setSent(true)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to send reset email')
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
                    <h1>Forgot Password</h1>
                    <p className="subtitle">Enter your email to receive a password reset link.</p>
                </header>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
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

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <p>{message}</p>
                        <p className="hint">Check your email inbox for the reset link.</p>
                    </div>
                )}

                <p className="hint" style={{ marginTop: '1.5rem' }}>
                    <Link to="/" style={{ color: 'var(--primary-light)' }}>← Back to Login</Link>
                </p>
            </div>
        </main>
    )
}

export default ForgotPasswordPage
