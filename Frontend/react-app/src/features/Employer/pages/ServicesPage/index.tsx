import { Tabs } from 'antd'

import { TabsProps } from 'antd/lib'
import './style.scss'
import PostServices from './pages/PostServices'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
// import { isExpired } from '~/utils/jwt'
const ServicesPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role !== 1) {
        navigate('/employer-login')
        return
      }
      if (auth.verify !== 1) {
        navigate('/employer/active-page')
        return
      }
    } else {
      navigate('/employer-login')
    }
  }, [auth])
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'ĐĂNG TUYỂN & QUẢNG CÁO',
      children: <PostServices />
    }
    // {
    //   key: '2',
    //   label: 'TÌM HỒ SƠ',
    //   children: <></>
    // }
  ]
  return (
    <div className='services-page-container'>
      <div className='tab-service-wapper'>
        <Tabs className='tab-options-services' defaultActiveKey='1' items={items} />
      </div>
    </div>
  )
}

export default ServicesPage
