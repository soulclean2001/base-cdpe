/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import { EnhancedStore } from '@reduxjs/toolkit'
let store: EnhancedStore

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export const injectStore = (_store: EnhancedStore) => {
  store = _store
}

const logOnDev = (message: string) => {
  if (import.meta.env.MODE === 'development') {
    console.log(message)
  }
}

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const { method, url } = config
  // Set Headers Here
  // Check Authentication Here
  // Set Loading Start Here
  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${config.baseURL}${url} | Request`)

  if (method === 'get') {
    config.timeout = 15000
  }
  return config
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config
  const { status } = response

  // Set Loading End Here
  // Handle Response Data Here
  // Error Handling When Return Success with Error Code Here
  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${response.config.baseURL}${url} | Response ${status}`)

  if (response && response.data) return response.data

  return response
}

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error
    const { method, url } = error.config as AxiosRequestConfig
    const { statusText, status } = (error.response as AxiosResponse) ?? {}

    logOnDev(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`)

    switch (status) {
      case 401: {
        // "Login required"
        break
      }
      case 403: {
        // "Permission denied"
        break
      }
      case 404: {
        // "Invalid request"
        break
      }
      case 500: {
        // "Server error"
        break
      }
      default: {
        // "Unknown error occurred"
        break
      }
    }

    if (status === 401) {
      // Delete Token & Go To Login Page if you required.
      sessionStorage.removeItem('token')
    }
  } else {
    logOnDev(`🚨 [API] | Error ${error.message}`)
  }

  return Promise.reject(error)
}

instance.interceptors.response.use(onResponse, onErrorResponse)
instance.interceptors.request.use(onRequest, onErrorResponse)

export default instance
