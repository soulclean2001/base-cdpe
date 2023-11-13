import { MenuOutlined } from '@ant-design/icons'
import { Avatar, Drawer } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import './rightMenuPhone.scss'
import { useState } from 'react'
import { AuthState, logout } from '~/features/Auth/authSlice'
import { InfoMeState } from '~/features/Account/meSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'

import ModalChangePassword from '~/components/ModalChangePassword'
import ModalProfile from '~/components/ModalProfile'
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
  const [open, setOpen] = useState(false)
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const [isOpenModalChangePass, setIsOpenModalChangePassword] = useState(false)
  const [isOpenModalProfile, setIsOpenModalProfile] = useState(false)
  const navigate = useNavigate()
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
      <Drawer className='drawer-mobi-container' title='HFWork' placement='right' onClose={onClose} open={open}>
        {!auth.isLogin && (
          <div className='menu-content'>
            <NavLink to={'/employer-login'}>
              <p style={styleForItemMenuPhone}>Đăng nhập</p>
            </NavLink>
            <NavLink to={'/employer-sign-up'}>
              <p style={styleForItemMenuPhone}>Đăng ký</p>
            </NavLink>
            <NavLink to={'/'}>
              <p style={styleForItemMenuPhone}>Bạn là ứng tuyển viên?</p>
            </NavLink>
          </div>
        )}
        {auth.isLogin && (
          <div className='menu-content' style={{ color: '#333333' }}>
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
            {auth.verify !== 1 ? (
              <p onClick={() => navigate('/employer/active-page')} style={styleForItemMenuPhone}>
                Kích hoạt tài khoản
              </p>
            ) : (
              <>
                <p onClick={() => setIsOpenModalProfile(true)} style={styleForItemMenuPhone}>
                  Thông tin cá nhân
                </p>

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
              style={{
                ...styleForItemMenuPhone,
                color: 'red'
              }}
            >
              Đăng xuất
            </p>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default RightMenuPhone
