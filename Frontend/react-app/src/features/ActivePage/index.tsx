import { Button } from 'antd'
import './style.scss'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
import { useEffect, useState } from 'react'
import { InfoMeState } from '../Account/meSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { AuthState } from '../Auth/authSlice'
import { useNavigate } from 'react-router-dom'
import apiAuth from '~/api/auth.api'
import { toast } from 'react-toastify'
const ActivePage = () => {
  const navigate = useNavigate()
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const [seconds, setSeconds] = useState(10)
  const [disabledBtn, setDisabledBtn] = useState(false)
  useEffect(() => {
    if (!auth.isLogin || auth.verify === 2) {
      if (auth.role === 2) {
        navigate('/candidate-login')
        return
      }
      if (auth.role === 1) {
        navigate('/employer-login')
        return
      }
      navigate('/not-found')
      return
    } else {
      if (auth.verify === 1) {
        if (auth.role === 2) {
          navigate('/')
          return
        }
        if (auth.role === 1) {
          navigate('/employer')
          return
        }
        navigate('/not-found')
        return
      }
    }
  }, [])
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
  const handleSubmitSendRequest = async () => {
    setDisabledBtn(true)
    await apiAuth.sendVerifyEmail().then((rs) => {
      console.log('rs', rs)
      if (rs.result) toast.error(`Tài khoản ${me.email} đã được kích hoạt trước đó`)
      else
        toast.success(`Yêu cầu của bạn đã được gửi thành công, vui lòng kiểm tra hộp thư gửi đến tài khoản ${me.email}`)
    })
  }
  return (
    <div className='active-page-container' style={{ backgroundImage: `url(${bg})` }}>
      <div className='active-page-content-wapper'>
        <div className='content-wapper'>
          <div className='first-step-container'>
            <h2 className='logo-web'>HFWorks</h2>
            <div className='first-step-content'>
              <div className='header-wapper'>
                <h3>Xác thực tài khoản của bạn</h3>
                {disabledBtn ? (
                  <>
                    <p className=''>{`Yêu cầu của bạn đã được gửi thành công.`}</p>
                    <p>{`Thời gian chờ còn: ${seconds}s`}</p>
                  </>
                ) : (
                  <>
                    <p>Chúng tôi sẽ gửi Email xác thực đến tài khoản</p>
                    <p className='your-email'>{me.email}</p>
                  </>
                )}
              </div>
              <Button
                disabled={disabledBtn}
                onClick={handleSubmitSendRequest}
                size='large'
                className={disabledBtn ? 'btn-send-mail-active-account btn-diabled' : 'btn-send-mail-active-account'}
              >
                {disabledBtn ? `Đã gửi` : 'Gửi yêu cầu'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivePage
