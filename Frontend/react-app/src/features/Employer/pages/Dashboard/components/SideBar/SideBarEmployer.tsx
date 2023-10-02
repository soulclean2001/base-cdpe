import 'react-pro-sidebar/dist/css/styles.css'
import { useRef, useEffect, useState } from 'react'
import logo from '../../../../../../assets/react.svg'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar'

import { Link } from 'react-router-dom'
import './sideBar.scss'
import {
  BookFilled,
  FileSearchOutlined,
  FundFilled,
  SettingFilled,
  ShopFilled,
  ShoppingFilled,
  SnippetsFilled
} from '@ant-design/icons'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { handleAutoChangeSideBarByWidth } from '../../../../employerSlice'
import { FaIndustry } from 'react-icons/fa'
const SideBarEmployer = (props: any) => {
  const dispatch = useDispatch()
  const { image, collapsed, toggled, handleToggleSidebar, hidden } = props
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
            padding: '24px 0 24px 18px',
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
          <img src={logo} alt='' width={'40px'} height={'40px'} />
          <span style={{ padding: '0 21px' }}>Thanh Phong</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape='circle'>
          <MenuItem icon={<FundFilled />}>
            Thống kê
            <Link to={'/employer/dashboard'} />
          </MenuItem>
        </Menu>
        {/* <Menu iconShape='circle'>
          <SubMenu
            title={'Thiết lập tài khoản'}
            icon={<SettingFilled />}
          >
            <MenuItem>
              Thông tin tài khoản
              <Link to={'/employer/dashboard/my-account-info'} />
            </MenuItem>
            <MenuItem>
              Lịch sử hoạt động
              <Link to={'/employer/dashboard/history'} />
            </MenuItem>
          </SubMenu>
        </Menu> */}
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
          <MenuItem icon={<FundFilled />}>
            Quản lý hồ sơ ứng viên
            <Link to={'/employer/dashboard/cv-manage'} />
          </MenuItem>
        </Menu>

        {/* <Menu iconShape='circle'>
          <MenuItem icon={<ShopFilled />}>
            Mua dịch vụ
            <Link to={'/employer/services'} />
          </MenuItem>
        </Menu> */}
        <Menu iconShape='circle'>
          <MenuItem icon={<ShoppingFilled />}>
            Dịch vụ của tôi
            <Link to={'/employer/my-services'} />
          </MenuItem>
        </Menu>
        {/* <Menu iconShape='circle'>
          <MenuItem icon={<BsFillCartCheckFill />}>
            Theo dõi đơn hàng
            <Link to={'/employer/follow-order'} />
          </MenuItem>
        </Menu> */}
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        {/* <div
          className='sidebar-btn-wrapper'
          style={{
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <AiOutlineLogout />
          <span>Đăng xuất</span>
          <Link to={'/employer/logout'} />
        </div> */}
        <Menu iconShape='circle'>
          <MenuItem icon={<AiOutlineLogout />}>Đăng xuất</MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  )
}
export default SideBarEmployer
