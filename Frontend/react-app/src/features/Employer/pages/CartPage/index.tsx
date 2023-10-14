import { Col, Row } from 'antd'
import './style.scss'
import TableCart from './components/TableCart/TableCart'
import PaymentForm from './components/PaymentForm/PaymentForm'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { isExpired } from '~/utils/jwt'
const CartPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && !isExpired(auth.accessToken)) {
      if (auth.role !== 1) navigate('/employer-login')
    } else {
      navigate('/employer-login')
    }
  }, [auth])
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
