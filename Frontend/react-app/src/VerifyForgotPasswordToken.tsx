import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useQueryParams from './useQueryParams'
import { cancelTokenSource } from './api/client'
import Auth from './api/auth.api'

export const VerifyForgotPasswordToken = () => {
  const { token } = useQueryParams()
  const [message, setMessage] = useState('')
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
    await Auth.verifyForgotPassword(token).then((data) => {
      if (data.message) {
        setMessage(data.message)
      }
      if (data)
        navigate('/reset-password', {
          state: { forgot_password_token: token }
        })
    })
  }

  return <div>{message}</div>
}

// click quen mat khau -> goi api gui email
// bam vao button trong email -> redirect to localhost:3001/forgot-password?token=
//
