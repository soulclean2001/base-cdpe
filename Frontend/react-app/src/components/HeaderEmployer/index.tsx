import { useState } from 'react'
import LeftMenu from './LeftMenu/LeftMenu'
import RightMenu from './RightMenu/RightMenu'
import { NavLink } from 'react-router-dom'

import '@fontsource/rubik' // Defaults to weight 400
import '@fontsource/rubik/400.css' // Specify weight
import '@fontsource/rubik/400-italic.css' //
import './header.scss'
import { useDispatch, useSelector } from 'react-redux'
import { handleChangeSideBar } from '~/features/Employer/employerSlice'
import { Button } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
// import '../Header/header.scss'
const HeaderEmployer = (props: any) => {
  const { roleType, hiddenButtonCollapsed } = props
  console.log(roleType)
  const [isLogin, setIsLogin] = useState(true)
  const [clearActiveMenu, setClearActiveMenu] = useState(false)
  const dispatch = useDispatch()
  const handleClickLogo = () => {
    setClearActiveMenu(!clearActiveMenu)
  }
  return (
    <nav
      className='menu'
      id='employer-header-container'
      style={{ paddingLeft: roleType === 'ADMIN_ROLE' ? 0 : '15px' }}
    >
      <div
        className='menu__logo'
        onClick={handleClickLogo}
        style={{ paddingLeft: roleType === 'ADMIN_ROLE' ? 0 : '15px' }}
      >
        {roleType === 'EMPLOYER_ROLE' ? (
          <NavLink to={'/employer'} className={'header_logo'}>
            HFWork
          </NavLink>
        ) : (
          <>
            <Button
              hidden={hiddenButtonCollapsed}
              type='text'
              icon={<MenuUnfoldOutlined />}
              onClick={() => dispatch(handleChangeSideBar())}
              style={{
                fontSize: '16px',
                width: 50,
                height: 50
              }}
            />

            <NavLink
              to={'/admin'}
              className={'header_logo'}
              style={{ paddingLeft: hiddenButtonCollapsed ? '15px' : 0 }}
            >
              HFWork
            </NavLink>
          </>
        )}
      </div>
      <div className='menu__container'>
        <div className='menu_left'>
          <div className='left_menu_container'>
            {roleType === 'EMPLOYER_ROLE' ? <LeftMenu clearActiveMenu={clearActiveMenu} isLogin={isLogin} /> : <></>}
          </div>
        </div>
        <div className='menu_rigth'>
          <div className='menu_rigth_container'>
            <RightMenu isLogin={isLogin} roleType={roleType} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HeaderEmployer
