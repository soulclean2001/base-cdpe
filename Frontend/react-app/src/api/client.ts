/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance } from 'axios'
import { EnhancedStore } from '@reduxjs/toolkit'
import Auth from './auth.api'
import { logout, setToken } from '~/features/Auth/authSlice'
import { resetProfile } from '~/features/Account/meSlice'

let store: EnhancedStore
export const cancelTokenSource = axios.CancelToken.source()
interface AuthResponse {
  message: string
  result: {
    access_token: string
    refresh_token: string
  }
}

const instance: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_URL + '/api/v1' || 'http://localhost:4000/api/v1',
  baseURL: 'http://localhost:4000/api/v1',
  timeout: 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export const injectStore = (_store: EnhancedStore) => {
  store = _store
}

instance.interceptors.request.use(async (config) => {
  const accessToken = store.getState().auth.accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

const responseInterceptorId = instance.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }

    return response
  },
  async (error) => {
    const refreshToken = store.getState().auth.refreshToken
    if (!refreshToken) {
      return
    }

    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (responseInterceptorId) axios.interceptors.response.eject(responseInterceptorId)

    if (error.response.status === 401) {
      store.dispatch(logout())
      store.dispatch(resetProfile())
    }
    return Promise.reject(error)
    return Auth.refreshToken(refreshToken)
      .then((response) => {
        const data = response as AuthResponse
        const { access_token, refresh_token } = data.result
        store.dispatch(setToken({ accessToken: access_token, refreshToken: refresh_token }))
        error.response.config.headers['Authorization'] = 'Bearer ' + access_token
        error.response.config.refreshed = true

        return instance(error.response.config)
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          const data = error.response.data
          console.log(data)
          store.dispatch(logout())
          return Promise.reject(data) // Thông điệp lỗi từ server (dưới dạng JSON)
        }
        store.dispatch(logout())
        return Promise.reject(error)
      })
      .finally()
  }
)

const apiClient = instance
export default apiClient
