// import { Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import './style.scss'
import LeftContent from './components/LeftContent'
import CenterContent from './components/CenterContent'
import RightContent from './components/RightContent'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'

const ChatPage = (props: any) => {
  const { roleType } = props

  return (
    <div className='chat-page-container'>
      <LeftContent roleType={roleType} />
      <CenterContent />

      <RightContent roleType={roleType} />
    </div>
  )
}

export default ChatPage
