import { useEffect, useState } from 'react'
import useQueryParams from './useQueryParams'
import Auth from './api/auth.api'
import { useDispatch } from 'react-redux'
import { setToken } from './features/Auth/authSlice'
import { cancelTokenSource } from './api/client'

export const VerifyEmail = () => {
  const [message, setMessage] = useState('')
  // email-verifications?token=
  const { token } = useQueryParams()
  const dispatch = useDispatch()

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
      if (typeof access_token === 'string' && typeof refresh_token === 'string') {
        dispatch(setToken({ accessToken: access_token, refreshToken: refresh_token }))
      }
    }
    if (data.message) {
      setMessage(data.message)
    }
  }
  return <div>{message}</div>
}
