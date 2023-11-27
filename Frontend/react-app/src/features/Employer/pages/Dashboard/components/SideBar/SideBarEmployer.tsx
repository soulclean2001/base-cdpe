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
import { FaIndustry, FaUsersCog } from 'react-icons/fa'
import { InfoMeState } from '~/features/Account/meSlice'
import avatarTemp from '~/assets/logo_temp.jpg'
import { logout } from '~/features/Auth/authSlice'
const SideBarEmployer = (props: any) => {
  const baseUrl = 'https://hfworks.id.vn' //import.meta.env.VITE_CLIENT_URL
  const windowHref = window.location.href
  const dispatch = useDispatch()
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const { toggled, handleToggleSidebar, hidden, roleType } = props
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const [isActive, setIsActive] = useState('')
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
  useEffect(() => {
    if (!windowHref) return

    setIsActive(windowHref)
  }, [windowHref])
  // const handleActiveSidebar = (e: any) => {
  //   const targetElement = e.target as Element
  //   const urlHref = targetElement.getAttribute('href')

  //   if (urlHref) setIsActive(urlHref)
  // }

  return (
    <ProSidebar
      style={{ zIndex: 500 }}
      hidden={hidden}
      className='employer-sidebar-container'
      collapsed={collap ? collap : false}
      toggled={toggled}
      breakPoint='md'
      onToggle={handleToggleSidebar}
      // onClick={(e) => handleActiveSidebar(e)}
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
          <img
            style={{ borderRadius: '50%' }}
            src={me.avatar && me.avatar !== '_' ? me.avatar : avatarTemp}
            alt=''
            width={'40px'}
            height={'40px'}
          />
          <span style={{ padding: '0 21px', fontWeight: 600, fontSize: '14px' }}>
            {me.name && me.name !== '_' ? me.name : me.email.split('@')[0]}
          </span>
        </div>
      </SidebarHeader>
      {roleType === 'EMPLOYER_ROLE' && (
        <SidebarContent>
          <Menu
            iconShape='circle'
            className={isActive === `${baseUrl}/employer/dashboard` ? 'clicked-side-bar' : 'dont-click-side-bar'}
          >
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
              <MenuItem
                className={
                  isActive === baseUrl + '/employer/dashboard/company-general'
                    ? 'clicked-menu-item'
                    : 'dont-click-side-bar'
                }
              >
                Thông tin chung
                <Link to={'/employer/dashboard/company-general'} />
              </MenuItem>
              <MenuItem
                className={
                  isActive === baseUrl + '/employer/dashboard/company-location'
                    ? 'clicked-menu-item'
                    : 'dont-click-side-bar'
                }
              >
                Địa điểm làm việc
                <Link to={'/employer/dashboard/company-location'} />
              </MenuItem>
              {/* <MenuItem>
                Mẫu email
                <Link to={'/employer/dashboard/email-template'} />
              </MenuItem>
              <MenuItem>
                Thông tin pháp nhân
                <Link to={'/employer/dashboard/legal-info'} />
              </MenuItem> */}
            </SubMenu>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/employer/dashboard/post-manage' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<BookFilled />}>
              Quản lý bài đăng
              <Link to={'/employer/dashboard/post-manage'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/employer/dashboard/find-candidate' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
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
              <MenuItem
                className={
                  isActive === baseUrl + '/employer/dashboard/cv-manage' ? 'clicked-menu-item' : 'dont-click-side-bar'
                }
              >
                Hồ sơ ứng tuyển
                <Link to={'/employer/dashboard/cv-manage'} />
              </MenuItem>
              <MenuItem
                className={
                  isActive === baseUrl + '/employer/dashboard/cv-manage/tracked-candidate'
                    ? 'clicked-menu-item'
                    : 'dont-click-side-bar'
                }
              >
                Hồ sơ đang theo dõi
                <Link to={'/employer/dashboard/cv-manage/tracked-candidate'} />
              </MenuItem>
            </SubMenu>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/employer/dashboard/my-services' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<ShoppingFilled />}>
              Dịch vụ của tôi
              <Link to={'/employer/dashboard/my-services'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/employer/dashboard/my-orders' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<ShoppingFilled />}>
              Đơn hàng của tôi
              <Link to={'/employer/dashboard/my-orders'} />
            </MenuItem>
          </Menu>
        </SidebarContent>
      )}
      {roleType === 'ADMIN_ROLE' && (
        <SidebarContent>
          <Menu
            iconShape='circle'
            className={isActive === baseUrl + '/admin' ? 'clicked-side-bar' : 'dont-click-side-bar'}
          >
            <MenuItem icon={<FundFilled />}>
              Thống kê
              <Link to={'/admin'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/admin/dashboard/users-manage' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<FaUsersCog />}>
              Quản lý tài khoản
              <Link to={'/admin/dashboard/users-manage'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/admin/dashboard/post-review-manage' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<FileSearchOutlined />}>
              Kiểm duyệt bài đăng
              <Link to={'/admin/dashboard/post-review-manage'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/admin/dashboard/services-manage' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<ShoppingFilled />}>
              Quản lý gói dịch vụ
              <Link to={'/admin/dashboard/services-manage'} />
            </MenuItem>
          </Menu>
          <Menu
            iconShape='circle'
            className={
              isActive === baseUrl + '/admin/dashboard/orders-manage' ? 'clicked-side-bar' : 'dont-click-side-bar'
            }
          >
            <MenuItem icon={<ShoppingFilled />}>
              Quản lý đơn hàng
              <Link to={'/admin/dashboard/orders-manage'} />
            </MenuItem>
          </Menu>
        </SidebarContent>
      )}

      <SidebarFooter style={{ textAlign: 'center' }}>
        <Menu iconShape='circle'>
          <MenuItem
            onClick={() => {
              dispatch(logout())
              window.location.reload()
            }}
            icon={<AiOutlineLogout />}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  )
}
export default SideBarEmployer
