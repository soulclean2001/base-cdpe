import { useEffect, useState } from 'react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './leftMenu.scss'
import { NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { AuthState } from '~/features/Auth/authSlice'

const LeftMenu = (props: any) => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const { clearActiveMenu } = props

  const [current, setCurrent] = useState('mail')
  const items: MenuProps['items'] = [
    {
      label: <NavLink to={'/jobs'}>Việc làm</NavLink>,
      key: 'jobSubmenu'
    },
    {
      label: <NavLink to={'/companies'}>Công ty</NavLink>,
      key: 'companySubmenu'
    },
    {
      label: (
        <NavLink
          style={{ pointerEvents: auth.isLogin && auth.verify === 1 ? 'auto' : 'none' }}
          hidden={auth.isLogin ? false : true}
          to={'/CV'}
        >
          Hồ sơ & CV
        </NavLink>
      ),
      key: 'CVSubmenu',
      disabled: auth.isLogin && auth.verify === 1 ? false : true
    }
  ]
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }
  //set active select menu
  useEffect(() => {
    setCurrent('none')
  }, [clearActiveMenu])
  return (
    <Menu className='left_menu_container' onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
  )
}

export default LeftMenu
