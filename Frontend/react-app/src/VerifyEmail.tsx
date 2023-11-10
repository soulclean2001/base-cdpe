import { useEffect, useState } from 'react'
import useQueryParams from './useQueryParams'
import Auth from './api/auth.api'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, setAccountStatus, setStateLogin, setToken } from './features/Auth/authSlice'
import { cancelTokenSource } from './api/client'
import { RootState } from './app/store'
import { decodeToken } from './utils/jwt'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppThunkDispatch, useAppDispatch } from './app/hook'
export const VerifyEmail = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const [message, setMessage] = useState('')
  // email-verifications?token=
  const { token } = useQueryParams()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      verify(token)
    }

    return () => {
      cancelTokenSource.cancel()
    }
  }, [token])

  const verify = async (token: string) => {
    const data = await Auth.verifyEmail(token)
    if (data.result) {
      const { refresh_token, access_token } = data.result
      console.log('data.result', data.result)
      if (typeof access_token === 'string' && typeof refresh_token === 'string') {
        const dataDecode = await decodeToken(access_token)
        dispatchAsync(setToken({ accessToken: access_token, refreshToken: refresh_token }))
        dispatchAsync(setAccountStatus(dataDecode))
        dispatchAsync(setStateLogin({ isLogin: true, loading: false, error: '' }))
        toast.success('Tài khoản của bạn đã được xác thực thành công')
        if (dataDecode.role === 2) {
          navigate('/')
        }
        if (dataDecode.role === 1) {
          navigate('/employer')
        }
      }
    }
    if (data.message) {
      setMessage(data.message)
    }
  }
  return <div>{message}</div>
}
