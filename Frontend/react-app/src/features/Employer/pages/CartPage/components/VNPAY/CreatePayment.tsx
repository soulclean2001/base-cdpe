import { Tooltip } from 'antd'
import { MdPayments } from 'react-icons/md'
import apiPayment from '~/api/payment.api'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setLoading } from '~/features/Account/meSlice'

const CreatePayment = (props: any) => {
  const { orderId } = props
  const bankcode = 'VNBANK'
  const amount = 10000
  const disPatch = useDispatch()
  const handlePayment = async () => {
    if (!orderId) return
    disPatch(setLoading(true))
    await apiPayment
      .createPayment({ bankcode: bankcode, amount: amount, order_id: orderId })
      .then((res) => {
        window.location.href = res.result
        disPatch(setLoading(false))
      })
      .catch((_error) => {
        toast.error('Vui lòng chờ cho dến khi hết phiên giao dịch hoặc thử lại sau')
        disPatch(setLoading(false))
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
