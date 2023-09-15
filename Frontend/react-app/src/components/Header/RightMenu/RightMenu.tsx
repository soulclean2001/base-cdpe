import { useNavigate } from 'react-router-dom'
import './rightMenu.scss'
import RightMenuPhone from '../RightMenuPhone/RightMenuPhone'
import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd'
import { IoMdNotifications } from 'react-icons/io'
import { AiFillLock, AiFillMessage } from 'react-icons/ai'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { GrUserSettings } from 'react-icons/gr'
import { MdOutlineLogout } from 'react-icons/md'
import { InfoMeState } from '~/features/JobSeeker/jobSeekerSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { logout } from '~/features/Auth/authSlice'

const RightMenu = (props: any) => {
  const me: InfoMeState = useSelector((state: RootState) => state.jobSeeker)
  const disPatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/candidate-login')
  }
  const handleSignUp = () => {
    navigate('/candidate-sign-up')
  }
  const handleTabEmployer = () => {
    navigate('/employer')
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

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'key_logout') {
      disPatch(logout())
      window.location.reload()
    }
    console.log('handle click', e)
  }
  const menuProps = {
    items,
    onClick: handleMenuClick
  }
  return (
    <div className='right_menu_container'>
      <div className='right_menu_container_pc'>
        {me && me.id ? (
          <>
            <Button icon={<IoMdNotifications />} className=' btn-notification' shape='circle' size='large' />
            <Button icon={<AiFillMessage />} className='btn-message' shape='circle' size='large' />
            <Dropdown menu={menuProps}>
              <Button size='large' style={{ display: 'flex', alignItems: 'center', padding: 0, border: 'none' }}>
                <Space>
                  <Avatar style={{ verticalAlign: 'middle' }} src={me?.avatar} size='large'>
                    {me.avatar ? '' : me.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {me.name}
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
