import React, { useEffect, useState } from 'react'
import { FacebookOutlined, GooglePlusOutlined, LinkedinOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import './login.scss'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, postLogin } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { NavLink } from 'react-router-dom'

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
      <div className='login-container'>
      <div className='title-container'>
        <h1 className='title'>HFWork</h1>
        <h3 style={{fontSize:'22px', color: '#00b14f'}}>Chào mừng bạn đã quay trở lại</h3>
        <span style={{fontSize:'14px',color:'#999'}}>Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</span>
      </div>
      <div>
        <Form name='normal_login' className='login-form' initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name='mail' rules={[{ required: true, message: 'Vui lòng nhập Email của bạn!' }]}>
           
            <Input size='large' className='mail-input' prefix={<MailOutlined style={{color:'green'}} className='site-form-item-icon' />} placeholder='Tài khoản' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} style={{paddingTop:'10px'}}>
             
            <Input.Password
              size='large'
              prefix={<LockOutlined style={{color:'green'}} className='site-form-item-icon'  />}
              type='password'
              placeholder='Mật khẩu'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox><span style={{fontWeight:'450'}}>Duy trì đăng nhập</span></Checkbox>
            </Form.Item>

            <a className='login-form-forgot' href=''>
              Quên mật khẩu
            </a>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              Đăng nhập
            </Button>
          </Form.Item>
          <p className='or-login-title'>Hoặc đăng nhập bằng</p>
             
            <Form.Item> 
              <div className='or-login-container'>
              <Button type='primary' htmlType='submit' className='btn login-google-button' icon={<GooglePlusOutlined />}>Google</Button>
              <Button type='primary' htmlType='submit' className='btn login-facebook-button' icon={<FacebookOutlined />}>Facebook</Button>
              <Button type='primary' htmlType='submit' className='btn login-linkedin-button' icon={<LinkedinOutlined />}>Linkedin</Button>
              </div>
          </Form.Item>
          <div className='or-tab-sign-up'>
              <p style={{textAlign:'center'}}>
                <span>Bạn chưa có tài khoản?</span>
              <NavLink to={""}>
                 Đăng ký ngay
              </NavLink> 
              </p>
              
          </div>
        </Form>
      </div>
      </div>
      
    </div>
  )
}

export default Login
