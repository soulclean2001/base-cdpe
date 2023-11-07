import { useState, useEffect } from 'react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './leftMenu.scss'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
// const itemsLogin: MenuProps['items'] = [
//   {
//     label: <NavLink to={'/employer/services'}>Dịch vụ</NavLink>,
//     key: 'services'
//   },
//   {
//     label: <NavLink to={'/employer/about'}>Giới thiệu</NavLink>,
//     key: 'about'
//   },
//   {
//     label: <NavLink to={'/employer/contact'}>Liên hệ</NavLink>,
//     key: 'contact'
//   },
//   {
//     label: <NavLink to={'/employer/dashboard'}>Dashboard</NavLink>,
//     key: 'dashboard'
//   }
// ]
const items: MenuProps['items'] = [
  {
    label: <NavLink to={'/employer/services'}>Dịch vụ</NavLink>,
    key: 'services'
  },
  {
    label: <NavLink to={'/employer/about'}>Giới thiệu</NavLink>,
    key: 'about'
  },
  {
    label: <NavLink to={'/employer/contact'}>Liên hệ</NavLink>,
    key: 'contact'
  }
]
const LeftMenu = (props: any) => {
  const { isLogin, clearActiveMenu } = props

  const auth: AuthState = useSelector((state: RootState) => state.auth)
  if (isLogin && items[items.length - 1]?.key !== 'dashboard') {
    items.push({
      label: (
        <NavLink to={auth.verify === 1 ? '/employer/dashboard' : '/employer/active-page'}>
          {auth.verify === 1 ? 'Bảng điều khiển' : 'Kích hoạt tài khoản'}
        </NavLink>
      ),
      key: 'dashboard'
    })
  }
  if (!isLogin && items[items.length - 1]?.key === 'dashboard') {
    items.pop()
  }

  //set active select menu
  const [current, setCurrent] = useState('none')
  useEffect(() => {
    setCurrent('none')
  }, [clearActiveMenu])
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }
  return (
    <Menu className='left_menu_container' onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
  )
}

export default LeftMenu
