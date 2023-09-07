import { Button, Col, Radio, RadioChangeEvent, Row, Space } from 'antd'
import { useState } from 'react'
import './style.scss'
const initHiddens = { hiddenCredit: true, hiddenATMCards: true, hiddenBankings: true }
const PaymentForm = () => {
  const [methodPayment, setMethodPayment] = useState(1)
  const [hidden, setHidden] = useState(initHiddens)
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
        <Col md={12} sm={24} xs={24} className='total-value'>{`${'4.000.000'} VND`}</Col>
      </Row>
      <hr />
      <Row className='total-container-vat' align={'middle'}>
        <Col md={12} sm={24} xs={24} className='total-label' style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Tổng cộng</div>
          <div className='vat'>{`(đã gồm VAT)`}</div>
        </Col>
        <Col md={12} sm={24} xs={24} className='total-value'>{`${'4.400.000'} VND`}</Col>
      </Row>
      <hr />
      <div className='method-payment-container'>
        <div className='total-label'>Phương thức thanh toán</div>
        <div className='options-payment-container'>
          <Radio.Group onChange={onChange} value={methodPayment}>
            <Space direction='vertical'>
              <Radio value={1}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div>Thẻ tín dụng</div>
                </div>
              </Radio>

              <Radio value={2}>Thẻ ATM</Radio>

              <Radio value={3}>Chuyển khoản</Radio>

              <Radio value={4}>Mã QR</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
      <Button
        size='large'
        style={{ width: '100%', marginTop: '17px', backgroundColor: 'rgb(255, 125, 85)', color: 'white' }}
      >{`Thanh toán bằng ${methodPayment === 1 ? 'Thẻ tín dụng' : methodPayment === 2 ? 'thẻ ATM' : 'Mã QR'}`}</Button>
      <div>
        <div style={{ textAlign: 'center', fontSize: '11px', padding: '10px 50px' }}>
          Khi gửi đơn hàng Quý khách được xem rằng đã đồng ý với Chính sách bảo mật và Điều khoản dịch vụ.
        </div>
      </div>
    </div>
  )
}

export default PaymentForm
