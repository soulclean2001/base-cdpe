import useQueryParams from '~/useQueryParams'
import apiPayment from '~/api/payment.api'
import { useEffect, useState } from 'react'
import '~/features/ActivePage/style.scss'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const VNPayReturn = () => {
  const navigate = useNavigate()
  const params = useQueryParams()
  const [status, setStatus] = useState('97')
  useEffect(() => {
    handleVNPayReturn()
  }, [])
  const handleBackToDashboard = () => {
    navigate('/employer/dashboard/my-orders')
  }
  const handleVNPayReturn = async () => {
    const rs = await apiPayment.getVNPayReturn(params)
    console.log(params)

    if (rs) {
      setStatus(rs.result.code)
      if (rs.result.code === '00') toast.success('Thanh toán thành công')
      else toast.warning('Thanh toán thất bại')
    }
  }

  return (
    <div className='active-page-container' style={{ backgroundImage: `url(${bg})` }}>
      <div className='active-page-content-wapper'>
        <div className='content-wapper'>
          <div className='first-step-container'>
            <h2 className='logo-web'>HFWorks</h2>
            <div className='first-step-content'>
              <div className='header-wapper' style={{ maxWidth: '350px' }}>
                {status === '00' && <h3>Thanh toán thành công!</h3>}
                {status === '24' && <h3>Thanh toán thất bại!</h3>}
                {status === '00' ? (
                  <>
                    <p>
                      Đơn hàng của bạn đã được cập nhật trạng thái sang 'Đã thanh toán', quay lại trang danh sách đơn
                      hàng để xem chi tiết
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Đơn hàng của bạn đã không thanh toán thành công, quay lại trang danh sách đơn hàng để xem chi tiết{' '}
                    </p>
                  </>
                )}
              </div>
              <Button onClick={handleBackToDashboard} size='large' className={'btn-send-mail-active-account'}>
                Trở lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VNPayReturn
