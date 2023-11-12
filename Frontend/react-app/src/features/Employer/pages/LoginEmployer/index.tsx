import { useState, useEffect } from 'react'

import { LockOutlined, MailOutlined } from '@ant-design/icons'

import { Button, Col, Form, Input, Row } from 'antd'
import './loginEmployer.scss'
import { Link, useNavigate } from 'react-router-dom'
import { UserRole } from '~/types'
import Auth from '~/api/auth.api'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { AuthLogin, AuthState, setAccountStatus, setStateLogin, setToken } from '~/features/Auth/authSlice'
import { decodeToken } from '~/utils/jwt'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'

const LoginEmployer = (props: any) => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)

  const navigate = useNavigate()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()

  const { hiddenTabSignUp, titleForm } = props
  const [form] = Form.useForm()

  //form state data

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const decodeUser = async (token: { accessToken: string; refreshToken: string }) => {
    if (token) {
      const dataDecode = await decodeToken(token.accessToken)
      if (hiddenTabSignUp) {
        console.log('dataDecode.role', dataDecode.role)
        if (dataDecode.role.toString() === '0') {
          console.log('check')
          const action: AuthLogin = { isLogin: true, loading: false, error: '' }
          dispatchAsync(setToken(token))
          dispatchAsync(setAccountStatus(dataDecode))
          dispatchAsync(setStateLogin(action))
          navigate('/admin')
        } else {
          toast.error('Tài khoản không tồn tạii')

          // setLoading(false)
        }
      } else {
        if (dataDecode.role && dataDecode.role === 1) {
          const action: AuthLogin = { isLogin: true, loading: false, error: '' }
          dispatchAsync(setToken(token))
          dispatchAsync(setAccountStatus(dataDecode))
          dispatchAsync(setStateLogin(action))
          navigate('/employer')
        } else {
          toast.error('Tài khoản không tồn tại')
          return
          // setLoading(false)
        }
      }
    }
  }

  const handleSubmitLogin = async () => {
    const data = {
      username: email,
      password,
      role: UserRole.Candidate
    }
    await Auth.loginApi(data)
      .then(async (response) => {
        if (response.result && response.result.access_token && response.result.refresh_token) {
          await decodeUser({ accessToken: response.result.access_token, refreshToken: response.result.refresh_token })
        }

        console.log(response)
      })
      .catch((error) => {
        console.log('error', error)
        toast.error('Tài khoản hoặc mật khẩu không đúng')
        // setLoading(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed login:', errorInfo)
  }

  return (
    <Row className='page-login-employer-container'>
      <Col md={16} sm={24} xs={24} className='page-login-employer-wapper'>
        <div className='login-employer-content'>
          <div className='title-container'>
            <div className='title' onClick={() => navigate('/employer')}>
              HFWorks
            </div>
            <p>{titleForm && titleForm.title ? titleForm.title : 'Chào mừng bạn đã trở lại'}</p>
            <span>
              {titleForm && titleForm.description
                ? titleForm.description
                : 'Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm dịch vụ Website của chúng tôi'}
            </span>
          </div>
          <div className='regulations-container'>
            <Form
              name='form-login-employer'
              className='login-form'
              initialValues={{ remember: true }}
              onFinish={handleSubmitLogin}
              form={form}
              onFinishFailed={onFinishFailed}
              layout='vertical'
            >
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  { required: true, message: 'Vui lòng không để trống Email' },
                  { type: 'email', message: 'Vui lòng nhập đúng định dạng Email. Ví dụ: abc@gmail.com' }
                ]}
              >
                <Input
                  size='large'
                  className='email-input'
                  prefix={<MailOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  placeholder='Nhập Email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name={'password'}
                label='Mật khẩu'
                style={{ paddingTop: '10px', marginBottom: 0 }}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  {
                    pattern: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\W]{7,}$/),
                    message:
                      'Mật khẩu bao gồm chữ in Hoa - chữ in thường, ký tự đặc biệt và số, độ dài tối thiểu 6 ký tự'
                  }
                ]}
              >
                <Input.Password
                  size='large'
                  prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  type='password'
                  placeholder='Nhập mật khẩu'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <br />
              <Form.Item style={{ marginBottom: 0 }}>
                <Link style={{ float: 'right' }} className='login-form-forgot' to={'/forgot-password'}>
                  Quên mật khẩu
                </Link>
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' className='login-form-button'>
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className='or-tab-sign-up' hidden={hiddenTabSignUp ? hiddenTabSignUp : false}>
                <p style={{ textAlign: 'center' }}>
                  <span>Bạn chưa có tài khoản?</span>
                  <Link to={'/employer-sign-up'}> Đăng ký ngay</Link>
                </p>
                <p style={{ textAlign: 'center' }}>
                  {/* <span>Dành cho quản trị viên</span> */}
                  <Link to={'/admin'}>Dành cho quản trị viên</Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Col>
      <Col md={8} sm={0} xs={0} className='banner'></Col>
    </Row>
  )
}

export default LoginEmployer
