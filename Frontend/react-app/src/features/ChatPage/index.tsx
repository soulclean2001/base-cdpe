// import { Col, Row } from 'antd'
import { useEffect } from 'react'
import './style.scss'
import LeftContent from './components/LeftContent'
import CenterContent from './components/CenterContent'
import RightContent from './components/RightContent'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { AuthState } from '../Auth/authSlice'
import { useNavigate } from 'react-router-dom'
// import { isExpired } from '~/utils/jwt'

const ChatPage = (props: any) => {
  const { roleType } = props
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role === 2) {
        if (auth.verify.toString() === '0') {
          navigate('/active-page')
          return
        }
        if (auth.verify === 2) {
          navigate('/candidate-login')
          return
        }
        navigate('/chat')
        return
      }
      if (auth.role === 1) {
        if (auth.verify.toString() === '0') {
          navigate('/employer/active-page')
          return
        }
        if (auth.verify === 2) {
          navigate('/candidate-login')
          return
        }
        navigate('/employer/chat')
        return
      }
      if (auth.role === 0) {
        if (auth.verify.toString() === '0') {
          navigate('/admin/active-page')
          return
        }
        if (auth.verify === 2) {
          navigate('/candidate-login')
          return
        }
        navigate('/admin/chat')
        return
      }
    } else {
      if (auth.role === 2) navigate('/candidate-login')
      if (auth.role === 1) navigate('/employer-login')
      if (auth.role === 0) navigate('/admin-login')
    }
  }, [auth])
  return (
    <div className='chat-page-container' style={{ height: auth.role === 0 ? '100vh' : '89vh' }}>
      <LeftContent roleType={roleType} />
      <CenterContent />

      <RightContent roleType={roleType} />
    </div>
  )
}

export default ChatPage
