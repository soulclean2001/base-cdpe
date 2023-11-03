import { Avatar, Button } from 'antd'
import './style.scss'
import { FiMoreHorizontal } from 'react-icons/fi'
import { useState } from 'react'
import { RoomType } from '~/types'
interface DataType {
  id: string
  logo: string
  name: string
  latestChat: string
  latestTime: string
}
interface PropsType {
  isActive: boolean
  data: RoomType
  roleType: 'ADMIN_TYPE' | 'CANDIDATE_TYPE' | 'EMPLOYER_TYPE'
}
const LeftItem = (props: any) => {
  const { isActive, data, roleType }: PropsType = props
  if (!data) return <div>Không có tin nhắn</div>

  if (roleType === 'EMPLOYER_TYPE') {
    return (
      <div className={isActive ? 'left-chat-item-container active-chat-item' : 'left-chat-item-container'}>
        <div className='left-wapper'>
          <Avatar className='logo' size={'large'} src={data.user.avatar ? data.user.avatar : ''} />
          <div className='info-chat-container'>
            <div className='name'>{data.user.name ? data.user.name : 'Tên'}</div>
            <div className='latest-message'>
              {data.last_conversation && data.last_conversation.content ? data.last_conversation.content : ''}
            </div>
          </div>
        </div>
        <div className='right-wapper'>
          <div className='latest-time'>{''}</div>
          <div className='btn-container'>
            <Button shape='circle' className='btn-more-option' icon={<FiMoreHorizontal />} />
          </div>
        </div>
      </div>
    )
  }

  if (roleType === 'CANDIDATE_TYPE') {
    return (
      <div className={isActive ? 'left-chat-item-container active-chat-item' : 'left-chat-item-container'}>
        <div className='left-wapper'>
          <Avatar className='logo' size={'large'} src={data.company.logo ? data.company.logo : ''} />
          <div className='info-chat-container'>
            <div className='name'>{data.company.company_name ? data.company.company_name : 'Tên'}</div>
            <div className='latest-message'>{data.last_conversation.content ? data.last_conversation.content : ''}</div>
          </div>
        </div>
        <div className='right-wapper'>
          <div className='latest-time'>{''}</div>
          <div className='btn-container'>
            <Button shape='circle' className='btn-more-option' icon={<FiMoreHorizontal />} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isActive ? 'left-chat-item-container active-chat-item' : 'left-chat-item-container'}>
      <div>Không có tin nhắn</div>
    </div>
  )
}

export default LeftItem
