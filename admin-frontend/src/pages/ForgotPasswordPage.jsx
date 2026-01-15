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
            await sendPasswordReset(email, window.location.origin)
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
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
                            <path d="M20 10 L20 30 M13 17 L20 10 L27 17" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="eyebrow">MindSettler Console</p>
                    <h1>Reset Password</h1>
                    <p className="subtitle">Enter your email to receive a password reset link</p>
                </header>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    placeholder="admin@mindsettler.com"
                                    className="has-icon"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Reset Link
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            Check Your Email
                        </h3>
                        <p>{message}</p>
                        <p style={{ marginTop: '1rem' }}>Check your email inbox for the reset link.</p>
                    </div>
                )}

                <div className="login-footer">
                    <Link to="/" style={{ color: 'var(--primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default ForgotPasswordPage
