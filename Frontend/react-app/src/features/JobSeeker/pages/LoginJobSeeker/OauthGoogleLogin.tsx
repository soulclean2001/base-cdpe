import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { AuthLogin, oauth, setAccountStatus, setStateLogin } from '~/features/Auth/authSlice'
import { decodeToken } from '~/utils/jwt'
import { toast } from 'react-toastify'
export default function OauthGoogleLogin() {
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dispatch = useDispatch()

  useEffect(() => {
    setLogin()
  }, [params, navigate])
  const setLogin = async () => {
    const accessToken = params.get('access_token')
    if (!accessToken) return
    const refreshToken = params.get('refresh_token')
    const newUser = params.get('new_user')
    const verify = params.get('verify')

    if (accessToken) {
      const dataDecode = await decodeToken(accessToken)
      if (dataDecode.verify === 2) {
        toast.error('Tài khoản của bạn đã bị khóa, vui lòng đăng ký tài khoản mới để đăng nhập vào hệ thống !!')
        navigate('/candidate-login')
        return
      }
      if (dataDecode.role && dataDecode.role === 2) {
        const action: AuthLogin = { isLogin: true, loading: false, error: '' }
        dispatchAsync(oauth({ accessToken, refreshToken, newUser, verify }))
        dispatchAsync(setAccountStatus(dataDecode))
        dispatchAsync(setStateLogin(action))

        if (dataDecode.verify.toString() === '0') {
          navigate('/active-page')
          return
        }
        navigate('/')
        return
      } else {
        toast.error('Tài khoản không tồn tại')
        navigate('/candidate-login')
        return
      }
    }
  }
  return <div>Login</div>
}
