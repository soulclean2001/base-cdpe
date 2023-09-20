import { Avatar, Button } from 'antd'
import { BiSend } from 'react-icons/bi'
import './style.scss'
import InputEmoji from 'react-input-emoji'
import { useState, useEffect } from 'react'
import ChatItem from '../ChatItem'
const dataChat1 = [
  { id: '1', userId: 'my', logo: '', chatValue: 'helooo' },
  { id: '2', userId: 'them', logo: '', chatValue: 'helooo' }
]
const dataChat2 = [
  { id: '1', userId: 'my', logo: '', chatValue: 'loo' },
  { id: '2', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '3', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '4', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '5', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '6', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '7', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '8', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '9', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '10', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '11', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '12', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '13', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '14', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '15', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '16', userId: 'them', logo: '', chatValue: 'lỏ' },
  { id: '17', userId: 'them', logo: '', chatValue: 'lỏooooooooooooooooooooooooooooo' },
  { id: '18', userId: 'them', logo: '', chatValue: '.' }
]
const CenterContent = (props: any) => {
  const { idRoomChatActive } = props

  const [text, setText] = useState('')
  // const [dataChat, setDataChat] = useState()
  useEffect(() => {
    console.log('id room chat from center chat compoent', idRoomChatActive)
    handleGetDataChatRoom()
  }, [idRoomChatActive])
  const handleGetDataChatRoom = () => {
    if (idRoomChatActive === '1') return dataChat1
    return dataChat2
  }
  const handleOnEnter = (text: any) => {
    console.log('enter', text)
  }
  if (!idRoomChatActive)
    return (
      <div
        className='center-chat-content-container'
        style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <h4 style={{ textAlign: 'center' }}>Chào mừng bạn đến với HFWork</h4>
      </div>
    )
  return (
    <div className='center-chat-content-container'>
      <div className='header-content'>
        <Avatar size={'large'} className='logo' src={''} />
        <div className='name'>Tên</div>
      </div>
      <div className='list-chat'>
        {handleGetDataChatRoom().map((item) => (
          <ChatItem key={item.id} data={item} />
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
