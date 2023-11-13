import { useNavigate } from 'react-router-dom'
import './rightMenu.scss'
import RightMenuPhone from '../RightMenuPhone/RightMenuPhone'
import { useState, useEffect } from 'react'
import { IoMdNotifications } from 'react-icons/io'
import { AiFillMessage, AiFillLock } from 'react-icons/ai'

import { MdOutlineLogout } from 'react-icons/md'
import { GrUserSettings } from 'react-icons/gr'
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, logout } from '~/features/Auth/authSlice'
import { BsFillCartFill } from 'react-icons/bs'
import NotifyDrawer from '~/components/Header/NotifyDrawer/NotifyDrawer'
import ModalProfile from '~/components/ModalProfile'
import { InfoMeState } from '~/features/Account/meSlice'
import { RootState } from '~/app/store'

import { EmployerState, getItemsCart, getMyCart } from '~/features/Employer/employerSlice'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
const dataNotify = [
  { id: '1', name: 'Phan Thanh Phong', actionInfo: 'Đã theo dõi bạn' },
  { id: '2', name: 'Phan Thanh Phong', actionInfo: 'Đã cập nhật CV của anh ấy' }
]
const RightMenu = (props: any) => {
  const { roleType } = props
  const [openNotifyDrawer, setOpenNotifyDrawer] = useState(false)
  const [openModalProfile, setOpenModalProfile] = useState(false)
  const navigate = useNavigate()
  const disPatch = useDispatch()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const employer: EmployerState = useSelector((state: RootState) => state.employer)

  useEffect(() => {
    if (auth.isLogin && auth.role === 1 && auth.verify === 1) fetchGetMyCart()
    console.log('employer', employer.cart)
  }, [])
  const fetchGetMyCart = async () => {
    await dispatchAsync(getMyCart())
    await dispatchAsync(getItemsCart())
  }
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
  const handleTabPageChat = () => {
    if (roleType === 'EMPLOYER_ROLE') navigate('/employer/chat')
    else navigate('/admin/chat')
  }
  const items: MenuProps['items'] = [
    {
      disabled: auth.isLogin && auth.verify === 1 ? false : true,
      label: 'Thông tin cá nhân',
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
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'key_logout') {
      // alert('Bạn có chắc muốn đăng xuất?')
      window.location.reload()
      disPatch(logout())
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
        {me && me.id ? (
          <>
            <ModalProfile openModal={openModalProfile} handleCloseModal={() => setOpenModalProfile(false)} />
            <Button
              icon={<IoMdNotifications />}
              className=' btn-notification'
              onClick={showDrawer}
              shape='circle'
              size='large'
            />
            <NotifyDrawer dataNotify={dataNotify} roleType={roleType} open={openNotifyDrawer} onClose={onCloseDrawer} />

            {roleType === 'EMPLOYER_ROLE' && (
              <>
                {' '}
                <Button
                  disabled={auth.verify === 1 ? false : true}
                  icon={<AiFillMessage />}
                  className='btn-message'
                  onClick={handleTabPageChat}
                  shape='circle'
                  size='large'
                />
                <Badge count={employer.cart.totalItems}>
                  <Button
                    disabled={auth.verify === 1 ? false : true}
                    icon={<BsFillCartFill />}
                    className='btn-cart'
                    onClick={handleTabPageCart}
                    shape='circle'
                    size='large'
                  />
                </Badge>
              </>
            )}

            <Dropdown menu={menuProps}>
              <Button size='large' style={{ display: 'flex', alignItems: 'center', padding: 0, border: 'none' }}>
                <Space>
                  <Avatar src={me.avatar && me.avatar !== '_' ? me.avatar : ''}>
                    {!me.avatar || me.avatar === '_'
                      ? me.name && me.name !== '_'
                        ? me.name.slice(0, 1).toUpperCase()
                        : me.email.slice(0, 1).toUpperCase()
                      : ''}
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
