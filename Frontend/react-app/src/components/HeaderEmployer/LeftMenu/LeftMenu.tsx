import { useState, useEffect } from 'react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './leftMenu.scss'
import { NavLink, useNavigate } from 'react-router-dom'
const items: MenuProps['items'] = [
  {
    label: 'Dịch vụ',
    key: 'services'
  },
  {
    label: 'Giới thiệu',
    key: 'about'
  },
  {
    label: 'Liên hệ',
    key: 'contact'
  }
]
const LeftMenu = (props: any) => {
  const { isLogin, clearActiveMenu } = props
  const navigate = useNavigate()
  if (isLogin && items[0]?.key !== 'dashboard') {
    items.unshift({
      label: 'Dashboard',
      key: 'dashboard'
    })
  }
  //set active select menu
  const [current, setCurrent] = useState('none')
  useEffect(() => {
    setCurrent('none')
  }, [clearActiveMenu])
  const handleClickMenu: MenuProps['onClick'] = (e) => {
    if (e.key === 'dashboard') navigate('/employer/dashboard')
    if (e.key === 'services') navigate('/employer/services')
    if (e.key === 'about') navigate('/employer/about')
    if (e.key === 'contact') navigate('/employer/contact')
    console.log('click ', e)
    setCurrent(e.key)
    //
  }
  return (
    <Menu
      className='left_menu_container'
      onClick={handleClickMenu}
      selectedKeys={[current]}
      mode='horizontal'
      items={items}
    />
  )
}

export default LeftMenu
