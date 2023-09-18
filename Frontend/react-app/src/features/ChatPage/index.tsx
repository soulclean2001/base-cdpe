import { Col, Row } from 'antd'
import './style.scss'
import LeftContent from './components/LeftContent'
import CenterContent from './components/CenterContent'
import RightContent from './components/RightContent'

const ChatPage = () => {
  return (
    <Row className='chat-page-container'>
      <Col md={6}>
        <LeftContent />
      </Col>
      <Col md={12}>
        <CenterContent />
      </Col>
      <Col md={6}>
        <RightContent />
      </Col>
    </Row>
  )
}

export default ChatPage
