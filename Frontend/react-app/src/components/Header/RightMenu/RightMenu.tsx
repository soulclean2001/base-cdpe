import { NavLink, useNavigate } from 'react-router-dom'
import './rightMenu.scss'
import RightMenuPhone from '../RightMenuPhone/RightMenuPhone'
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from 'antd'
import { IoMdNotifications } from 'react-icons/io'
import { AiFillDashboard, AiFillLock, AiFillMessage } from 'react-icons/ai'
import { DownOutlined } from '@ant-design/icons'
import { GrUserSettings } from 'react-icons/gr'
import { MdOutlineLogout } from 'react-icons/md'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { AuthState, logout } from '~/features/Auth/authSlice'
import { useState } from 'react'
import NotifyDrawer from '../NotifyDrawer/NotifyDrawer'
import ModalProfile from '~/components/ModalProfile'
import ModalChangePassword from '~/components/ModalChangePassword'
import { InfoMeState } from '~/features/Account/meSlice'
import { FaUserCheck } from 'react-icons/fa'
import { NotifyState } from '../NotifyDrawer/notifySlice'

const RightMenu = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const disPatch = useDispatch()
  const navigate = useNavigate()
  const [openModalProfile, setOpenModalProfile] = useState(false)
  const [openNotifyDrawer, setOpenNotifyDrawer] = useState(false)
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false)
  const handleLogin = () => {
    navigate('/candidate-login')
  }
  const handleSignUp = () => {
    navigate('/candidate-sign-up')
  }
  const handleTabEmployer = () => {
    navigate('/employer')
  }
  const handleTabChat = () => {
    navigate('/chat')
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <>
          {auth.verify.toString() === '0' ? (
            <NavLink to={'/active-page'}>Kích hoạt tài khoản</NavLink>
          ) : (
            <NavLink to={'/settings'}>Bảng điều khiển</NavLink>
          )}
        </>
      ),
      key: 'key_settings_general',
      icon: (
        <div style={{ paddingRight: '3px' }}>
          {auth.verify.toString() === '0' ? <FaUserCheck /> : <AiFillDashboard />}
        </div>
      ),
      style: { minWidth: '250px', padding: '10px', fontSize: '16px' }
    },
    {
      disabled: auth.isLogin && auth.verify === 1 ? false : true,
      label: `Thông tin cá nhân`,
      key: 'key_settings_info',
      icon: <GrUserSettings />,
      style: { minWidth: '250px', padding: '10px', fontSize: '16px' }
    },

    {
      disabled: auth.isLogin && auth.verify === 1 ? false : true,
      label: 'Đổi mật khẩu',
      key: 'key_changePassword',
      icon: <AiFillLock />,
      style: { minWidth: '250px', padding: '10px', fontSize: '16px' }
    },
    {
      label: 'Đăng xuất',
      key: 'key_logout',
      icon: <MdOutlineLogout />,
      danger: true,
      style: { minWidth: '250px', padding: '10px', fontSize: '16px' }
    }
  ]

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'key_logout') {
      disPatch(logout())
      window.location.reload()
    }
    if (e.key === 'key_settings_info') setOpenModalProfile(true)
    if (e.key === 'key_changePassword') setOpenModalChangePassword(true)
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
        {me && me.id ? (
          <>
            <ModalChangePassword open={openModalChangePassword} handleClose={() => setOpenModalChangePassword(false)} />
            <ModalProfile openModal={openModalProfile} handleCloseModal={() => setOpenModalProfile(false)} />
            <Badge count={notificaions.totalNotRead}>
              <Button
                icon={<IoMdNotifications />}
                onClick={showDrawer}
                className=' btn-notification'
                shape='circle'
                size='large'
              />
            </Badge>

            <NotifyDrawer roleType='CANDIDATE_ROLE' open={openNotifyDrawer} onClose={onCloseDrawer} />
            <Button
              disabled={auth.verify === 1 ? false : true}
              icon={<AiFillMessage />}
              onClick={handleTabChat}
              className='btn-message'
              shape='circle'
              size='large'
            />
            <Dropdown menu={menuProps}>
              <Button size='large' style={{ display: 'flex', alignItems: 'center', padding: 0, border: 'none' }}>
                <Space>
                  <Avatar style={{ verticalAlign: 'middle' }} src={me?.avatar} size='large'>
                    {me.avatar ? '' : me.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {me.name && me.name !== '_' ? me.name : me.email.split('@')[0]}
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
            <button className='btn btn-tab-employer' onClick={handleTabEmployer}>
              Đăng tuyển & Tìm hồ sơ
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
