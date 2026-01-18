import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { confirmReset } from '../../firebase'

function AdminResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get('oobCode') || searchParams.get('token')

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!code) {
            setError('Invalid reset link. Please request a new password reset.')
        }
    }, [code])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            await confirmReset(code, newPassword)

            setMessage('Password reset successful. You can now login.')
            setSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/admin'), 3000)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to reset password')
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
                    <h1>Reset Password</h1>
                    <p className="subtitle">Create your new password below.</p>
                </header>

                {!success ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Minimum 8 characters"
                                disabled={!code}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Re-enter your password"
                                disabled={!code}
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading || !code}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <p>{message}</p>
                        <p className="hint">Redirecting to login...</p>
                    </div>
                )}

                <p className="hint" style={{ marginTop: '1.5rem' }}>
                    <Link to="/admin" style={{ color: 'var(--primary-light)' }}>← Back to Login</Link>
                </p>
            </div>
        </main>
    )
}

export default AdminResetPasswordPage
