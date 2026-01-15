import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../api'

// Icons as SVG components
const Icons = {
    Dashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    Calendar: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    Messages: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Clock: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    CalendarClock: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h5" />
            <circle cx="18" cy="18" r="4" />
            <path d="M18 16.5v1.5l1 1" />
        </svg>
    ),
    Logout: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    Bell: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
    Users: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    AlertCircle: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    Video: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    ),
    User: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Mail: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
}

function AdminDashboardPage() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [rejectModal, setRejectModal] = useState({ open: false, bookingId: null })
    const [rejectReason, setRejectReason] = useState('')
    const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null })
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', message: '' })
    const [availableSlots, setAvailableSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')

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

    async function openRescheduleModal(booking) {
        setRescheduleModal({ open: true, booking })
        setRescheduleData({ date: '', time: '', message: '' })
        setAvailableSlots([])
    }

    function closeRescheduleModal() {
        setRescheduleModal({ open: false, booking: null })
        setRescheduleData({ date: '', time: '', message: '' })
        setAvailableSlots([])
    }

    async function fetchSlotsForDate(date) {
        if (!date) return
        setLoadingSlots(true)
        try {
            const res = await fetch(`${API_BASE_URL}/slots?date=${date}`)
            const data = await res.json()
            setAvailableSlots(data.slots?.filter(s => s.isAvailable) || [])
        } catch (err) {
            console.error('Failed to fetch slots:', err)
            setAvailableSlots([])
        } finally {
            setLoadingSlots(false)
        }
    }

    async function handleReschedule() {
        if (!rescheduleModal.booking || !rescheduleData.date || !rescheduleData.time) return
        const booking = rescheduleModal.booking
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${booking._id}/reschedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newDate: rescheduleData.date,
                    newTime: rescheduleData.time,
                    message: rescheduleData.message,
                    originalDate: booking.date,
                    originalTime: booking.time,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === booking._id ? data.booking : b))
                closeRescheduleModal()
            } else {
                alert(data.message || 'Failed to reschedule')
            }
        } catch (err) {
            console.error('Reschedule failed:', err)
            alert('Failed to reschedule booking')
        }
    }

    function handleLogout() {
        localStorage.removeItem('mindsettler_admin_token')
        navigate('/')
    }

    function getInitials(name) {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const pending = bookings.filter(b => b.status === 'pending')
    const confirmed = bookings.filter(b => b.status === 'confirmed')
    const total = bookings.length

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <main className="admin-dashboard-page">
            <div className="admin-layout">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                <path d="M20 10 L20 30 M13 17 L20 10 L27 17" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="sidebar-brand">
                            <h1>MindSettler</h1>
                            <span>Admin Console</span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <span className="icon"><Icons.Dashboard /></span>
                            Dashboard
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            <span className="icon"><Icons.Calendar /></span>
                            Appointments
                            {pending.length > 0 && <span className="badge-count">{pending.length}</span>}
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <span className="icon"><Icons.Messages /></span>
                            Messages
                            {contacts.length > 0 && <span className="badge-count">{contacts.length}</span>}
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-info">
                            <div className="user-avatar">AD</div>
                            <div className="user-details">
                                <div className="name">Admin</div>
                                <div className="role">Administrator</div>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            <Icons.Logout />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="admin-main-content">
                    {/* Top Bar */}
                    <header className="admin-topbar">
                        <div className="topbar-left">
                            <h1>
                                {activeTab === 'dashboard' && 'Dashboard'}
                                {activeTab === 'appointments' && 'Appointments'}
                                {activeTab === 'messages' && 'Messages'}
                            </h1>
                            <p>{getCurrentDate()}</p>
                        </div>
                        <div className="topbar-right">
                            <button className="icon-btn">
                                <Icons.Bell />
                                {pending.length > 0 && <span className="notification-dot"></span>}
                            </button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading dashboard data...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <div className="error-icon">
                                <Icons.AlertCircle />
                            </div>
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard View */}
                            {activeTab === 'dashboard' && (
                                <>
                                    {/* Stats Grid */}
                                    <section className="stats-grid">
                                        <div className="stat-card pending">
                                            <div className="stat-header">
                                                <div className="stat-icon">⏳</div>
                                            </div>
                                            <div className="stat-value">{pending.length}</div>
                                            <div className="stat-label">Pending Requests</div>
                                        </div>
                                        <div className="stat-card confirmed">
                                            <div className="stat-header">
                                                <div className="stat-icon">✓</div>
                                            </div>
                                            <div className="stat-value">{confirmed.length}</div>
                                            <div className="stat-label">Confirmed Sessions</div>
                                        </div>
                                        <div className="stat-card messages">
                                            <div className="stat-header">
                                                <div className="stat-icon">💬</div>
                                            </div>
                                            <div className="stat-value">{contacts.length}</div>
                                            <div className="stat-label">Messages</div>
                                        </div>
                                        <div className="stat-card total">
                                            <div className="stat-header">
                                                <div className="stat-icon">📊</div>
                                            </div>
                                            <div className="stat-value">{total}</div>
                                            <div className="stat-label">Total Bookings</div>
                                        </div>
                                    </section>

                                    {/* Content Grid */}
                                    <div className="content-grid">
                                        {/* Pending Panel */}
                                        <div className="panel">
                                            <div className="panel-header">
                                                <div className="panel-title">
                                                    <h2>Pending Appointments</h2>
                                                    <span className="count">{pending.length}</span>
                                                </div>
                                            </div>
                                            <div className="panel-body no-padding">
                                                {pending.length === 0 ? (
                                                    <div className="empty-state">
                                                        <div className="empty-icon">📅</div>
                                                        <h3>No pending requests</h3>
                                                        <p>New appointment requests will appear here</p>
                                                    </div>
                                                ) : (
                                                    <div className="booking-list">
                                                        {pending.slice(0, 5).map(b => (
                                                            <div className="booking-card" key={b._id}>
                                                                <div className="booking-avatar">
                                                                    {getInitials(b.name)}
                                                                </div>
                                                                <div className="booking-info">
                                                                    <div className="booking-name">{b.name}</div>
                                                                    <div className="booking-email">{b.email}</div>
                                                                    <div className="booking-meta">
                                                                        <span><Icons.Calendar /> {b.date}</span>
                                                                        <span><Icons.Clock /> {b.time}</span>
                                                                        {b.mode && (
                                                                            <span className="mode-badge">
                                                                                {b.mode === 'video' ? <Icons.Video /> : <Icons.User />}
                                                                                {b.mode}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="booking-actions">
                                                                    <button
                                                                        className="btn-action confirm"
                                                                        onClick={() => updateBookingStatus(b._id, 'confirmed')}
                                                                        title="Confirm"
                                                                    >
                                                                        <Icons.Check />
                                                                    </button>
                                                                    <button
                                                                        className="btn-action reject"
                                                                        onClick={() => openRejectModal(b._id)}
                                                                        title="Reject"
                                                                    >
                                                                        <Icons.X />
                                                                    </button>
                                                                    <button
                                                                        className="btn-action reschedule"
                                                                        onClick={() => openRescheduleModal(b)}
                                                                        title="Reschedule"
                                                                    >
                                                                        <Icons.CalendarClock />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Confirmed Panel */}
                                        <div className="panel">
                                            <div className="panel-header">
                                                <div className="panel-title">
                                                    <h2>Upcoming Sessions</h2>
                                                    <span className="count">{confirmed.length}</span>
                                                </div>
                                            </div>
                                            <div className="panel-body no-padding">
                                                {confirmed.length === 0 ? (
                                                    <div className="empty-state">
                                                        <div className="empty-icon">✨</div>
                                                        <h3>No confirmed sessions</h3>
                                                        <p>Confirmed appointments will show here</p>
                                                    </div>
                                                ) : (
                                                    <div className="booking-list">
                                                        {confirmed.slice(0, 5).map(b => (
                                                            <div className="booking-card" key={b._id}>
                                                                <div className="booking-avatar">
                                                                    {getInitials(b.name)}
                                                                </div>
                                                                <div className="booking-info">
                                                                    <div className="booking-name">{b.name}</div>
                                                                    <div className="booking-email">{b.email}</div>
                                                                    <div className="booking-meta">
                                                                        <span><Icons.Calendar /> {b.date}</span>
                                                                        <span><Icons.Clock /> {b.time}</span>
                                                                        <span className="status-badge confirmed">
                                                                            <span className="dot"></span>
                                                                            Confirmed
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Messages Panel */}
                                        <div className="panel full-width">
                                            <div className="panel-header">
                                                <div className="panel-title">
                                                    <h2>Recent Messages</h2>
                                                    <span className="count">{contacts.length}</span>
                                                </div>
                                            </div>
                                            <div className="panel-body no-padding">
                                                {contacts.length === 0 ? (
                                                    <div className="empty-state">
                                                        <div className="empty-icon">💬</div>
                                                        <h3>No messages yet</h3>
                                                        <p>Contact form submissions will appear here</p>
                                                    </div>
                                                ) : (
                                                    <div className="booking-list">
                                                        {contacts.slice(0, 3).map(c => (
                                                            <div className="message-card" key={c._id}>
                                                                <div className="message-avatar">
                                                                    {getInitials(c.name)}
                                                                </div>
                                                                <div className="message-content">
                                                                    <div className="message-header">
                                                                        <span className="message-name">{c.name}</span>
                                                                    </div>
                                                                    <div className="message-email">{c.email}</div>
                                                                    <div className="message-text">{c.message}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Appointments View */}
                            {activeTab === 'appointments' && (
                                <div className="content-grid full">
                                    {/* Pending */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Pending Requests</h2>
                                                <span className="count">{pending.length}</span>
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {pending.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">📅</div>
                                                    <h3>No pending requests</h3>
                                                    <p>New appointment requests will appear here</p>
                                                </div>
                                            ) : (
                                                <div className="booking-list">
                                                    {pending.map(b => (
                                                        <div className="booking-card" key={b._id}>
                                                            <div className="booking-avatar">
                                                                {getInitials(b.name)}
                                                            </div>
                                                            <div className="booking-info">
                                                                <div className="booking-name">{b.name}</div>
                                                                <div className="booking-email">{b.email}</div>
                                                                <div className="booking-meta">
                                                                    <span><Icons.Calendar /> {b.date}</span>
                                                                    <span><Icons.Clock /> {b.time}</span>
                                                                    {b.mode && (
                                                                        <span className="mode-badge">
                                                                            {b.mode === 'video' ? <Icons.Video /> : <Icons.User />}
                                                                            {b.mode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="booking-actions">
                                                                <button
                                                                    className="btn-action confirm"
                                                                    onClick={() => updateBookingStatus(b._id, 'confirmed')}
                                                                >
                                                                    <Icons.Check /> Confirm
                                                                </button>
                                                                <button
                                                                    className="btn-action reject"
                                                                    onClick={() => openRejectModal(b._id)}
                                                                >
                                                                    <Icons.X /> Reject
                                                                </button>
                                                                <button
                                                                    className="btn-action reschedule"
                                                                    onClick={() => openRescheduleModal(b)}
                                                                >
                                                                    <Icons.CalendarClock /> Reschedule
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Confirmed */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Confirmed Sessions</h2>
                                                <span className="count">{confirmed.length}</span>
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {confirmed.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">✨</div>
                                                    <h3>No confirmed sessions</h3>
                                                    <p>Confirmed appointments will show here</p>
                                                </div>
                                            ) : (
                                                <div className="booking-list">
                                                    {confirmed.map(b => (
                                                        <div className="booking-card" key={b._id}>
                                                            <div className="booking-avatar">
                                                                {getInitials(b.name)}
                                                            </div>
                                                            <div className="booking-info">
                                                                <div className="booking-name">{b.name}</div>
                                                                <div className="booking-email">{b.email}</div>
                                                                <div className="booking-meta">
                                                                    <span><Icons.Calendar /> {b.date}</span>
                                                                    <span><Icons.Clock /> {b.time}</span>
                                                                    <span className="status-badge confirmed">
                                                                        <span className="dot"></span>
                                                                        Confirmed
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Messages View */}
                            {activeTab === 'messages' && (
                                <div className="content-grid full">
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>All Messages</h2>
                                                <span className="count">{contacts.length}</span>
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {contacts.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">💬</div>
                                                    <h3>No messages yet</h3>
                                                    <p>Contact form submissions will appear here</p>
                                                </div>
                                            ) : (
                                                <div className="booking-list">
                                                    {contacts.map(c => (
                                                        <div className="message-card" key={c._id}>
                                                            <div className="message-avatar">
                                                                {getInitials(c.name)}
                                                            </div>
                                                            <div className="message-content">
                                                                <div className="message-header">
                                                                    <span className="message-name">{c.name}</span>
                                                                </div>
                                                                <div className="message-email">{c.email}</div>
                                                                <div className="message-text">{c.message}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectModal.open && (
                <div className="modal-overlay" onClick={closeRejectModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reject Appointment</h3>
                            <button className="modal-close" onClick={closeRejectModal}>
                                <Icons.X />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Please provide a reason for rejecting this appointment (optional):</p>
                            <div className="form-group-modal">
                                <label>Rejection Reason</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder="e.g., The requested time slot is unavailable..."
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeRejectModal}>
                                Cancel
                            </button>
                            <button className="btn-modal-action danger" onClick={handleReject}>
                                Reject Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleModal.open && (
                <div className="modal-overlay" onClick={closeRescheduleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reschedule Session</h3>
                            <button className="modal-close" onClick={closeRescheduleModal}>
                                <Icons.X />
                            </button>
                        </div>
                        <div className="modal-body">
                            {rescheduleModal.booking && (
                                <div className="modal-booking-info">
                                    <div className="avatar">
                                        {getInitials(rescheduleModal.booking.name)}
                                    </div>
                                    <div className="details">
                                        <div className="name">{rescheduleModal.booking.name}</div>
                                        <div className="datetime">
                                            Current: {rescheduleModal.booking.date} at {rescheduleModal.booking.time}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-group-modal">
                                <label>New Date</label>
                                <input
                                    type="date"
                                    value={rescheduleData.date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => {
                                        setRescheduleData(prev => ({ ...prev, date: e.target.value, time: '' }))
                                        fetchSlotsForDate(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="form-group-modal">
                                <label>New Time</label>
                                <select
                                    value={rescheduleData.time}
                                    onChange={e => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                                    disabled={!rescheduleData.date || loadingSlots}
                                >
                                    <option value="">
                                        {!rescheduleData.date ? 'Select date first' : loadingSlots ? 'Loading...' : 'Select time'}
                                    </option>
                                    {availableSlots.map(slot => (
                                        <option key={slot.time} value={slot.time}>{slot.time}</option>
                                    ))}
                                </select>
                                {rescheduleData.date && !loadingSlots && availableSlots.length === 0 && (
                                    <div className="no-slots-warning">
                                        ⚠️ No available slots for this date
                                    </div>
                                )}
                            </div>

                            <div className="form-group-modal">
                                <label>Message to Client (optional)</label>
                                <textarea
                                    value={rescheduleData.message}
                                    onChange={e => setRescheduleData(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="e.g., Due to scheduling conflicts, we need to move your session..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={closeRescheduleModal}>
                                Cancel
                            </button>
                            <button
                                className="btn-modal-action warning"
                                onClick={handleReschedule}
                                disabled={!rescheduleData.date || !rescheduleData.time}
                            >
                                Send Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default AdminDashboardPage
