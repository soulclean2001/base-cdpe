import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FacebookOutlined, GooglePlusOutlined, LinkedinOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import './login.scss'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { useSelector } from 'react-redux'
import {
  AuthLogin,
  AuthPayload,
  AuthState,
  postLogin,
  setAccountStatus,
  setStateLogin,
  setToken
} from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { NavLink } from 'react-router-dom'
import { decodeToken, isExpired } from '~/utils/jwt'
import Auth from '~/api/auth.api'
// import { getMe } from '~/api/users.api'
// import { getMe } from '../../jobSeekerSlice'
import { ToastContainer, toast } from 'react-toastify'

const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env
  const url = `https://accounts.google.com/o/oauth2/v2/auth`
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline' // refresh-token
  }
  const queryString = new URLSearchParams(query).toString()
  return `${url}?${queryString}`
}
const googleOAuthUrl = getGoogleAuthUrl()

export interface LoginData {
  username: string
  password: string
  remember?: boolean
  role: number
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const dispatch = useAppDispatch()
  const handleBackHome = () => {
    navigate('/')
  }

  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [token, setTokenLogin] = useState<AuthPayload>()
  //old code
  // useEffect(() => {
  //   setLoading(auth.loading)
  //   setError(auth.error)
  //   decodeUser()
  // }, [auth])
  //
  useEffect(() => {
    decodeUser()
  }, [token])
  const decodeUser = async () => {
    //old code
    // if (auth.accessToken) {
    //   const payload = await decodeToken(auth.accessToken)
    //   dispatch(setAccountStatus(payload))
    // }
    //
    if (token) {
      const dataDecode = await decodeToken(token.accessToken)
      if (dataDecode.role && dataDecode.role === 2) {
        const action: AuthLogin = { isLogin: true, loading: false, error: '' }
        dispatchAsync(setToken(token))
        dispatchAsync(setAccountStatus(dataDecode))
        dispatchAsync(setStateLogin(action))
      } else {
        toast.error('Tài khoản không tồn tại')
        setLoading(false)
      }
    }
  }

  // useEffect(() => {
  //   if (auth.isLogin && auth.accessToken && !isExpired(auth.accessToken) && auth.role === 2) {
  //     getProfile()
  //     handleBackHome()
  //   }
  // }, [auth])
  // const getProfile = async () => {
  //   await dispatchAsync(getMe())
  // }
  const onFinish = async (values: LoginData) => {
    delete values.remember
    setLoading(true)
    setTimeout(async () => {
      await Auth.loginApi(values)
        .then((response) => {
          if (response.result && response.result.access_token && response.result.refresh_token) {
            setTokenLogin({ accessToken: response.result.access_token, refreshToken: response.result.refresh_token })
          }
        })
        .catch((error) => {
          console.log('error', error)
          toast.error('Tài khoản hoặc mật khẩu không đúng')
          setLoading(false)
        })
    }, 1000)
    //old code
    // dispatchAsync(postLogin(values))
    //
  }

  // if (loading) return <div>Loadinng...</div>
  return (
    <div id='components-form-login'>
      <div className='login-container'>
        <div className='title-container'>
          <h1 className='title' onClick={handleBackHome}>
            HFWork
          </h1>
          <h3 style={{ fontSize: '22px', color: 'rgb(255, 125, 85)' }}>Chào mừng bạn đã quay trở lại</h3>
          <span style={{ fontSize: '14px', color: '#999' }}>
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
          </span>
        </div>
        <div>
          <Form name='normal_login' className='login-form' initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item name='username' rules={[{ required: true, message: 'Vui lòng nhập Email của bạn!' }]}>
              <Input
                size='large'
                className='mail-input'
                prefix={<MailOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                placeholder='Tài khoản'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={{ paddingTop: '10px' }}
            >
              <Input.Password
                size='large'
                prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                type='password'
                placeholder='Mật khẩu'
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>
                  <span style={{ fontWeight: '450' }}>Duy trì đăng nhập</span>
                </Checkbox>
              </Form.Item>

              <a className='login-form-forgot' href=''>
                Quên mật khẩu
              </a>
            </Form.Item>

            <Form.Item>
              <Button disabled={loading} type='primary' htmlType='submit' className='login-form-button'>
                Đăng nhập
              </Button>
            </Form.Item>
            <ToastContainer
              position='top-right'
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='light'
            />

            <p className='or-login-title'>Hoặc đăng nhập bằng</p>
            <Form.Item>
              <div className='or-login-container'>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='btn login-google-button'
                  icon={<GooglePlusOutlined />}
                >
                  <Link to={googleOAuthUrl}>Google</Link>
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='btn login-facebook-button'
                  icon={<FacebookOutlined />}
                >
                  Facebook
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='btn login-linkedin-button'
                  icon={<LinkedinOutlined />}
                >
                  Linkedin
                </Button>
              </div>
            </Form.Item>
          </Form>
          <div className='or-tab-sign-up'>
            <p style={{ textAlign: 'center' }}>
              <span>Bạn chưa có tài khoản?</span>
              <NavLink to={'/candidate-sign-up'}>Đăng ký ngay</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
