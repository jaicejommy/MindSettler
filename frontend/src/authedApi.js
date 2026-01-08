import axios from 'axios'
import { auth } from './firebase'
import API_BASE_URL from './api'

const authedApi = axios.create({
  baseURL: API_BASE_URL,
})

authedApi.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default authedApi
