import useQueryParams from '~/useQueryParams'
import apiPayment from '~/api/payment.api'
import { useEffect, useState } from 'react'

const VNPayReturn = () => {
  const params = useQueryParams()
  const [status, setStatus] = useState('97')
  useEffect(() => {
    handleVNPayReturn()
  }, [])

  const handleVNPayReturn = async () => {
    const rs = await apiPayment.getVNPayReturn(params)
    console.log(params)

    if (rs) setStatus(rs.result.code)
  }

  return <div>VNPayReturn {status} </div>
}

export default VNPayReturn
