import { Tooltip } from 'antd'
import { MdPayments } from 'react-icons/md'
import apiPayment from '~/api/payment.api'

const CreatePayment = (props: any) => {
  const { orderId } = props
  const bankcode = 'VNBANK'
  const amount = 10000

  const handlePayment = async () => {
    if (!orderId) return
    await apiPayment.createPayment({ bankcode: bankcode, amount: amount, order_id: orderId }).then((res) => {
      window.location.href = res.result
    })
  }

  return (
    <Tooltip title='Thanh toán'>
      <a
        onClick={handlePayment}
        style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
      >
        <MdPayments />
      </a>
    </Tooltip>
  )
}

export default CreatePayment
