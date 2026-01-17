// Helper to get robust API URL
const getApiUrl = () => {
    let url =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api'

    // Remove potential double slash or trailing slash from domain
    url = url.replace(/\/$/, '')

    // Ensure it ends with /api
    if (!url.endsWith('/api')) {
        url = `${url}/api`
    }
    return url
}

const API_BASE_URL = getApiUrl()

console.log('🔌 [Admin] Configured API URL:', API_BASE_URL)

export default API_BASE_URL
