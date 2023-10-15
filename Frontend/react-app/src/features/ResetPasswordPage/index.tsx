import { Button, Form, Input } from 'antd'
import './style.scss'
import { LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
import { AuthState } from '../Auth/authSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
// import { isExpired } from '~/utils/jwt'
import { toast } from 'react-toastify'
const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const auth: AuthState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role === 2) navigate('/')
      if (auth.role === 1) navigate('/employer')
      if (auth.role === 0) navigate('/admin')
      toast.error('Vui lòng đăng xuất để thực hiện thao tác này!')
    }
  }, [auth])
  const [form] = Form.useForm()
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const handleSubmitForm = () => {
    const data = {
      newPassword,
      rePassword
    }
    console.log('submit', data)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className='forgot-password-page-container' style={{ backgroundImage: `url(${bg})` }}>
      <div className='forgot-password-content-wapper'>
        <div className='content-wapper'>
          <h1 onClick={() => navigate('/')}>HFWorks</h1>
          <div className='first-content-container'>
            <h3>Đổi mật khẩu</h3>
            <div className='first-content-wapper'>
              <p>Nhập mật khẩu mới của bạn vào ô bên dưới.</p>

              <Form
                name='form-forgot-password'
                className='form-forgot-password'
                // initialValues={{ remember: true }}
                onFinish={handleSubmitForm}
                form={form}
                onFinishFailed={onFinishFailed}
                layout='vertical'
              >
                <Form.Item
                  name={'newPassword'}
                  label={<h4>Mật khẩu mới</h4>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    {
                      pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
                      message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường và số, độ dài tối thiểu 8 ký tự'
                    }
                  ]}
                >
                  <Input.Password
                    size='large'
                    prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                    type='password'
                    placeholder='Nhập mật khẩu'
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  name={'rePassword'}
                  label={<h4>Nhập lại mật khẩu</h4>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Nhập lại mật khẩu không chính xác'))
                      }
                    })
                  ]}
                >
                  <Input.Password
                    size='large'
                    prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                    type='password'
                    placeholder='Nhập lại mật khẩu'
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                </Form.Item>
                <Button htmlType='submit' size='large' className='btn-send'>
                  Cập nhật
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
