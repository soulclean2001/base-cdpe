import { Col, Row } from 'antd'
import './style.scss'
import LeftContent from './components/LeftContent'
import CenterContent from './components/CenterContent'
import RightContent from './components/RightContent'

const ChatPage = () => {
  return (
    <div className='chat-page-container'>
      <LeftContent />

      <CenterContent />

      <RightContent />
    </div>
  )
}

export default ChatPage
