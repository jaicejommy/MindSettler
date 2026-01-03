import { useEffect, useState } from 'react'
import API_BASE_URL from '../api'

function AdminDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('mindsettler_admin_token')

  useEffect(() => {
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

    if (token) fetchData()
  }, [token])

  async function updateBookingStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()

    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status: data.booking.status } : b
      )
    )
  }

  function handleLogout() {
    localStorage.removeItem('mindsettler_admin_token')
    window.location.href = '/admin/login'
  }

  const pending = bookings.filter(b => b.status === 'pending')
  const confirmed = bookings.filter(b => b.status === 'confirmed')

  return (
    <main className="page admin-dashboard-page">
      <div className="admin-shell">
        {/* HEADER */}
        <header className="admin-topbar">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Overview of appointments and messages
            </p>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* MAIN */}
        <section className="admin-main">
          {loading && <p>Loading dashboard…</p>}
          {error && <p className="admin-status-error">{error}</p>}

          {!loading && !error && (
            <div className="admin-grid">
              {/* CONFIRMED */}
              <section className="admin-panel">
                <h2>Confirmed appointments</h2>

                {confirmed.length === 0 ? (
                  <p className="muted">No confirmed appointments.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Date & Time</th>
                        <th>Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmed.map(b => (
                        <tr key={b._id}>
                          <td>{b.name}</td>
                          <td>{b.date} {b.time}</td>
                          <td>{b.mode || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* PENDING */}
              <section className="admin-panel">
                <h2>Pending appointments</h2>

                {pending.length === 0 ? (
                  <p className="muted">No pending appointments.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map(b => (
                        <tr key={b._id}>
                          <td>{b.name}</td>
                          <td>{b.date} {b.time}</td>
                          <td>
                            <button
                              className="btn btn-small btn-primary"
                              onClick={() =>
                                updateBookingStatus(b._id, 'confirmed')
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={() =>
                                updateBookingStatus(b._id, 'rejected')
                              }
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              {/* MESSAGES */}
              <section className="admin-panel">
                <h2>Messages</h2>

                {contacts.length === 0 ? (
                  <p className="muted">No messages yet.</p>
                ) : (
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
                          <td>{c.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminDashboardPage
