import { Button, Col, Radio, RadioChangeEvent, Row, Space } from 'antd'
import { useState } from 'react'
import './style.scss'

import apiOrder, { RequestOrderType } from '~/api/order.api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { minusTotalItemCart } from '~/features/Employer/employerSlice'

interface PropsType {
  totalPay: number
  items: {
    item_id: string
    quantity: number
  }[]
}
const PaymentForm = (props: PropsType) => {
  const { totalPay, items }: PropsType = props
  const [methodPayment, setMethodPayment] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const distPatch = useDispatch()
  const handleCreateOrder = async () => {
    if (!items) return
    setIsLoading(true)
    let request: RequestOrderType = { items }
    await apiOrder
      .postOrder(request)
      .then(() => {
        distPatch(minusTotalItemCart(items.length))

        toast.success('Bạn đã tạo đơn đặt hàng thành công')
        navigate('/employer/dashboard/my-orders')
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
        setIsLoading(false)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      })
    setIsLoading(false)
  }

  const onChange = (e: RadioChangeEvent) => {
    setMethodPayment(e.target.value)
  }
  return (
    <div className='payment-form-container'>
      <Row className='total-container-not-vat' align={'middle'}>
        <Col md={12} sm={24} xs={24} className='total-label' style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Tổng cộng</div>
          <div className='vat'>{`(chưa gồm VAT)`}</div>
        </Col>
        <Col md={12} sm={24} xs={24} className='total-value'>{`${totalPay.toLocaleString('vi', {
          currency: 'VND'
        })} VND`}</Col>
      </Row>
      <hr />
      <Row className='total-container-vat' align={'middle'}>
        <Col md={12} sm={24} xs={24} className='total-label' style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Tổng cộng</div>
          <div className='vat'>{`(đã gồm VAT)`}</div>
        </Col>
        <Col md={12} sm={24} xs={24} className='total-value'>{`${(totalPay * 0.1 + totalPay).toLocaleString('vi', {
          currency: 'VND'
        })} VND`}</Col>
      </Row>
      <hr />
      <div className='method-payment-container'>
        <div className='total-label'>Phương thức thanh toán</div>
        <div className='options-payment-container'>
          <Radio.Group onChange={onChange} value={methodPayment}>
            <Space direction='vertical'>
              <Radio value={1}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div>VNPAY</div>
                </div>
              </Radio>

              {/* <Radio value={2}>Thẻ ATM</Radio>

              <Radio value={3}>Chuyển khoản</Radio>

              <Radio value={4}>Mã QR</Radio> */}
            </Space>
          </Radio.Group>
        </div>
      </div>

      <Button
        disabled={!items || items.length < 1 || isLoading ? true : false}
        onClick={handleCreateOrder}
        size='large'
        style={{
          width: '100%',
          marginTop: '17px',
          backgroundColor: !items || items.length < 1 ? 'rgb(245, 137, 104)' : 'rgb(255, 125, 85)',
          color: 'white'
        }}
      >
        Tạo đơn hàng
      </Button>
      <div>
        <div style={{ textAlign: 'center', fontSize: '11px', padding: '10px 50px' }}>
          Khi tạo đơn hàng Quý khách được xem rằng đã đồng ý với Chính sách bảo mật và Điều khoản dịch vụ.
        </div>
      </div>
      {/* <VNPayReturn /> */}
    </div>
  )
}

export default PaymentForm
