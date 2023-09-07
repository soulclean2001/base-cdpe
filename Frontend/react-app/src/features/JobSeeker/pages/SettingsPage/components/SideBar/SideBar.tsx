import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { FaClipboardUser } from 'react-icons/fa6'
import { IoNotificationsSharp } from 'react-icons/io5'
import { Layout, Menu, Button, MenuProps } from 'antd'

const { Sider } = Layout
import { Avatar } from 'antd'
import { useState } from 'react'
import './style.scss'
import { AiFillDashboard, AiFillSetting } from 'react-icons/ai'
import { FaUserCog } from 'react-icons/fa'
import { BiSolidFactory } from 'react-icons/bi'
import { MdWork } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const SideBar = () => {
  const navigation = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [hiddenHeader, setHiddenHeader] = useState(false)
  const onClickMenu: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    if (e.key === '1') navigation('/settings')
  }
  return (
    <Layout className='side-bar-settings-container'>
      <Sider className='sider-settings-page-container' trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className='header-side-bar' style={{ height: `${hiddenHeader ? 'auto' : '100px'}` }}>
          <div className='user-header-side-bar' hidden={hiddenHeader}>
            <Avatar src={'P'} size={'large'} className='avatar-header-side-bar' />
            <div className='name-header-side-bar'>Thanh Phong</div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: `${hiddenHeader ? '100%' : 'auto'}`
            }}
          >
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                setCollapsed(!collapsed), setHiddenHeader(!hiddenHeader)
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: 'white'
              }}
            />
          </div>
        </div>
        <Menu
          style={{ backgroundColor: 'rgb(247, 248, 250)', borderInlineEnd: 'none' }}
          //   theme='light'
          onClick={onClickMenu}
          mode='inline'
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <AiFillDashboard />
                </span>
              ),
              label: 'Tổng Quan',
              style: { display: 'flex', alignItems: 'center', marginTop: '10px' }
            },
            {
              key: '2',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <FaClipboardUser />
                </span>
              ),
              label: 'Hồ Sơ Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '3',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <FaUserCog />
                </span>
              ),
              label: 'Thiết Lập Hồ Sơ',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '4',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <BiSolidFactory />
                </span>
              ),
              label: 'Công Ty Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '5',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <MdWork />
                </span>
              ),
              label: 'Việc Làm Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '6',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <IoNotificationsSharp />
                </span>
              ),
              label: 'Thông Báo Việc Làm',
              style: { display: 'flex', alignItems: 'center' }
            },
            {
              key: '7',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <AiFillSetting />
                </span>
              ),
              label: 'Quản Lý Tài Khoản',
              style: { display: 'flex', alignItems: 'center' }
            }
          ]}
        />
      </Sider>
    </Layout>
  )
}

export default SideBar
