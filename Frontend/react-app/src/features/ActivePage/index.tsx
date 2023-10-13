import { Button } from 'antd'
import './style.scss'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
import { useEffect, useState } from 'react'

const ActivePage = () => {
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
                    <p>{`Thời gian hiệu lực còn: ${seconds}s`}</p>
                  </>
                ) : (
                  <>
                    <p>Chúng tôi sẽ gửi Email xác thực đến tài khoản</p>
                    <p className='your-email'>font@gmail.com</p>
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
