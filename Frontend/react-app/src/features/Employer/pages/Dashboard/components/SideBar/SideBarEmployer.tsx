import 'react-pro-sidebar/dist/css/styles.css'
import { useEffect, useState } from 'react'

import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar'

import { Link } from 'react-router-dom'
import './sideBar.scss'
import { BookFilled, FileSearchOutlined, FundFilled, ShoppingFilled } from '@ant-design/icons'

import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { handleAutoChangeSideBarByWidth } from '../../../../employerSlice'
import { FaIndustry } from 'react-icons/fa'
import { InfoMeState } from '~/features/Account/meSlice'
const SideBarEmployer = (props: any) => {
  const dispatch = useDispatch()
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const { image, collapsed, toggled, handleToggleSidebar, hidden, roleType } = props
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize())

  // collapsed sidebar
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth <= 786 && collap === false) {
      dispatch(handleAutoChangeSideBarByWidth(true))
    }
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [windowSize.innerWidth <= 786])
  //

  return (
    <ProSidebar
      style={{ zIndex: 500 }}
      hidden={hidden}
      className='employer-sidebar-container'
      collapsed={collap ? collap : false}
      toggled={toggled}
      breakPoint='md'
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '25px 0 25px 18px',
            textTransform: 'uppercase',
            //   fontWeight: 'bold',
            fontSize: 13,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            //   justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img style={{ borderRadius: '50%' }} src={me.avatar} alt='' width={'40px'} height={'40px'} />
          <span style={{ padding: '0 21px', fontWeight: 600, fontSize: '14px' }}>
            {me.name && me.name !== '_' ? me.name : me.email.split('@')[0]}
          </span>
        </div>
      </SidebarHeader>
      {roleType === 'EMPLOYER_ROLE' && (
        <SidebarContent>
          <Menu iconShape='circle'>
            <MenuItem icon={<FundFilled />}>
              Thống kê
              <Link to={'/employer/dashboard'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <SubMenu
              // suffix={<span className="features-menu">count num</span>}  thong bao number++
              title={'Thiết lập công ty'}
              icon={<FaIndustry />}
            >
              <MenuItem>
                Thông tin chung
                <Link to={'/employer/dashboard/company-general'} />
              </MenuItem>
              <MenuItem>
                Địa điểm làm việc
                <Link to={'/employer/dashboard/company-location'} />
              </MenuItem>
              <MenuItem>
                Mẫu email
                <Link to={'/employer/dashboard/email-template'} />
              </MenuItem>
              <MenuItem>
                Thông tin pháp nhân
                <Link to={'/employer/dashboard/legal-info'} />
              </MenuItem>
            </SubMenu>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<BookFilled />}>
              Quản lý bài đăng
              <Link to={'/employer/dashboard/post-manage'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<FileSearchOutlined />}>
              Tìm kiếm ứng viên
              <Link to={'/employer/dashboard/find-candidate'} />
            </MenuItem>
          </Menu>

          <Menu iconShape='circle'>
            <SubMenu
              // suffix={<span className="features-menu">count num</span>}  thong bao number++
              title={'Quản lý hồ sơ - CV'}
              icon={<FaIndustry />}
            >
              <MenuItem>
                Hồ sơ ứng tuyển
                <Link to={'/employer/dashboard/cv-manage'} />
              </MenuItem>
              <MenuItem>
                Hồ sơ đang theo dõi
                <Link to={'/employer/dashboard/company-location'} />
              </MenuItem>
            </SubMenu>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<ShoppingFilled />}>
              Dịch vụ của tôi
              <Link to={'/employer/dashboard/my-services'} />
            </MenuItem>
          </Menu>
        </SidebarContent>
      )}
      {roleType === 'ADMIN_ROLE' && (
        <SidebarContent>
          <Menu iconShape='circle'>
            <MenuItem icon={<FundFilled />}>
              Thống kê
              <Link to={'/admin'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<FileSearchOutlined />}>
              Quản lý tài khoản
              <Link to={'/admin/dashboard/users-manage'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<BookFilled />}>
              Kiểm duyệt bài đăng
              <Link to={'/admin/dashboard/post-review-manage'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<FileSearchOutlined />}>
              Quản lý gói dịch vụ
              <Link to={'/admin/dashboard/services-manage'} />
            </MenuItem>
          </Menu>
          <Menu iconShape='circle'>
            <MenuItem icon={<FundFilled />}>
              Quản lý đơn hàng
              <Link to={'/admin/dashboard/orders-manage'} />
            </MenuItem>
          </Menu>
        </SidebarContent>
      )}

      <SidebarFooter style={{ textAlign: 'center' }}>
        <Menu iconShape='circle'>
          <MenuItem icon={<AiOutlineLogout />}>Đăng xuất</MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  )
}
export default SideBarEmployer
