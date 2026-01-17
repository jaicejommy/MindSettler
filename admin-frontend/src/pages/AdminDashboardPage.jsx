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
    Phone: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    Upload: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    ),
    QrCode: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
            <rect x="18" y="18" width="3" height="3" />
        </svg>
    ),
    DollarSign: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    FileText: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    Tag: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
            <path d="M7 7h.01" />
        </svg>
    ),
    Percent: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    ),
    Trash: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    ),
    ChevronLeft: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    ),
    ChevronRight: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
}

function AdminDashboardPage() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [contacts, setContacts] = useState([])
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [rejectModal, setRejectModal] = useState({ open: false, bookingId: null })
    const [rejectReason, setRejectReason] = useState('')
    const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null })
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', message: '' })
    const [availableSlots, setAvailableSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // QR Code management state
    const [currentQr, setCurrentQr] = useState(null)
    const [qrUploading, setQrUploading] = useState(false)
    const [qrMessage, setQrMessage] = useState('')

    // Pricing management state
    const [pricing, setPricing] = useState([])
    const [pricingLoading, setPricingLoading] = useState(false)
    const [pricingUpdating, setPricingUpdating] = useState(false)
    const [pricingMessage, setPricingMessage] = useState('')

    // Coupon management state
    const [coupons, setCoupons] = useState([])
    const [couponsLoading, setCouponsLoading] = useState(false)
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountAmount: '',
        isPercentage: false,
        description: '',
        maxRedemptions: '',
        expiresAt: '',
        isActive: true,
    })
    const [couponSaving, setCouponSaving] = useState(false)
    const [couponMessage, setCouponMessage] = useState('')

    // Articles management state
    const [articles, setArticles] = useState([])
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [articleForm, setArticleForm] = useState({
        title: '',
        category: 'article',
        coverImage: '',
        excerpt: '',
        content: '',
        isPublished: false,
        tags: ''
    })
    const [editingArticle, setEditingArticle] = useState(null)
    const [articleSaving, setArticleSaving] = useState(false)
    const [articleMessage, setArticleMessage] = useState('')

    // Email and call modal state
    const [emailModal, setEmailModal] = useState({ open: false, contact: null })
    const [callMessage, setCallMessage] = useState('')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    // Calendar state
    const [calendarDate, setCalendarDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)

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

                const [bRes, cRes, qrRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/bookings`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/contact`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/settings/qr`),
                ])

                if (!bRes.ok || !cRes.ok) {
                    throw new Error('Failed to load admin data')
                }

                const [bData, cData, qrData] = await Promise.all([
                    bRes.json(),
                    cRes.json(),
                    qrRes.json(),
                ])

                setBookings(bData.bookings || [])
                setContacts(cData.contacts || [])
                setUnreadMessagesCount(cData.unreadCount || 0)
                if (qrData.qrUrl) {
                    setCurrentQr(`${API_BASE_URL.replace('/api', '')}${qrData.qrUrl}`)
                }

                // Fetch pricing
                fetchPricing()
                // Fetch coupons
                fetchCoupons()
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, navigate])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Mark all messages as read when viewing the messages tab
    useEffect(() => {
        if (activeTab === 'messages' && unreadMessagesCount > 0) {
            markMessagesAsRead()
        }
    }, [activeTab])

    async function markMessagesAsRead() {
        try {
            const res = await fetch(`${API_BASE_URL}/contact/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                setUnreadMessagesCount(0)
            }
        } catch (err) {
            console.error('Failed to mark messages as read', err)
        }
    }

    const handleEmailClick = (contact) => {
        setEmailModal({ open: true, contact })
    }

    const handleEmailOption = (option) => {
        const contact = emailModal.contact
        const subject = encodeURIComponent('Re: Your Message from MindSettler')
        const body = encodeURIComponent('Thank you for contacting us. We appreciate your message and will get back to you shortly.')

        if (option === 'gmail') {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${subject}&body=${body}`, '_blank')
        } else if (option === 'mailto') {
            window.location.href = `mailto:${contact.email}?subject=Re: Your Message from MindSettler&body=Thank you for contacting us. We appreciate your message and will get back to you shortly.`
        }
        setEmailModal({ open: false, contact: null })
    }

    const handleCallClick = (phone) => {
        if (isMobile) {
            window.location.href = `tel:${phone}`
        } else {
            setCallMessage('Phone calls can only be made from mobile devices.')
            setTimeout(() => setCallMessage(''), 4000)
        }
    }

    async function fetchPricing() {
        try {
            setPricingLoading(true)
            const res = await fetch(`${API_BASE_URL}/pricing`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok && data.prices) {
                setPricing(data.prices)
            }
        } catch (err) {
            console.error('Failed to load pricing', err)
        } finally {
            setPricingLoading(false)
        }
    }

    async function handlePricingUpdate() {
        try {
            setPricingUpdating(true)
            setPricingMessage('')
            const res = await fetch(`${API_BASE_URL}/pricing`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prices: pricing }),
            })
            const data = await res.json()
            if (res.ok) {
                setPricingMessage('Pricing updated successfully!')
                if (data.prices) {
                    setPricing(data.prices)
                }
            } else {
                setPricingMessage(data.message || 'Failed to update pricing')
            }
        } catch (err) {
            console.error('Failed to update pricing', err)
            setPricingMessage('Failed to update pricing')
        } finally {
            setPricingUpdating(false)
            setTimeout(() => setPricingMessage(''), 3000)
        }
    }

    async function fetchCoupons() {
        try {
            setCouponsLoading(true)
            const res = await fetch(`${API_BASE_URL}/coupons`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setCoupons(data.coupons || [])
        } catch (err) {
            console.error('Failed to load coupons', err)
        } finally {
            setCouponsLoading(false)
        }
    }

    async function handleCreateCoupon(e) {
        e.preventDefault()
        try {
            setCouponSaving(true)
            setCouponMessage('')
            const res = await fetch(`${API_BASE_URL}/coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newCoupon,
                    discountAmount: Number(newCoupon.discountAmount) || 0,
                    maxRedemptions: Number(newCoupon.maxRedemptions) || 0,
                    expiresAt: newCoupon.expiresAt || null,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setCouponMessage('Coupon created successfully!')
                setNewCoupon({
                    code: '',
                    discountAmount: '',
                    isPercentage: false,
                    description: '',
                    maxRedemptions: '',
                    expiresAt: '',
                    isActive: true,
                })
                fetchCoupons()
            } else {
                setCouponMessage(data.message || 'Failed to create coupon')
            }
        } catch (err) {
            console.error('Failed to create coupon', err)
            setCouponMessage('Failed to create coupon')
        } finally {
            setCouponSaving(false)
            setTimeout(() => setCouponMessage(''), 3000)
        }
    }

    async function handleDeleteCoupon(id) {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return
        try {
            const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                setCouponMessage('Coupon deleted successfully!')
                fetchCoupons()
            } else {
                const data = await res.json()
                setCouponMessage(data.message || 'Failed to delete coupon')
            }
        } catch (err) {
            console.error('Failed to delete coupon', err)
            setCouponMessage('Failed to delete coupon')
        } finally {
            setTimeout(() => setCouponMessage(''), 3000)
        }
    }

    // Article management functions
    async function fetchArticles() {
        try {
            setArticlesLoading(true)
            const res = await fetch(`${API_BASE_URL}/admin/articles`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setArticles(data.articles || [])
        } catch (err) {
            console.error('Failed to load articles', err)
        } finally {
            setArticlesLoading(false)
        }
    }

    async function handleSaveArticle(e) {
        e.preventDefault()
        try {
            setArticleSaving(true)
            setArticleMessage('')

            const isEditing = !!editingArticle
            const url = isEditing
                ? `${API_BASE_URL}/admin/articles/${editingArticle._id}`
                : `${API_BASE_URL}/admin/articles`

            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...articleForm,
                    tags: articleForm.tags ? articleForm.tags.split(',').map(t => t.trim()) : []
                }),
            })

            const data = await res.json()
            if (res.ok) {
                setArticleMessage(isEditing ? 'Article updated!' : 'Article created!')
                resetArticleForm()
                fetchArticles()
            } else {
                setArticleMessage(data.message || 'Failed to save article')
            }
        } catch (err) {
            console.error('Failed to save article', err)
            setArticleMessage('Failed to save article')
        } finally {
            setArticleSaving(false)
            setTimeout(() => setArticleMessage(''), 3000)
        }
    }

    async function handleDeleteArticle(id) {
        if (!window.confirm('Are you sure you want to delete this article?')) return
        try {
            const res = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                fetchArticles()
            }
        } catch (err) {
            console.error('Failed to delete article', err)
        }
    }

    function handleEditArticle(article) {
        setEditingArticle(article)
        setArticleForm({
            title: article.title || '',
            category: article.category || 'article',
            coverImage: article.coverImage || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            isPublished: article.isPublished || false,
            tags: article.tags ? article.tags.join(', ') : ''
        })
    }

    function resetArticleForm() {
        setEditingArticle(null)
        setArticleForm({
            title: '',
            category: 'article',
            coverImage: '',
            excerpt: '',
            content: '',
            isPublished: false,
            tags: ''
        })
    }

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

    // QR Code upload handler
    async function handleQrUpload(e) {
        const file = e.target.files?.[0]
        if (!file) return

        setQrUploading(true)
        setQrMessage('')

        try {
            const formData = new FormData()
            formData.append('qr', file)

            const res = await fetch(`${API_BASE_URL}/settings/qr`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await res.json()

            if (res.ok) {
                setCurrentQr(`${API_BASE_URL.replace('/api', '')}${data.qrUrl}`)
                setQrMessage('QR code updated successfully!')
            } else {
                setQrMessage(data.message || 'Failed to upload QR code')
            }
        } catch (err) {
            console.error('QR upload failed:', err)
            setQrMessage('Failed to upload QR code')
        } finally {
            setQrUploading(false)
            // Clear message after 3 seconds
            setTimeout(() => setQrMessage(''), 3000)
        }
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

    // Calendar helper functions
    const getCalendarDays = () => {
        const year = calendarDate.getFullYear()
        const month = calendarDate.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startPadding = firstDay.getDay()
        const daysInMonth = lastDay.getDate()

        const days = []
        // Add padding for days before the 1st
        for (let i = 0; i < startPadding; i++) {
            days.push(null)
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }
        return days
    }

    const formatCalendarDate = (day) => {
        if (!day) return null
        const year = calendarDate.getFullYear()
        const month = String(calendarDate.getMonth() + 1).padStart(2, '0')
        const dayStr = String(day).padStart(2, '0')
        return `${year}-${month}-${dayStr}`
    }

    const getBookingsForDate = (dateStr) => {
        return bookings.filter(b => b.date === dateStr)
    }

    const getCalendarMonthLabel = () => {
        return calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const prevMonth = () => {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
    }

    const isToday = (day) => {
        if (!day) return false
        const today = new Date()
        return (
            day === today.getDate() &&
            calendarDate.getMonth() === today.getMonth() &&
            calendarDate.getFullYear() === today.getFullYear()
        )
    }

    return (
        <main className="admin-dashboard-page">
            <div className="admin-layout">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
                )}

                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            <img src="/Mindsettler_logo_rmbg.png" alt="MindSettler" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
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
                            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                            onClick={() => setActiveTab('calendar')}
                        >
                            <span className="icon"><Icons.CalendarClock /></span>
                            Calendar
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <span className="icon"><Icons.Messages /></span>
                            Messages
                            {unreadMessagesCount > 0 && <span className="badge-count">{unreadMessagesCount}</span>}
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pricing')}
                        >
                            <span className="icon"><Icons.DollarSign /></span>
                            Pricing
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
                            onClick={() => setActiveTab('coupons')}
                        >
                            <span className="icon"><Icons.Tag /></span>
                            Coupons
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'payment-qr' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment-qr')}
                        >
                            <span className="icon"><Icons.QrCode /></span>
                            Payment QR
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'articles' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('articles'); fetchArticles(); }}
                        >
                            <span className="icon"><Icons.FileText /></span>
                            Articles
                        </button>
                        <button
                            className="nav-item logout-nav-item"
                            onClick={handleLogout}
                        >
                            <span className="icon"><Icons.Logout /></span>
                            Sign Out
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
                    </div>
                </aside>

                {/* Main Content */}
                <div className="admin-main-content">
                    {/* Top Bar */}
                    <header className="admin-topbar">
                        <div className="topbar-left">
                            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <Icons.Menu />
                            </button>
                        </div>
                        <div className="topbar-right">
                            <button
                                className="mobile-logout-btn"
                                onClick={handleLogout}
                                title="Sign Out"
                            >
                                <Icons.Logout />
                            </button>
                            <div className="mobile-admin-profile">
                                <div className="user-avatar">AD</div>
                            </div>
                            <div className="user-details">
                                <div className="name">Admin</div>
                                <div className="role">Administrator</div>
                            </div>
                        </div>
                    </header>

                    {/* Page Header */}
                    <div className="page-header">
                        <h1>
                            {activeTab === 'dashboard' && 'Dashboard'}
                            {activeTab === 'appointments' && 'Appointments'}
                            {activeTab === 'calendar' && 'Appointment Calendar'}
                            {activeTab === 'messages' && 'Messages'}
                            {activeTab === 'pricing' && 'Session Pricing'}
                            {activeTab === 'coupons' && 'Discount Coupons'}
                            {activeTab === 'payment-qr' && 'Payment QR Code'}
                            {activeTab === 'articles' && 'Content Management'}
                        </h1>
                        <p>{getCurrentDate()}</p>
                    </div>

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
                                                                    {c.phone && <div className="message-phone">{c.phone}</div>}
                                                                    <div className="message-text">{c.message}</div>
                                                                </div>
                                                                <div className="message-actions">
                                                                    <button
                                                                        onClick={() => handleEmailClick(c)}
                                                                        className="action-btn email-btn"
                                                                        title="Reply via Email"
                                                                    >
                                                                        <Icons.Mail />
                                                                        Reply
                                                                    </button>
                                                                    {c.phone && isMobile && (
                                                                        <button
                                                                            onClick={() => handleCallClick(c.phone)}
                                                                            className="action-btn call-btn"
                                                                            title="Call User"
                                                                        >
                                                                            <Icons.Phone />
                                                                            Call
                                                                        </button>
                                                                    )}
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

                            {/* Calendar View */}
                            {activeTab === 'calendar' && (
                                <div className="content-grid full" style={{ gap: '1.5rem' }}>
                                    {/* Calendar Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Monthly Overview</h2>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <button
                                                    onClick={prevMonth}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Icons.ChevronLeft />
                                                </button>
                                                <span style={{ fontWeight: 600, fontSize: '1.1rem', minWidth: '160px', textAlign: 'center' }}>
                                                    {getCalendarMonthLabel()}
                                                </span>
                                                <button
                                                    onClick={nextMonth}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Icons.ChevronRight />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            {/* Calendar Grid */}
                                            <div className="calendar-grid" style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(7, 1fr)',
                                                gap: '4px',
                                            }}>
                                                {/* Day Headers */}
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                    <div key={day} style={{
                                                        padding: '0.75rem 0.5rem',
                                                        textAlign: 'center',
                                                        fontWeight: 600,
                                                        color: '#666',
                                                        fontSize: '0.85rem',
                                                    }}>
                                                        {day}
                                                    </div>
                                                ))}
                                                {/* Calendar Days */}
                                                {getCalendarDays().map((day, idx) => {
                                                    const dateStr = formatCalendarDate(day)
                                                    const dayBookings = dateStr ? getBookingsForDate(dateStr) : []
                                                    const pendingCount = dayBookings.filter(b => b.status === 'pending').length
                                                    const confirmedCount = dayBookings.filter(b => b.status === 'confirmed').length
                                                    const isSelected = selectedDate === dateStr

                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => day && setSelectedDate(dateStr)}
                                                            style={{
                                                                padding: '0.75rem 0.5rem',
                                                                minHeight: '70px',
                                                                textAlign: 'center',
                                                                borderRadius: '10px',
                                                                cursor: day ? 'pointer' : 'default',
                                                                background: isSelected
                                                                    ? 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)'
                                                                    : isToday(day)
                                                                        ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                                                                        : day
                                                                            ? '#fff'
                                                                            : 'transparent',
                                                                border: isToday(day) && !isSelected ? '2px solid #DD1764' : '1px solid #eee',
                                                                color: isSelected ? '#fff' : '#333',
                                                                transition: 'all 0.2s',
                                                            }}
                                                        >
                                                            {day && (
                                                                <>
                                                                    <div style={{ fontWeight: isToday(day) || isSelected ? 700 : 500, fontSize: '1rem' }}>
                                                                        {day}
                                                                    </div>
                                                                    {dayBookings.length > 0 && (
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            gap: '4px',
                                                                            marginTop: '6px',
                                                                        }}>
                                                                            {pendingCount > 0 && (
                                                                                <span style={{
                                                                                    width: '8px',
                                                                                    height: '8px',
                                                                                    borderRadius: '50%',
                                                                                    background: isSelected ? '#fff' : '#f59e0b',
                                                                                    opacity: isSelected ? 0.8 : 1,
                                                                                }}></span>
                                                                            )}
                                                                            {confirmedCount > 0 && (
                                                                                <span style={{
                                                                                    width: '8px',
                                                                                    height: '8px',
                                                                                    borderRadius: '50%',
                                                                                    background: isSelected ? '#fff' : '#22c55e',
                                                                                    opacity: isSelected ? 0.8 : 1,
                                                                                }}></span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {/* Legend */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '1.5rem',
                                                marginTop: '1.5rem',
                                                justifyContent: 'center',
                                                fontSize: '0.85rem',
                                                color: '#666',
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                                                    Pending
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                                                    Confirmed
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Date Appointments Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>
                                                    {selectedDate
                                                        ? `Appointments on ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                                                        : 'Select a Date'}
                                                </h2>
                                                {selectedDate && (
                                                    <span className="count">{getBookingsForDate(selectedDate).length}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {!selectedDate ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">📅</div>
                                                    <h3>Click on a date</h3>
                                                    <p>Select a date from the calendar to view appointments</p>
                                                </div>
                                            ) : getBookingsForDate(selectedDate).length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">✨</div>
                                                    <h3>No appointments</h3>
                                                    <p>No appointments scheduled for this date</p>
                                                </div>
                                            ) : (
                                                <div className="booking-list">
                                                    {getBookingsForDate(selectedDate).map(b => (
                                                        <div className="booking-card" key={b._id}>
                                                            <div className="booking-avatar">
                                                                {getInitials(b.name)}
                                                            </div>
                                                            <div className="booking-info">
                                                                <div className="booking-name">{b.name}</div>
                                                                <div className="booking-email">{b.email}</div>
                                                                <div className="booking-meta">
                                                                    <span><Icons.Clock /> {b.time}</span>
                                                                    {b.mode && (
                                                                        <span className="mode-badge">
                                                                            {b.mode === 'video' ? <Icons.Video /> : <Icons.User />}
                                                                            {b.mode}
                                                                        </span>
                                                                    )}
                                                                    <span className={`status-badge ${b.status}`}>
                                                                        <span className="dot"></span>
                                                                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {b.status === 'pending' && (
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
                                                                </div>
                                                            )}
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
                                                                {c.phone && <div className="message-phone">{c.phone}</div>}
                                                                <div className="message-text">{c.message}</div>
                                                            </div>
                                                            <div className="message-actions">
                                                                <button
                                                                    onClick={() => handleEmailClick(c)}
                                                                    className="action-btn email-btn"
                                                                    title="Reply via Email"
                                                                >
                                                                    <Icons.Mail />
                                                                    Reply
                                                                </button>
                                                                {c.phone && isMobile && (
                                                                    <button
                                                                        onClick={() => handleCallClick(c.phone)}
                                                                        className="action-btn call-btn"
                                                                        title="Call User"
                                                                    >
                                                                        <Icons.Phone />
                                                                        Call
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment QR View */}
                            {activeTab === 'payment-qr' && (
                                <div className="content-grid full">
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Payment QR Code</h2>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="settings-section">
                                                <p style={{ marginBottom: '1rem', color: '#666' }}>
                                                    Upload or change the QR code displayed on the booking page for payment.
                                                </p>

                                                <div className="qr-preview" style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '1.5rem',
                                                    padding: '2rem',
                                                    background: '#f8f9fa',
                                                    borderRadius: '12px',
                                                    marginBottom: '1.5rem'
                                                }}>
                                                    {currentQr ? (
                                                        <img
                                                            src={currentQr}
                                                            alt="Current Payment QR"
                                                            style={{
                                                                maxWidth: '250px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #ddd',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '200px',
                                                            height: '200px',
                                                            background: '#e9ecef',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#6c757d',
                                                            flexDirection: 'column',
                                                            gap: '0.5rem'
                                                        }}>
                                                            <Icons.Upload />
                                                            <span>No QR uploaded</span>
                                                        </div>
                                                    )}

                                                    <div style={{ textAlign: 'center' }}>
                                                        <label
                                                            htmlFor="qr-upload"
                                                            className="btn-modal-action"
                                                            style={{
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.75rem 1.5rem',
                                                                background: 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)',
                                                                color: 'white',
                                                                borderRadius: '8px',
                                                                fontWeight: '600',
                                                                opacity: qrUploading ? 0.7 : 1
                                                            }}
                                                        >
                                                            <Icons.Upload />
                                                            {qrUploading ? 'Uploading...' : (currentQr ? 'Change QR Code' : 'Upload QR Code')}
                                                        </label>
                                                        <input
                                                            id="qr-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleQrUpload}
                                                            disabled={qrUploading}
                                                            style={{ display: 'none' }}
                                                        />

                                                        {qrMessage && (
                                                            <p style={{
                                                                marginTop: '1rem',
                                                                color: qrMessage.includes('success') ? '#28a745' : '#dc3545',
                                                                fontWeight: '500'
                                                            }}>
                                                                {qrMessage}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{
                                                    padding: '1rem',
                                                    background: '#fff3cd',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ffc107'
                                                }}>
                                                    <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                                                        <strong>Note:</strong> This QR code will be shown to users when they book a session and need to make a payment. Make sure it's a valid UPI payment QR code.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pricing View */}
                            {activeTab === 'pricing' && (
                                <div className="content-grid full">
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Session Pricing</h2>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
                                                Set the price for each therapy session type. Changes are reflected on the booking page immediately after saving.
                                            </p>

                                            {pricingLoading ? (
                                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <div className="loading-spinner"></div>
                                                    <p style={{ marginTop: '1rem', color: '#888' }}>Loading pricing...</p>
                                                </div>
                                            ) : (
                                                <div className="pricing-grid" style={{ display: 'grid', gap: '0.75rem' }}>
                                                    {pricing.map((p, index) => (
                                                        <div key={p.sessionType} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '1rem',
                                                            padding: '1rem 1.25rem',
                                                            background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
                                                            borderRadius: '12px',
                                                            border: '1px solid #eee',
                                                            transition: 'box-shadow 0.2s, border-color 0.2s',
                                                        }}>
                                                            <div style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '10px',
                                                                background: 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: '1rem',
                                                                fontWeight: 700,
                                                                flexShrink: 0,
                                                            }}>
                                                                {p.label.charAt(0)}
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#333' }}>{p.label}</div>
                                                                <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.sessionType}</div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3F2965' }}>₹</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={p.price}
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value, 10) || 0
                                                                        setPricing((prev) =>
                                                                            prev.map((item, i) =>
                                                                                i === index ? { ...item, price: val } : item
                                                                            )
                                                                        )
                                                                    }}
                                                                    style={{
                                                                        width: '100px',
                                                                        padding: '0.6rem 0.75rem',
                                                                        borderRadius: '8px',
                                                                        border: '2px solid #e0e0e0',
                                                                        fontSize: '1rem',
                                                                        fontWeight: 600,
                                                                        textAlign: 'right',
                                                                        transition: 'border-color 0.2s',
                                                                        outline: 'none',
                                                                    }}
                                                                    onFocus={(e) => e.target.style.borderColor = '#DD1764'}
                                                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={handlePricingUpdate}
                                                    disabled={pricingUpdating}
                                                    style={{
                                                        cursor: pricingUpdating ? 'not-allowed' : 'pointer',
                                                        padding: '0.85rem 2rem',
                                                        background: 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)',
                                                        color: 'white',
                                                        borderRadius: '10px',
                                                        fontWeight: '600',
                                                        border: 'none',
                                                        fontSize: '0.95rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        boxShadow: '0 4px 15px rgba(221, 23, 100, 0.3)',
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(221, 23, 100, 0.4)' }}
                                                    onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(221, 23, 100, 0.3)' }}
                                                >
                                                    {pricingUpdating ? 'Saving...' : 'Save All Prices'}
                                                </button>
                                                {pricingMessage && (
                                                    <span style={{
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '8px',
                                                        background: pricingMessage.includes('success') ? '#d4edda' : '#f8d7da',
                                                        color: pricingMessage.includes('success') ? '#155724' : '#721c24',
                                                        fontWeight: 500,
                                                        fontSize: '0.9rem',
                                                    }}>
                                                        {pricingMessage.includes('success') ? <Icons.Check /> : <Icons.X />}{pricingMessage}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Coupons View */}
                            {activeTab === 'coupons' && (
                                <div className="content-grid full" style={{ gap: '1.5rem' }}>
                                    {/* Create Coupon Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Create New Coupon</h2>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <form onSubmit={handleCreateCoupon} style={{ display: 'grid', gap: '1.25rem', maxWidth: '700px' }}>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: '1rem'
                                                }}>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#333' }}>Coupon Code *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newCoupon.code}
                                                            onChange={(e) => setNewCoupon((c) => ({ ...c, code: e.target.value }))}
                                                            placeholder="e.g. Happy20"
                                                            style={{
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e0e0e0',
                                                                fontSize: '1rem',
                                                                fontWeight: 600,
                                                                letterSpacing: '1px',
                                                                width: '100%',
                                                                boxSizing: 'border-box',
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#333' }}>Discount Amount *</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                required
                                                                value={newCoupon.discountAmount}
                                                                onChange={(e) => setNewCoupon((c) => ({ ...c, discountAmount: e.target.value }))}
                                                                placeholder="100"
                                                                style={{
                                                                    padding: '0.75rem 1rem',
                                                                    borderRadius: '8px',
                                                                    border: '2px solid #e0e0e0',
                                                                    fontSize: '1rem',
                                                                    flex: 1,
                                                                    width: '100%',
                                                                    boxSizing: 'border-box',
                                                                }}
                                                            />
                                                            <label
                                                                title="Click to toggle percentage discount"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.35rem',
                                                                    padding: '0.5rem 0.75rem',
                                                                    background: newCoupon.isPercentage
                                                                        ? 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)'
                                                                        : 'linear-gradient(135deg, #e8e4f0 0%, #f5e6f0 100%)',
                                                                    color: newCoupon.isPercentage ? '#fff' : '#3F2965',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.9rem',
                                                                    transition: 'all 0.2s',
                                                                    whiteSpace: 'nowrap',
                                                                    border: newCoupon.isPercentage ? 'none' : '2px dashed #DD1764',
                                                                    boxShadow: newCoupon.isPercentage
                                                                        ? '0 4px 12px rgba(221, 23, 100, 0.3)'
                                                                        : '0 2px 8px rgba(63, 41, 101, 0.15)',
                                                                }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={newCoupon.isPercentage}
                                                                    onChange={(e) => setNewCoupon((c) => ({ ...c, isPercentage: e.target.checked }))}
                                                                    style={{ display: 'none' }}
                                                                />
                                                                <Icons.Percent />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group-modal">
                                                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#333' }}>Description (optional)</label>
                                                    <input
                                                        type="text"
                                                        value={newCoupon.description}
                                                        onChange={(e) => setNewCoupon((c) => ({ ...c, description: e.target.value }))}
                                                        placeholder="e.g. New user discount, Festival offer"
                                                        style={{
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: '8px',
                                                            border: '2px solid #e0e0e0',
                                                            fontSize: '0.95rem',
                                                            width: '100%',
                                                            boxSizing: 'border-box',
                                                        }}
                                                    />
                                                </div>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                    gap: '1rem'
                                                }}>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#333' }}>Max Redemptions</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={newCoupon.maxRedemptions}
                                                            onChange={(e) => setNewCoupon((c) => ({ ...c, maxRedemptions: e.target.value }))}
                                                            placeholder="0 = unlimited"
                                                            style={{
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e0e0e0',
                                                                fontSize: '0.95rem',
                                                                width: '100%',
                                                                boxSizing: 'border-box',
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block', color: '#333' }}>Expires On</label>
                                                        <input
                                                            type="date"
                                                            value={newCoupon.expiresAt}
                                                            onChange={(e) => setNewCoupon((c) => ({ ...c, expiresAt: e.target.value }))}
                                                            style={{
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: '8px',
                                                                border: '2px solid #e0e0e0',
                                                                fontSize: '0.95rem',
                                                                width: '100%',
                                                                boxSizing: 'border-box',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: '1rem',
                                                    marginTop: '0.5rem',
                                                }}>
                                                    <label style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={newCoupon.isActive}
                                                            onChange={(e) => setNewCoupon((c) => ({ ...c, isActive: e.target.checked }))}
                                                            style={{ width: '18px', height: '18px', accentColor: '#DD1764' }}
                                                        />
                                                        <span style={{ color: newCoupon.isActive ? '#28a745' : '#888' }}>
                                                            {newCoupon.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </label>
                                                    <button
                                                        type="submit"
                                                        disabled={couponSaving}
                                                        style={{
                                                            cursor: couponSaving ? 'not-allowed' : 'pointer',
                                                            padding: '0.85rem 2rem',
                                                            background: 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)',
                                                            color: 'white',
                                                            borderRadius: '10px',
                                                            fontWeight: '600',
                                                            border: 'none',
                                                            fontSize: '0.95rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            boxShadow: '0 4px 15px rgba(221, 23, 100, 0.3)',
                                                        }}
                                                    >
                                                        <Icons.Tag /> {couponSaving ? 'Creating...' : 'Create Coupon'}
                                                    </button>
                                                </div>
                                                {couponMessage && (
                                                    <div style={{
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '8px',
                                                        background: couponMessage.includes('success') ? '#d4edda' : '#f8d7da',
                                                        color: couponMessage.includes('success') ? '#155724' : '#721c24',
                                                        fontWeight: 500,
                                                        fontSize: '0.9rem',
                                                    }}>
                                                        {couponMessage.includes('success') ? <Icons.Check /> : <Icons.X />}{couponMessage}
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>

                                    {/* Existing Coupons Panel */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>Existing Coupons</h2>
                                                <span className="count">{coupons.length}</span>
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {couponsLoading ? (
                                                <div className="empty-state">
                                                    <p>Loading coupons...</p>
                                                </div>
                                            ) : coupons.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon"><Icons.Tag /></div>
                                                    <h3>No coupons yet</h3>
                                                    <p>Create a coupon above</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
                                                    {coupons.map((c) => (
                                                        <div key={c._id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '1rem',
                                                            padding: '1rem 1.25rem',
                                                            background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                                            borderRadius: '12px',
                                                            border: c.isActive ? '2px solid #28a74533' : '2px solid #dc354533',
                                                            transition: 'box-shadow 0.2s',
                                                        }}>
                                                            <div style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '12px',
                                                                background: c.isActive
                                                                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                                                                    : 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: '1.25rem',
                                                                flexShrink: 0,
                                                            }}>
                                                                <Icons.Tag />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                    <span style={{
                                                                        fontWeight: 700,
                                                                        fontSize: '1.1rem',
                                                                        color: '#333',
                                                                        letterSpacing: '0.5px',
                                                                    }}>{c.code}</span>
                                                                    <span style={{
                                                                        background: c.isActive ? '#d4edda' : '#f8d7da',
                                                                        color: c.isActive ? '#155724' : '#721c24',
                                                                        padding: '0.25rem 0.6rem',
                                                                        borderRadius: '20px',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 600,
                                                                    }}>
                                                                        {c.isActive ? '● Active' : '○ Inactive'}
                                                                    </span>
                                                                </div>
                                                                {c.description && (
                                                                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.35rem' }}>
                                                                        {c.description}
                                                                    </div>
                                                                )}
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '1rem',
                                                                    marginTop: '0.5rem',
                                                                    flexWrap: 'wrap',
                                                                    fontSize: '0.8rem',
                                                                    color: '#888',
                                                                }}>
                                                                    <span>📊 Used: {c.redeemedCount || 0}{c.maxRedemptions ? `/${c.maxRedemptions}` : ''}</span>
                                                                    {c.expiresAt && <span>📅 Expires: {new Date(c.expiresAt).toLocaleDateString()}</span>}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                textAlign: 'right',
                                                                padding: '0.5rem 1rem',
                                                                background: c.isPercentage
                                                                    ? 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)'
                                                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                borderRadius: '10px',
                                                                color: 'white',
                                                                flexShrink: 0,
                                                            }}>
                                                                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                                                    {c.isPercentage ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
                                                                </div>
                                                                <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                                                                    {c.isPercentage ? 'OFF' : 'FLAT'}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteCoupon(c._id)}
                                                                title="Delete Coupon"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    padding: '0.6rem',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: 'white',
                                                                    flexShrink: 0,
                                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                                }}
                                                                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.1)'; e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)' }}
                                                                onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
                                                            >
                                                                <Icons.Trash />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Articles Tab */}
                            {activeTab === 'articles' && (
                                <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    {/* Create/Edit Article Form */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                                            </div>
                                            {editingArticle && (
                                                <button onClick={resetArticleForm} style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#f0f0f0',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="panel-body">
                                            <form onSubmit={handleSaveArticle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Title *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={articleForm.title}
                                                            onChange={e => setArticleForm(f => ({ ...f, title: e.target.value }))}
                                                            placeholder="Article title..."
                                                            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box' }}
                                                        />
                                                    </div>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Category</label>
                                                        <select
                                                            value={articleForm.category}
                                                            onChange={e => setArticleForm(f => ({ ...f, category: e.target.value }))}
                                                            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box' }}
                                                        >
                                                            <option value="article">Article</option>
                                                            <option value="blog">Blog Post</option>
                                                            <option value="video">Video</option>
                                                            <option value="exercise">Exercise</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group-modal">
                                                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Cover Image URL</label>
                                                    <input
                                                        type="text"
                                                        value={articleForm.coverImage}
                                                        onChange={e => setArticleForm(f => ({ ...f, coverImage: e.target.value }))}
                                                        placeholder="https://example.com/image.jpg"
                                                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box' }}
                                                    />
                                                </div>
                                                <div className="form-group-modal">
                                                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Excerpt *</label>
                                                    <textarea
                                                        required
                                                        value={articleForm.excerpt}
                                                        onChange={e => setArticleForm(f => ({ ...f, excerpt: e.target.value }))}
                                                        placeholder="Brief description for card preview..."
                                                        rows={2}
                                                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                                                    />
                                                </div>
                                                <div className="form-group-modal">
                                                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Content * (Markdown supported)</label>
                                                    <textarea
                                                        required
                                                        value={articleForm.content}
                                                        onChange={e => setArticleForm(f => ({ ...f, content: e.target.value }))}
                                                        placeholder="Write your article content here... Use **bold**, *italic*, ## headings, etc."
                                                        rows={10}
                                                        style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <div className="form-group-modal">
                                                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Tags (comma-separated)</label>
                                                        <input
                                                            type="text"
                                                            value={articleForm.tags}
                                                            onChange={e => setArticleForm(f => ({ ...f, tags: e.target.value }))}
                                                            placeholder="mental-health, anxiety, wellness"
                                                            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0', width: '100%', boxSizing: 'border-box' }}
                                                        />
                                                    </div>
                                                    <div className="form-group-modal" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                                                        <input
                                                            type="checkbox"
                                                            id="isPublished"
                                                            checked={articleForm.isPublished}
                                                            onChange={e => setArticleForm(f => ({ ...f, isPublished: e.target.checked }))}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                        <label htmlFor="isPublished" style={{ fontWeight: 600, cursor: 'pointer' }}>
                                                            Publish immediately
                                                        </label>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                    {articleMessage && (
                                                        <span style={{ padding: '0.75rem', color: articleMessage.includes('success') || articleMessage.includes('created') || articleMessage.includes('updated') ? '#28a745' : '#dc3545' }}>
                                                            {articleMessage}
                                                        </span>
                                                    )}
                                                    <button
                                                        type="submit"
                                                        disabled={articleSaving}
                                                        style={{
                                                            padding: '0.75rem 2rem',
                                                            background: 'linear-gradient(135deg, #3F2965 0%, #DD1764 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            cursor: articleSaving ? 'not-allowed' : 'pointer',
                                                            opacity: articleSaving ? 0.7 : 1
                                                        }}
                                                    >
                                                        {articleSaving ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Articles List */}
                                    <div className="panel">
                                        <div className="panel-header">
                                            <div className="panel-title">
                                                <h2>All Articles</h2>
                                                <span className="count">{articles.length}</span>
                                            </div>
                                        </div>
                                        <div className="panel-body no-padding">
                                            {articlesLoading ? (
                                                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading articles...</div>
                                            ) : articles.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-icon">📝</div>
                                                    <h3>No articles yet</h3>
                                                    <p>Create your first article above</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    {articles.map(article => (
                                                        <div key={article._id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '1rem',
                                                            padding: '1rem 1.25rem',
                                                            borderBottom: '1px solid #f0f0f0',
                                                        }}>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                    <span style={{ fontWeight: 600, color: '#333' }}>{article.title}</span>
                                                                    <span style={{
                                                                        padding: '0.15rem 0.5rem',
                                                                        borderRadius: '12px',
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 600,
                                                                        background: article.isPublished ? '#d4edda' : '#fff3cd',
                                                                        color: article.isPublished ? '#155724' : '#856404'
                                                                    }}>
                                                                        {article.isPublished ? 'Published' : 'Draft'}
                                                                    </span>
                                                                    <span style={{
                                                                        padding: '0.15rem 0.5rem',
                                                                        borderRadius: '12px',
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 500,
                                                                        background: '#f0f0f0',
                                                                        color: '#666'
                                                                    }}>
                                                                        {article.category}
                                                                    </span>
                                                                </div>
                                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{article.excerpt}</div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button
                                                                    onClick={() => handleEditArticle(article)}
                                                                    style={{
                                                                        padding: '0.5rem 1rem',
                                                                        background: '#3F2965',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteArticle(article._id)}
                                                                    style={{
                                                                        padding: '0.5rem 1rem',
                                                                        background: '#dc3545',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
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

            {/* Email Modal */}
            {emailModal.open && emailModal.contact && (
                <div className="modal-overlay" onClick={() => setEmailModal({ open: false, contact: null })}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Choose Email Service</h3>
                            <button className="modal-close" onClick={() => setEmailModal({ open: false, contact: null })}>
                                <Icons.X />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                                Choose how to reply to <strong>{emailModal.contact.name}</strong> ({emailModal.contact.email})
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handleEmailOption('gmail')}
                                    style={{
                                        padding: '0.875rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid #EA4335',
                                        background: 'rgba(234, 67, 53, 0.08)',
                                        color: '#EA4335',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.background = 'rgba(234, 67, 53, 0.15)'
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'rgba(234, 67, 53, 0.08)'
                                    }}
                                >
                                    Gmail
                                </button>
                                <button
                                    onClick={() => handleEmailOption('mailto')}
                                    style={{
                                        padding: '0.875rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '2px solid var(--info)',
                                        background: 'rgba(66, 135, 245, 0.08)',
                                        color: 'var(--info)',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.background = 'rgba(66, 135, 245, 0.15)'
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'rgba(66, 135, 245, 0.08)'
                                    }}
                                >
                                    Default Email Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Message Notification */}
            {callMessage && (
                <div className="notification notification-info">
                    <Icons.AlertCircle />
                    <span>{callMessage}</span>
                </div>
            )}
        </main>
    )
}

export default AdminDashboardPage
