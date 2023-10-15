import { Outlet, useNavigate } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'

import './style.scss'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
// import { isExpired } from '~/utils/jwt'

const SettingsPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role !== 2) navigate('/candidate-login')
    } else {
      navigate('/candidate-login')
    }
  }, [auth])
  return (
    <div className='settings-page-container'>
      <div className='sider-container'>
        <SideBar />
      </div>
      <div className='settings-page-content'>
        <Outlet />
      </div>
    </div>
  )
}

export default SettingsPage
