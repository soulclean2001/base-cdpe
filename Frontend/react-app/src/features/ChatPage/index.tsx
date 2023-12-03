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
    if (auth && auth.isLogin && auth.accessToken && auth.verify !== 2) {
      if (auth.role === 2 && roleType === 'CANDIDATE_TYPE') {
        if (auth.verify.toString() === '0') {
          navigate('/active-page')
          return
        }

        navigate('/chat')
        return
      }
      if (auth.role === 1 && roleType === 'EMPLOYER_TYPE') {
        if (auth.verify.toString() === '0') {
          navigate('/employer/active-page')
          return
        }

        navigate('/employer/chat')
        return
      }
      if (auth.role === 0 && roleType === 'ADMIN_TYPE') {
        if (auth.verify.toString() === '0') {
          navigate('/admin/active-page')
          return
        }
        navigate('/admin/chat')
        return
      }
    } else {
      if (roleType === 'CANDIDATE_TYPE') navigate('/candidate-login')
      if (roleType === 'EMPLOYER_TYPE') navigate('/employer-login')
      if (roleType === 'ADMIN_TYPE') navigate('/admin-login')
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
