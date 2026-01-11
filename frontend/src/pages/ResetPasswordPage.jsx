import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { confirmReset } from '../firebase'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get('oobCode') || searchParams.get('token')
    const continueUrl = searchParams.get('continueUrl')

    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!code) {
            setError('Invalid or missing reset code.')
        }
    }, [code])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')

        if (newPassword !== confirm) {
            setError('Passwords do not match')
            return
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            await confirmReset(code, newPassword)
            setSuccess(true)
            setMessage('Password updated successfully!')
            setTimeout(() => {
                if (continueUrl) {
                    window.location.href = continueUrl
                } else {
                    navigate('/auth')
                }
            }, 3000)
        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
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
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(221, 231, 255, 0.9))',
                    boxShadow: '0 24px 60px rgba(63, 41, 101, 0.18)',
                    border: '1px solid rgba(63, 41, 101, 0.12)',
                    backdropFilter: 'blur(18px)',
                }}
            >
                <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.72rem', color: 'var(--text-soft)', margin: 0 }}>
                        Security
                    </p>
                    <h1 style={{ margin: '0.5rem 0 0.35rem', fontSize: '1.9rem', letterSpacing: '-0.03em' }}>
                        Set new password
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.95rem' }}>
                        Choose a strong password for your account.
                    </p>
                </header>

                {!success ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="new-pass" style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                                New Password
                            </label>
                            <input
                                id="new-pass"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                            <label htmlFor="confirm-pass" style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                                Confirm Password
                            </label>
                            <input
                                id="confirm-pass"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
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
                            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', margin: 0 }}>{error}</p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !code}
                            style={{
                                height: '2.8rem',
                                borderRadius: '999px',
                                background: '#3f2965',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#009650' }}>Success!</h3>
                        <p style={{ color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
                            Your password has been updated. You can now sign in.
                        </p>
                        <button
                            onClick={() => {
                                if (continueUrl) window.location.href = continueUrl;
                                else navigate('/auth');
                            }}
                            className="btn btn-secondary"
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                background: 'var(--secondary)',
                                color: '#3f2965',
                                borderRadius: '999px',
                                textDecoration: 'none',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
