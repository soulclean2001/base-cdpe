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
      label: <NavLink to={'/employer/dashboard'}>Bảng điều khiển</NavLink>,
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
