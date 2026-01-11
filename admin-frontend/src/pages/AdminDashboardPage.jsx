import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../api'

function AdminDashboardPage() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [rejectModal, setRejectModal] = useState({ open: false, bookingId: null })
    const [rejectReason, setRejectReason] = useState('')

    const token = localStorage.getItem('mindsettler_admin_token')

    useEffect(() => {
        if (!token) {
            navigate('/')
            return
        }

        async function fetchData() {
            try {
                setLoading(true)
                setError('')

                const [bRes, cRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/bookings`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/contact`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])

                if (!bRes.ok || !cRes.ok) {
                    throw new Error('Failed to load admin data')
                }

                const [bData, cData] = await Promise.all([
                    bRes.json(),
                    cRes.json(),
                ])

                setBookings(bData.bookings || [])
                setContacts(cData.contacts || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, navigate])

    async function updateBookingStatus(id, status, reason = '') {
        const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status, reason }),
        })

        const data = await res.json()

        setBookings(prev =>
            prev.map(b =>
                b._id === id ? { ...b, status: data.booking.status } : b
            )
        )
    }

    function openRejectModal(bookingId) {
        setRejectModal({ open: true, bookingId })
        setRejectReason('')
    }

    function closeRejectModal() {
        setRejectModal({ open: false, bookingId: null })
        setRejectReason('')
    }

    async function handleReject() {
        if (rejectModal.bookingId) {
            await updateBookingStatus(rejectModal.bookingId, 'rejected', rejectReason)
            closeRejectModal()
        }
    }

    function handleLogout() {
        localStorage.removeItem('mindsettler_admin_token')
        navigate('/')
    }

    const pending = bookings.filter(b => b.status === 'pending')
    const confirmed = bookings.filter(b => b.status === 'confirmed')

    return (
        <main className="admin-dashboard-page">
            <div className="admin-shell">
                {/* HEADER */}
                <header className="admin-topbar">
                    <div className="admin-header-content">
                        <div className="logo">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M20 8 L20 32 M12 16 L20 8 L28 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="admin-title">Admin Dashboard</h1>
                            <p className="admin-subtitle">Overview of appointments and messages</p>
                        </div>
                    </div>
                    <button className="btn-outline" onClick={handleLogout}>
                        Logout
                    </button>
                </header>

                {/* STATS */}
                <section className="admin-stats">
                    <div className="stat-card">
                        <span className="stat-number">{pending.length}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card confirmed">
                        <span className="stat-number">{confirmed.length}</span>
                        <span className="stat-label">Confirmed</span>
                    </div>
                    <div className="stat-card messages">
                        <span className="stat-number">{contacts.length}</span>
                        <span className="stat-label">Messages</span>
                    </div>
                </section>

                {/* MAIN */}
                <section className="admin-main">
                    {loading && <p className="loading-text">Loading dashboard…</p>}
                    {error && <p className="error-text">{error}</p>}

                    {!loading && !error && (
                        <div className="admin-grid">
                            {/* PENDING */}
                            <section className="admin-panel">
                                <h2>Pending Appointments</h2>

                                {pending.length === 0 ? (
                                    <p className="empty-state">No pending appointments.</p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Client</th>
                                                    <th>Email</th>
                                                    <th>Date & Time</th>
                                                    <th>Mode</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pending.map(b => (
                                                    <tr key={b._id}>
                                                        <td>{b.name}</td>
                                                        <td>{b.email}</td>
                                                        <td>{b.date} {b.time}</td>
                                                        <td><span className="badge">{b.mode || '-'}</span></td>
                                                        <td className="actions-cell">
                                                            <button
                                                                className="btn-small btn-confirm"
                                                                onClick={() => updateBookingStatus(b._id, 'confirmed')}
                                                            >
                                                                ✓ Confirm
                                                            </button>
                                                            <button
                                                                className="btn-small btn-reject"
                                                                onClick={() => openRejectModal(b._id)}
                                                            >
                                                                ✕ Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* CONFIRMED */}
                            <section className="admin-panel">
                                <h2>Confirmed Appointments</h2>

                                {confirmed.length === 0 ? (
                                    <p className="empty-state">No confirmed appointments.</p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Client</th>
                                                    <th>Email</th>
                                                    <th>Date & Time</th>
                                                    <th>Mode</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {confirmed.map(b => (
                                                    <tr key={b._id}>
                                                        <td>{b.name}</td>
                                                        <td>{b.email}</td>
                                                        <td>{b.date} {b.time}</td>
                                                        <td><span className="badge confirmed">{b.mode || '-'}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            {/* MESSAGES */}
                            <section className="admin-panel full-width">
                                <h2>Messages</h2>

                                {contacts.length === 0 ? (
                                    <p className="empty-state">No messages yet.</p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Message</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map(c => (
                                                    <tr key={c._id}>
                                                        <td>{c.name}</td>
                                                        <td>{c.email}</td>
                                                        <td className="message-cell">{c.message}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </section>
            </div>

            {/* Rejection Reason Modal */}
            {rejectModal.open && (
                <div className="modal-overlay" onClick={closeRejectModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Rejection Reason</h3>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            Please provide a reason for rejecting this session (optional):
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="e.g., The requested time slot is unavailable..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                marginBottom: '1rem',
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                className="btn-outline"
                                onClick={closeRejectModal}
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-small btn-reject"
                                onClick={handleReject}
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Reject Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default AdminDashboardPage
