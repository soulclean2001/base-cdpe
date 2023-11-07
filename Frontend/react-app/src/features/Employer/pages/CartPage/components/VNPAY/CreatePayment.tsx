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
    <div>
      {/* <input type='text' defaultValue={bankcode} />
      <input type='text' defaultValue={amount} /> */}
      <button onClick={handlePayment}>Tạo thanh toán</button>
    </div>
  )
}

export default CreatePayment
