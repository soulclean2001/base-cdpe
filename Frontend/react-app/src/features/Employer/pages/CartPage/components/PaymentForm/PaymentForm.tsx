import { Button, Col, Radio, RadioChangeEvent, Row, Space } from 'antd'
import { useState } from 'react'
import './style.scss'

import VNPayReturn from '../VNPAY/VNPayReturn'
import apiOrder, { RequestOrderType } from '~/api/order.api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const initHiddens = { hiddenCredit: true, hiddenATMCards: true, hiddenBankings: true }
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
  const [hidden, setHidden] = useState(initHiddens)
  const [orderId, setOrderId] = useState('')
  const navigate = useNavigate()
  const handleCreateOrder = async () => {
    console.log('items', items)
    if (!items) return
    let request: RequestOrderType = { items }
    await apiOrder
      .postOrder(request)
      .then((rs) => {
        console.log('rs order', rs)
        setOrderId(rs.result.order._id)
        toast.success('Bạn đã tạo đơn đặt hàng thành công')
        navigate('/employer/dashboard/my-orders')
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')

        setTimeout(() => {
          window.location.reload()
        }, 500)
      })
  }

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    if (e.target.value === 1) {
      setHidden({ ...initHiddens, hiddenCredit: false })
    }
    if (e.target.value === 2) {
      setHidden({ ...initHiddens, hiddenATMCards: false })
    }
    if (e.target.value === 3) {
      setHidden({ ...initHiddens, hiddenBankings: false })
    }
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
        disabled={!items || items.length < 1 ? true : false}
        onClick={handleCreateOrder}
        size='large'
        style={{ width: '100%', marginTop: '17px', backgroundColor: 'rgb(255, 125, 85)', color: 'white' }}
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
