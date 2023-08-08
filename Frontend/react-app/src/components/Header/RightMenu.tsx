import React, { useState } from 'react'
// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'

const items: MenuProps['items'] = [
  {
    label: 'SignIn',
    key: 'signin',
    icon: <></>
  },
  {
    label: 'SignUp',
    key: 'signup',
    icon: <></>,
    disabled: true
  }
]

const RightMenu = () => {
  const [current, setCurrent] = useState('mail')

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }
  return <Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
}

export default RightMenu
