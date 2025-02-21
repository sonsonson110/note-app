import axios, { AxiosError, AxiosResponse } from 'axios'
import { env } from '../env'
import { authApi } from '../services/auth/authApi'

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle refreshing token
let isRefreshing = false
let failedRequestsQueue: {
  resolve: (token: string) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedRequestsQueue = []
}

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }
    // Refresh token request error shall stop here
    const originalRequest = error.config!
    if (originalRequest.url === 'api/auth/refresh') {
      processQueue(error, null)
      isRefreshing = false
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    isRefreshing = true
    const { accessToken } = await authApi.refreshToken()
    localStorage.setItem('accessToken', accessToken)

    // Update token for the original request
    originalRequest.headers.Authorization = `Bearer ${accessToken}`

    // Process queued requests
    processQueue(null, accessToken)
    isRefreshing = false
    return axiosInstance(originalRequest)
  }
)
