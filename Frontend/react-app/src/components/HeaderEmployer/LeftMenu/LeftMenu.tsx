import { useState, useEffect } from 'react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './leftMenu.scss'
import { NavLink, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  if (isLogin && items[items.length - 1]?.key !== 'dashboard') {
    items.push({
      label: <NavLink to={'/employer/dashboard'}>Dashboard</NavLink>,
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
  // const handleClickMenu: MenuProps['onClick'] = (e) => {
  //   if (e.key === 'dashboard') navigate('/employer/dashboard')
  //   if (e.key === 'services') navigate('/employer/services')
  //   if (e.key === 'about') navigate('/employer/about')
  //   if (e.key === 'contact') navigate('/employer/contact')
  //   console.log('click ', e)
  //   setCurrent(e.key)
  //   //
  // }
  return (
    <Menu
      className='left_menu_container'
      // onClick={handleClickMenu}
      selectedKeys={[current]}
      mode='horizontal'
      items={items}
    />
  )
}

export default LeftMenu
