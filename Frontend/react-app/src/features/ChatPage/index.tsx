// import { Col, Row } from 'antd'
import { useState } from 'react'
import './style.scss'
import LeftContent from './components/LeftContent'
import CenterContent from './components/CenterContent'
import RightContent from './components/RightContent'

const ChatPage = (props: any) => {
  const { roleType } = props
  const [idRoomChat, setIdRoomChat] = useState()
  const handleSetIdChatRoom = (idActive: any) => {
    setIdRoomChat(idActive)
  }
  return (
    <div className='chat-page-container'>
      <LeftContent handleSetIdChatRoom={handleSetIdChatRoom} />

      <CenterContent idRoomChatActive={idRoomChat} />

      <RightContent roleType={roleType} />
    </div>
  )
}

export default ChatPage
