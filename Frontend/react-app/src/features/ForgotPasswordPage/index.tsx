import { Button, Form, Input } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
import { AuthState } from '../Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { isExpired } from '~/utils/jwt'
import { toast } from 'react-toastify'
const ForgotPasswordPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && !isExpired(auth.accessToken)) {
      if (auth.role === 2) navigate('/')
      if (auth.role === 1) navigate('/employer')
      if (auth.role === 0) navigate('/admin')
      toast.error('Vui lòng đăng xuất để thực hiện thao tác này!')
    }
  }, [auth])
  const naviagte = useNavigate()
  const [form] = Form.useForm()
  const [email, setEmail] = useState('')
  const [seconds, setSeconds] = useState(10)
  const [disabledBtn, setDisabledBtn] = useState(false)
  useEffect(() => {
    if (seconds > 0) {
      const countdown = setInterval(() => {
        setSeconds(seconds - 1)
      }, 1000)
      return () => clearInterval(countdown)
    } else {
      setSeconds(10)
      setDisabledBtn(false)
    }
  }, [disabledBtn === true && seconds])
  const handleSubmitSendRequest = () => {
    setDisabledBtn(true)
  }
  const handleSubmitForm = () => {
    handleSubmitSendRequest()
    console.log('submit', email)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className='forgot-password-page-container' style={{ backgroundImage: `url(${bg})` }}>
      <div className='forgot-password-content-wapper'>
        <div className='content-wapper'>
          <h1 onClick={() => naviagte('/')}>HFWorks</h1>
          <div className='first-content-container'>
            <h3>Quên mật khẩu</h3>
            <div className='first-content-wapper'>
              {disabledBtn ? (
                <>
                  <p>{`Yêu cầu của bạn đã được gửi thành công.`}</p>
                  <p>{`Thời gian hiệu lực còn: ${seconds}s`}</p>
                </>
              ) : (
                <>
                  <p>Nhập địa chỉ Email của bạn vào ô bên dưới.</p>
                  <p>Chúng tôi sẽ gửi email xác thực về địa chỉ email mà bạn đã cung cấp.</p>
                </>
              )}

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
                  name={'email'}
                  label={'Email'}
                  rules={[
                    { type: 'email', message: 'Vui lòng nhập đúng định dạng email' },
                    { required: true, message: 'Vui lòng không để trống email' }
                  ]}
                >
                  <Input onChange={(e) => setEmail(e.target.value)} size='large' placeholder='Nhập email' />
                </Form.Item>
                <Button disabled={disabledBtn} htmlType='submit' size='large' className='btn-send'>
                  {disabledBtn ? 'Đã gửi' : 'Gửi'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
