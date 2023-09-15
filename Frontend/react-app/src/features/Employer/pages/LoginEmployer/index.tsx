import { useState } from 'react'

import { LockOutlined, MailOutlined } from '@ant-design/icons'

import { Button, Col, Form, Input, Row } from 'antd'
import './loginEmployer.scss'
import { Link } from 'react-router-dom'
import { UserRole } from '~/types'

const LoginEmployer = (props: any) => {
  const { hiddenTabSignUp, titleForm } = props
  const [form] = Form.useForm()

  //form state data

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmitLogin = () => {
    const data = {
      email,
      password,
      role: UserRole.Candidate
    }
    console.log('form data login', data)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed login:', errorInfo)
  }

  return (
    <Row className='page-login-employer-container'>
      <Col md={16} sm={24} xs={24} className='page-login-employer-wapper'>
        <div className='login-employer-content'>
          <div className='title-container'>
            <div className='title'>HFWork</div>
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <br />
              <Form.Item style={{ marginBottom: 0 }}>
                <Link style={{ float: 'right' }} className='login-form-forgot' to={'/employer-forgot-password'}>
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
                  <Link to={'/employer-sign-up'}>Đăng ký ngay</Link>
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
