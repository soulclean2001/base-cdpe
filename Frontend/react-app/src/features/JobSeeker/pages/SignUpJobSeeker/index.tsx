import { useNavigate } from 'react-router-dom'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import './signup.scss'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import apiAuth, { AuthRequestRegistry } from '~/api/auth.api'
import { decodeToken } from '~/utils/jwt'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { toast } from 'react-toastify'
import { AuthLogin, setAccountStatus, setStateLogin, setToken } from '~/features/Auth/authSlice'
const SignUp = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  //form data
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [checkAccept, setCheckAccept] = useState(false)
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  //
  const handleBackHome = () => {
    navigate('/')
  }
  const decodeUser = async (token: { accessToken: string; refreshToken: string }) => {
    if (token) {
      const dataDecode = await decodeToken(token.accessToken)
      if (dataDecode.role && dataDecode.role === 2) {
        const action: AuthLogin = { isLogin: true, loading: false, error: '' }
        dispatchAsync(setToken(token))
        dispatchAsync(setAccountStatus(dataDecode))
        dispatchAsync(setStateLogin(action))
        navigate('/active-page')
        toast.success('Đăng ký thành công')
      }
    }
  }
  const handleSubmitSignup = async () => {
    const req: AuthRequestRegistry = {
      email: email,
      password: password,
      confirm_password: rePassword,
      name: name,
      gender: 0,
      role: 2,
      date_of_birth: '2001-01-01'
    }
    await apiAuth
      .register(req)
      .then(async (response) => {
        if (response.result && response.result.access_token && response.result.refresh_token) {
          await decodeUser({ accessToken: response.result.access_token, refreshToken: response.result.refresh_token })
        }
      })
      .catch(() => {
        toast.error('Email đã tồn tại, vui lòng chọn Email khác')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div id='components-form-sign-up'>
      <div className='sign-up-container'>
        <div className='title-container'>
          <h1 className='title' onClick={handleBackHome}>
            HFWork
          </h1>
          <h3 style={{ fontSize: '22px', color: 'rgb(255, 125, 85)' }}>Chào mừng bạn đến với HFWork</h3>
          <span style={{ fontSize: '14px', color: '#999' }}>
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
          </span>
        </div>
        <div>
          <Form
            form={form}
            onFinish={handleSubmitSignup}
            onFinishFailed={onFinishFailed}
            name='normal_signup'
            className='sign-up-form'
            initialValues={{ remember: true }}
          >
            <Form.Item name='name' rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
              <Input
                size='large'
                className='name-input'
                prefix={<UserOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                placeholder='Nhập họ tên'
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Vui lòng không để trống Email' },
                { type: 'email', message: 'Vui lòng nhập đúng định dạng Email. Ví dụ: abc@gmail.com' }
              ]}
              style={{ paddingTop: '10px' }}
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
              name='password'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                {
                  pattern: new RegExp(/^(?=(.*[a-z]){1})(?=(.*[A-Z]){1})(?=(.*\d){1})(?=(.*\W){1}).{6,}$/),
                  message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường, ký tự đặc biệt và số, độ dài tối thiểu 6 ký tự'
                }
              ]}
              style={{ paddingTop: '10px' }}
            >
              <Input.Password
                size='large'
                prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                type='password'
                placeholder='Nhập mật khẩu'
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='repassword'
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Nhập lại mật khẩu không chính xác'))
                  }
                })
              ]}
              style={{ paddingTop: '10px' }}
            >
              <Input.Password
                size='large'
                prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                type='password'
                placeholder='Nhạp lại mật khẩu'
                onChange={(e) => setRePassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name={'checkAccept'}
              // noStyle
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) => {
                    return value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Vui lòng chấp nhận các yêu cầu dịch vụ để tiếp tục'))
                  }
                }
              ]}
            >
              <Checkbox
                checked={checkAccept}
                onClick={() => {
                  setCheckAccept(!checkAccept)
                }}
              >
                <span style={{ fontWeight: '450', fontFamily: 'sans-serif', paddingLeft: '10px' }}>
                  Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của HFWork
                </span>
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: '40px' }}>
              <Button type='primary' htmlType='submit' className='login-form-button'>
                Đăng ký
              </Button>
            </Form.Item>
            {/* <p className='or-login-title'>Hoặc đăng nhập bằng</p>

            <Form.Item>
              <div className='or-login-container'>
                <Button
                  type='primary'
                  // htmlType='submit'
                  className='btn login-google-button'
                  icon={<GooglePlusOutlined />}
                >
                  Google
                </Button>
                <Button
                  type='primary'
                  // htmlType='submit'
                  className='btn login-facebook-button'
                  icon={<FacebookOutlined />}
                >
                  Facebook
                </Button>
                <Button
                  type='primary'
                  // htmlType='submit'
                  className='btn login-linkedin-button'
                  icon={<LinkedinOutlined />}
                >
                  Linkedin
                </Button>
              </div>
            </Form.Item> */}
            <div className='or-tab-login'>
              <p style={{ textAlign: 'center' }}>
                <span>Bạn đã có tài khoản?</span>
                <NavLink to={'/candidate-login'}>Đăng nhập ngay</NavLink>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
