import { MenuOutlined } from '@ant-design/icons'
import { Drawer, MenuProps } from 'antd'
import { NavLink } from 'react-router-dom'
import './rightMenuPhone.scss'
import { useState } from 'react'

const RightMenuPhone = () => {
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
          <NavLink to={'/employer-login'}>
            <p>Đăng nhập</p>
          </NavLink>
          <NavLink to={'/employer-sign-up'}>
            <p>Đăng ký</p>
          </NavLink>
          <NavLink to={'/'}>
            <p>Bạn là ứng tuyển viên</p>
          </NavLink>
        </div>
      </Drawer>
    </div>
  )
}

export default RightMenuPhone
