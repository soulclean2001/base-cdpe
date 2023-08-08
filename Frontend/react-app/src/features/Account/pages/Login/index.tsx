import React, { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import './login.scss'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, postLogin } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'

export interface LoginData {
  username: string
  password: string
  remember?: boolean
}

const Login: React.FC = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  useEffect(() => {
    setLoading(auth.loading)
    setError(auth.error)
  }, [auth])

  const dispatch: AppThunkDispatch = useAppDispatch()

  const onFinish = (values: LoginData) => {
    delete values.remember
    console.log(values)

    dispatch(postLogin(values))
  }
  if (loading) return <div>Loadinng...</div>
  return (
    <div id='components-form-login'>
      <div>
        <h1 className='title'>My App</h1>
      </div>
      <div>
        <Form name='normal_login' className='login-form' initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className='login-form-forgot' href=''>
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              Log in
            </Button>
            Or <a href=''>register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
