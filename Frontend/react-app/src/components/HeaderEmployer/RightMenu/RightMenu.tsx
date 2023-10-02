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
import { useDispatch } from 'react-redux'
import { logout } from '~/features/Auth/authSlice'
import { BsFillCartFill } from 'react-icons/bs'
import NotifyDrawer from '~/components/Header/NotifyDrawer/NotifyDrawer'
import ModalProfile from '~/components/ModalProfile'

const dataNotify = [
  { id: '1', name: 'Phan Thanh Phong', actionInfo: 'Đã theo dõi bạn' },
  { id: '2', name: 'Phan Thanh Phong', actionInfo: 'Đã cập nhật CV của anh ấy' }
]
const RightMenu = (props: any) => {
  const { isLogin } = props
  const [openNotifyDrawer, setOpenNotifyDrawer] = useState(false)
  const [openModalProfile, setOpenModalProfile] = useState(false)
  const navigate = useNavigate()
  const disPatch = useDispatch()
  const handleLogin = () => {
    navigate('/employer-login')
  }
  const handleSignUp = () => {
    navigate('/employer-sign-up')
  }
  const handleTabJobSeeker = () => {
    navigate('/')
  }
  const handleTabDashboar = () => {
    navigate('/employer/dashboard')
  }
  const handleTabPageCart = () => {
    navigate('/employer/cart')
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
    if (e.key === 'key_logout') {
      alert('Bạn có chắc muốn đăng xuất?')
      // disPatch(logout())
    }
    console.log('handle click', e)
    if (e.key === 'key_settings_info') setOpenModalProfile(true)
    console.log('handle click', e)
  }
  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  const showDrawer = () => {
    setOpenNotifyDrawer(true)
  }

  const onCloseDrawer = () => {
    setOpenNotifyDrawer(false)
  }

  return (
    <div className='right_menu_container'>
      <div className='right_menu_container_pc'>
        {isLogin ? (
          <>
            <ModalProfile openModal={openModalProfile} handleCloseModal={() => setOpenModalProfile(false)} />
            <Button
              icon={<IoMdNotifications />}
              className=' btn-notification'
              onClick={showDrawer}
              shape='circle'
              size='large'
            />
            <NotifyDrawer dataNotify={dataNotify} roleType='EMPLOYER' open={openNotifyDrawer} onClose={onCloseDrawer} />

            <Button
              icon={<AiFillMessage />}
              className='btn-message'
              onClick={handleTabDashboar}
              shape='circle'
              size='large'
            />
            <Button
              icon={<BsFillCartFill />}
              className='btn-cart'
              onClick={handleTabPageCart}
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
            <button className='btn btn-tab-job-seeker' onClick={handleTabJobSeeker}>
              Tạo CV & Tìm việc làm
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
