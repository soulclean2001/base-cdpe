// import { useEffect, useState } from 'react'
import './style.scss'
interface DataType {
  id: string
  name: string
  price: number
}
interface PropsType {
  data: DataType
  idActive: string
  hiddenBorder: boolean
}

const ServiceItem = (props: PropsType) => {
  const { data, idActive, hiddenBorder } = props

  if (!data) return <></>
  return (
    <div className='service-item-containerr'>
      <div
        className={idActive === data.id ? 'item-wapper active' : 'item-wapper'}
        style={{
          borderBottomLeftRadius: hiddenBorder ? '0.5rem' : 'none',
          borderBottomRightRadius: hiddenBorder ? '0.5rem' : 'none'
        }}
      >
        <div className='name'>{data.name}</div>
        <div className='price'>{`${data.price.toLocaleString('vi', { currency: 'VND' })} VNĐ`}</div>
      </div>
    </div>
  )
}

export default ServiceItem
