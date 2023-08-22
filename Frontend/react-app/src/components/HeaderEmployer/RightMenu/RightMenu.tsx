import { useNavigate } from 'react-router-dom'
import './rightMenu.scss'
import RightMenuPhone from '../RightMenuPhone/RightMenuPhone'
import { useState } from 'react'
import { IoMdNotifications } from 'react-icons/io'
import { AiFillMessage, AiFillLock } from 'react-icons/ai'

import { MdOutlineLogout } from 'react-icons/md'
import { GrUserSettings } from 'react-icons/gr'
import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
const RightMenu = (props: any) => {
  const { isLogin } = props

  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/employer-login')
  }
  const handleSignUp = () => {
    navigate('/employer-sign-up')
  }
  const handleTabDashboar = () => {
    navigate('/employer/dashboard')
  }
  const items: MenuProps['items'] = [
    {
      label: 'Cài đặt thông tin cá nhân',
      key: 'key_settings_info',
      icon: <GrUserSettings />
    },
    {
      label: 'Đổi mật khẩu',
      key: 'key_changePassword',
      icon: <AiFillLock />
    },
    {
      label: 'Đăng xuất',
      key: 'key_logout',
      icon: <MdOutlineLogout />,
      danger: true
    }
  ]
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'key_logout') alert('Bạn có chắc muốn đăng xuất?')
    console.log('handle click', e)
  }
  const menuProps = {
    items,
    onClick: handleMenuClick
  }
  return (
    <div className='right_menu_container'>
      <div className='right_menu_container_pc'>
        {isLogin ? (
          <>
            <Button
              icon={<IoMdNotifications />}
              className=' btn-notification'
              onClick={handleTabDashboar}
              shape='circle'
              size='large'
            />
            <Button
              icon={<AiFillMessage />}
              className='btn-message'
              onClick={handleTabDashboar}
              shape='circle'
              size='large'
            />
            <Dropdown menu={menuProps}>
              <Button size='large' style={{ display: 'flex', alignItems: 'center', padding: 0, border: 'none' }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  Thanh Phong
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        ) : (
          <>
            <button className='btn btn-login' onClick={() => handleLogin()}>
              Đăng nhập
            </button>
            <button className='btn btn-sign-up' onClick={handleSignUp}>
              Đăng ký
            </button>
          </>
        )}
      </div>
      <>
        <RightMenuPhone />
      </>
    </div>
  )
}
export default RightMenu
