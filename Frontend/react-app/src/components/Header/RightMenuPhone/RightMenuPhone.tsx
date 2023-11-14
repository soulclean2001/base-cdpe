import { MenuOutlined } from '@ant-design/icons'
import { Avatar, Drawer } from 'antd'
import { NavLink } from 'react-router-dom'
import './rightMenuPhone.scss'
import { useState } from 'react'

import { RootState } from '~/app/store'
import { useDispatch, useSelector } from 'react-redux'
import { InfoMeState } from '~/features/Account/meSlice'
import { AuthState, logout } from '~/features/Auth/authSlice'
import ModalProfile from '~/components/ModalProfile'
import ModalChangePassword from '~/components/ModalChangePassword'

const styleForItemMenuPhone = {
  marginBottom: 0,
  fontSize: '16px',
  borderTop: '1px solid  #ebebeb',
  borderBottom: '1px solid #ebebeb',
  padding: '15px 0',
  fontWeight: 500,
  cursor: 'pointer',
  color: '#333333'
}
const RightMenuPhone = () => {
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const [open, setOpen] = useState(false)
  const [isOpenModalChangePass, setIsOpenModalChangePassword] = useState(false)
  const [isOpenModalProfile, setIsOpenModalProfile] = useState(false)
  const distPath = useDispatch()
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div className='right_menu_container_phone'>
      <MenuOutlined onClick={showDrawer} />
      <ModalProfile openModal={isOpenModalProfile} handleCloseModal={() => setIsOpenModalProfile(false)} />
      <ModalChangePassword open={isOpenModalChangePass} handleClose={() => setIsOpenModalChangePassword(false)} />
      <Drawer title='HFWork' placement='right' onClose={onClose} open={open}>
        <div className='menu-content'>
          {auth.isLogin && me && me.id ? (
            <>
              <div
                className='info-user-wapper'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderTop: '1px solid  #ebebeb',
                  borderBottom: '1px solid #ebebeb',
                  padding: '15px 0',
                  marginBottom: '10px'
                }}
              >
                <Avatar size={'large'} src={me.avatar ? me.avatar : ''}></Avatar>
                <div className='info'>
                  <div className='name' style={{ fontWeight: 500, fontSize: '16px' }}>
                    {me.name}
                  </div>
                  <div className='email' style={{ fontWeight: 500, fontSize: '16px' }}>
                    {me.email}
                  </div>
                </div>
              </div>
              {auth.isLogin && auth.verify.toString() === '0' && (
                <NavLink to={'/active-page'}>
                  <p style={styleForItemMenuPhone}>Kích hoạt tài khoản</p>
                </NavLink>
              )}
              {auth.isLogin && auth.verify === 1 && (
                <>
                  <NavLink to={'/settings'}>
                    <p style={styleForItemMenuPhone}>Bảng điều khiển</p>
                  </NavLink>

                  <p onClick={() => setIsOpenModalProfile(true)} style={styleForItemMenuPhone}>
                    Thông tin cá nhân
                  </p>

                  <NavLink to={'/CV'}>
                    <p style={styleForItemMenuPhone}>Hồ sơ của tôi</p>
                  </NavLink>
                  <NavLink to={'/settings/my-companies'}>
                    <p style={styleForItemMenuPhone}>Công ty đang theo dõi</p>
                  </NavLink>
                  <NavLink to={'/settings/my-jobs'}>
                    <p style={styleForItemMenuPhone}>Việc làm của tôi</p>
                  </NavLink>

                  <p onClick={() => setIsOpenModalChangePassword(true)} style={styleForItemMenuPhone}>
                    Đổi mật khẩu
                  </p>
                </>
              )}

              <p
                onClick={() => {
                  distPath(logout())
                  window.location.reload()
                }}
                style={{ ...styleForItemMenuPhone, color: 'red' }}
              >
                Đăng xuất
              </p>
            </>
          ) : (
            <>
              <NavLink to={'/candidate-login'}>
                <p style={styleForItemMenuPhone}>Đăng nhập</p>
              </NavLink>
              <NavLink to={'/candidate-sign-up'}>
                <p style={styleForItemMenuPhone}>Đăng ký</p>
              </NavLink>
              <NavLink to={'/employer'}>
                <p style={styleForItemMenuPhone}>Đăng tuyển & Tìm hồ sơ</p>
              </NavLink>
            </>
          )}
        </div>
      </Drawer>
    </div>
  )
}

export default RightMenuPhone
