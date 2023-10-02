import { useState } from 'react'
import LeftMenu from './LeftMenu/LeftMenu'
import RightMenu from './RightMenu/RightMenu'
import { NavLink } from 'react-router-dom'

import '@fontsource/rubik' // Defaults to weight 400
import '@fontsource/rubik/400.css' // Specify weight
import '@fontsource/rubik/400-italic.css' //
import './header.scss'
// import '../Header/header.scss'
const HeaderEmployer = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [clearActiveMenu, setClearActiveMenu] = useState(false)
  const handleClickLogo = () => {
    setClearActiveMenu(!clearActiveMenu)
  }
  return (
    <nav className='menu' id='employer-header-container'>
      <div className='menu__logo' onClick={handleClickLogo}>
        <NavLink to={'/employer'} className={'header_logo'}>
          HFWork
        </NavLink>
      </div>
      <div className='menu__container'>
        <div className='menu_left'>
          <div className='left_menu_container'>
            <LeftMenu clearActiveMenu={clearActiveMenu} isLogin={isLogin} />
          </div>
        </div>
        <div className='menu_rigth'>
          <div className='menu_rigth_container'>
            <RightMenu isLogin={isLogin} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HeaderEmployer
