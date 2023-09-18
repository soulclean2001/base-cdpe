import { Avatar, Button } from 'antd'
import { BiSend } from 'react-icons/bi'
import './style.scss'
import InputEmoji from 'react-input-emoji'
import { useState } from 'react'
import ChatItem from '../ChatItem'
const dataChat = [
  { id: '1', userId: 'my', logo: '', chatValue: 'helooo' },
  { id: '1', userId: 'them', logo: '', chatValue: 'helooo' }
]
const CenterContent = () => {
  const [text, setText] = useState('')

  const handleOnEnter = (text: any) => {
    console.log('enter', text)
  }
  return (
    <div className='center-chat-content-container'>
      <div className='header-content'>
        <Avatar size={'large'} className='logo' src={''} />
        <div className='name'>Tên</div>
      </div>
      <div className='list-chat'>
        {dataChat.map((item) => (
          <ChatItem data={item} />
        ))}
      </div>
      <div className='action-chat-container'>
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder='Nhập nội dung tin nhắn'
        />
        <span className='btn-send'>
          <BiSend />
        </span>
      </div>
    </div>
  )
}

export default CenterContent
