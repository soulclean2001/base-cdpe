import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'

import './style.scss'

const SettingsPage = () => {
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
