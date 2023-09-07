import { Col, Row } from 'antd'
import './style.scss'
import TableCart from './components/TableCart/TableCart'
import PaymentForm from './components/PaymentForm/PaymentForm'
const CartPage = () => {
  return (
    <div className='page-cart-container'>
      <Row>
        <Col md={16} sm={24} xs={24} className='left-container'>
          <div className='title'>Xem giỏ hàng & Thanh toán</div>
          <TableCart />
        </Col>
        <Col md={8} sm={24} xs={24} className='right-container'>
          <PaymentForm />
        </Col>
      </Row>
    </div>
  )
}

export default CartPage
