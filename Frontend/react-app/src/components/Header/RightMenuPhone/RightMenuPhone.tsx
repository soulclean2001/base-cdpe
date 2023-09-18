import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Dropdown, MenuProps } from 'antd'
import { NavLink } from 'react-router-dom'
import './rightMenuPhone.scss'
import { useState } from 'react'
import { InfoMeState } from '~/features/JobSeeker/jobSeekerSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
const items: MenuProps['items'] = [
  {
    label: (
      <NavLink to='/login' className='drop-children phone-login'>
        Đăng nhập
      </NavLink>
    ),
    key: 'phoneLogin'
  },
  {
    label: (
      <NavLink to='/sign-up' className={'drop-children phone-sign-up'}>
        Đăng ký
      </NavLink>
    ),
    key: 'phoneSignUp'
  },
  {
    label: (
      <NavLink to='/employer' className={' drop-children phone-tab-employer'}>
        Đăng tuyển & Tìm hồ sơ
      </NavLink>
    ),
    key: 'phoneTabEmployer'
  }
]
const RightMenuPhone = () => {
  const me: InfoMeState = useSelector((state: RootState) => state.jobSeeker)
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div className='right_menu_container_phone'>
      {/* <Dropdown menu={{ items }} trigger={['click']}>
      <MenuOutlined/>
    </Dropdown> */}
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <MenuOutlined onClick={showDrawer} />
      <Drawer title='HFWork' placement='right' onClose={onClose} open={open}>
        <div className='menu-content'>
          {me && me.id ? (
            <>
              <NavLink to={'/settings'}>
                <p>Tổng quan</p>
              </NavLink>
              <NavLink to={'/CV'}>
                <p>Hồ sơ của tôi</p>
              </NavLink>
              <NavLink to={'/settings/my-companies'}>
                <p>Công ty của tôi</p>
              </NavLink>
              <NavLink to={'/settings/my-jobs'}>
                <p>Việc làm của tôi</p>
              </NavLink>
              <NavLink to={'/settings/notify-jobs'}>
                <p>Thông báo việc làm</p>
              </NavLink>
              <NavLink to={'/settings/my-account'}>
                <p>Cài đặt tài khoản</p>
              </NavLink>
              <NavLink to={'/settings/my-account'}>
                <p>Đổi mật khẩu</p>
              </NavLink>
              <NavLink to={'/logout'}>
                <p>Đăng xuất</p>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={'/candidate-login'}>
                <p>Đăng nhập</p>
              </NavLink>
              <NavLink to={'/candidate-sign-up'}>
                <p>Đăng ký</p>
              </NavLink>
              <NavLink to={'/employer'}>
                <p>Đăng tuyển & Tìm hồ sơ</p>
              </NavLink>
            </>
          )}
        </div>
      </Drawer>
    </div>
  )
}

export default RightMenuPhone
