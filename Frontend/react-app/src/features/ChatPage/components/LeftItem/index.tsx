import { Avatar, Button } from 'antd'
import './style.scss'
import { FiMoreHorizontal } from 'react-icons/fi'
import { useState } from 'react'
interface DataType {
  id: string
  logo: string
  name: string
  latestChat: string
  latestTime: string
}
interface PropsType {
  isActive: boolean
  data: DataType
}
const LeftItem = (props: any) => {
  const { isActive, data }: PropsType = props
  if (!data) return <div>Không có tin nhắn</div>
  return (
    <div className={isActive ? 'left-chat-item-container active-chat-item' : 'left-chat-item-container'}>
      <div className='left-wapper'>
        <Avatar className='logo' size={'large'} src={data.logo ? data.logo : ''} />
        <div className='info-chat-container'>
          <div className='name'>{data.name ? data.name : 'Tên'}</div>
          <div className='latest-message'>{data.latestChat ? data.latestChat : ''}</div>
        </div>
      </div>
      <div className='right-wapper'>
        <div className='latest-time'>{data.latestTime ? data.latestTime : ''}</div>
        <div className='btn-container'>
          <Button shape='circle' className='btn-more-option' icon={<FiMoreHorizontal />} />
        </div>
      </div>
    </div>
  )
}

export default LeftItem
