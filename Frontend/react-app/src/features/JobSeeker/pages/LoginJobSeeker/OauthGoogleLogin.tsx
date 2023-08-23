import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { oauth } from '~/features/Auth/authSlice'

export default function OauthGoogleLogin() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const newUser = params.get('new_user')
    const verify = params.get('verify')
    dispatch(oauth({ accessToken, refreshToken, newUser, verify }))
    navigate('/')
  }, [params, navigate])
  return <div>Login</div>
}
