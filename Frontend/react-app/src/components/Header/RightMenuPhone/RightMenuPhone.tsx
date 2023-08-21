import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Dropdown, MenuProps } from 'antd'
import { NavLink } from 'react-router-dom'
import './rightMenuPhone.scss'
import { useState } from 'react'
const items: MenuProps['items'] = [
  {
    label: (
      <NavLink to='https://www.antgroup.com' className='drop-children phone-login'>
        Đăng nhập
      </NavLink>
    ),
    key: 'phoneLogin'
  },
  {
    label: (
      <NavLink to='https://www.aliyun.com' className={'drop-children phone-sign-up'}>
        Đăng ký
      </NavLink>
    ),
    key: 'phoneSignUp'
  },
  {
    label: (
      <NavLink to='https://www.aliyun.com' className={' drop-children phone-tab-employer'}>
        Đăng tuyển & Tìm hồ sơ
      </NavLink>
    ),
    key: 'phoneTabEmployer'
  }
]
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
          <NavLink to={'/candidate-login'}>
            <p>Đăng nhập</p>
          </NavLink>
          <NavLink to={'/candidate-sign-up'}>
            <p>Đăng ký</p>
          </NavLink>
          <NavLink to={'/employer'}>
            <p>Đăng tuyển & Tìm hồ sơ</p>
          </NavLink>
        </div>
      </Drawer>
    </div>
  )
}

export default RightMenuPhone
