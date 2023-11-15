import { Col, Row } from 'antd'
import './style.scss'
import TableCart from './components/TableCart/TableCart'
import PaymentForm from './components/PaymentForm/PaymentForm'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const CartPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [totalPay, setTotalPay] = useState(0)
  const [items, setItems] = useState<
    {
      item_id: string
      quantity: number
    }[]
  >([])
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role !== 1) {
        navigate('/employer-login')
        return
      }
      if (auth.verify.toString() === '0') {
        navigate('/employer/active-page')
        return
      }
      if (auth.verify === 2) {
        navigate('/employer-login')
        return
      }
      return
    } else {
      navigate('/employer-login')
      return
    }
  }, [auth])
  const handleSetTotalPay = (
    total: number,
    items: {
      item_id: string
      quantity: number
    }[]
  ) => {
    setTotalPay(total)
    setItems(items)
  }

  return (
    <div className='page-cart-container'>
      <Row>
        <Col md={16} sm={24} xs={24} className='left-container'>
          <div className='title'>Xem giỏ hàng & Thanh toán</div>
          <TableCart handleSetTotalPay={handleSetTotalPay} />
        </Col>
        <Col md={8} sm={24} xs={24} className='right-container'>
          <PaymentForm items={items} totalPay={totalPay} />
        </Col>
      </Row>
    </div>
  )
}

export default CartPage
