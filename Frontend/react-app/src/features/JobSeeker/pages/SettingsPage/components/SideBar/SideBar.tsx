import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { FaClipboardUser } from 'react-icons/fa6'

import { Layout, Menu, Button, MenuProps, Checkbox } from 'antd'

const { Sider } = Layout
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import './style.scss'

import { BiSolidFactory } from 'react-icons/bi'
import { MdWork } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import CVSettings from '../Content/CVSettings'
import apiResume from '~/api/resume.api'
import apiCanidate from '~/api/candidate.api'
import { InfoMeState } from '~/features/Account/meSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
const SideBar = () => {
  const me: InfoMeState = useSelector((state: RootState) => state.me)
  const navigation = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [hiddenHeader, setHiddenHeader] = useState(false)

  const [checkboxCV, setCheckboxCV] = useState(false)
  const currentURL = window.location.href
  const [isModalOpenSettingCV, setIsModalOpenSettingCV] = useState(false)
  // console.log('URL của trang web hiện tại:', currentURL)
  //check cv
  // const [dataMyCV, setDataMyCV] = useState('data my cv')
  //
  const [disableTurnOnFindCV, setDisableTurnOnFindCV] = useState(false)
  const [idCV, setIdCV] = useState('')
  useEffect(() => {
    fetchMyResume()
  }, [])
  const fetchMyResume = async () => {
    await apiResume.getAllByMe().then((rs) => {
      if (
        !rs.result[0] ||
        !rs.result[0] ||
        !rs.result[0].user_info ||
        !rs.result[0].user_info.wanted_job_title ||
        !rs.result[0].user_info.first_name ||
        !rs.result[0].user_info.last_name ||
        !rs.result[0].user_info.phone ||
        !rs.result[0].user_info.email
      ) {
        setDisableTurnOnFindCV(true)
        setCheckboxCV(false)
      } else {
        setDisableTurnOnFindCV(false)
        setIdCV(rs.result[0]._id)
      }
    })
    await apiCanidate.getMyCandidate().then((rs) => {
      if (!rs.result) return
      setCheckboxCV(rs.result.cv_public)
    })
  }

  // useEffect(() => {
  //   if (!dataMyCV) {
  //     setCheckboxCV(false)
  //     setDisableTurnOnFindCV(true)
  //   } else setDisableTurnOnFindCV(false)
  // }, [dataMyCV])
  const onClickMenu: MenuProps['onClick'] = (e) => {
    if (e.key === '1') navigation('/settings')
    if (e.key === '2') navigation('/CV')
    if (e.key === '3') navigation('/settings/CV-settings')
    if (e.key === '4') navigation('/settings/my-companies')
    if (e.key === '5') navigation('/settings/my-jobs')
  }
  const onChangeCheckbox = () => {
    setIsModalOpenSettingCV(true)
  }

  // const showModal = () => {
  //   setIsModalOpenSettingCV(true)
  // }
  const handleCancel = () => {
    setIsModalOpenSettingCV(false)
  }
  const handleTurnOnFindCV = (isTurnOn: boolean) => {
    setCheckboxCV(isTurnOn)
  }

  return (
    <Layout className='side-bar-settings-container'>
      <Sider className='sider-settings-page-container' trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className='header-side-bar-container'>
          <div className='header-side-bar' style={{ height: `${hiddenHeader ? 'auto' : '100px'}` }}>
            <div className='user-header-side-bar' hidden={hiddenHeader}>
              <Avatar
                src={me.avatar && me.avatar !== '_' ? me.avatar : ''}
                size={'large'}
                className='avatar-header-side-bar'
              >
                {!me.avatar || me.avatar === '_'
                  ? me.name && me.name !== '_'
                    ? me.name.slice(0, 1).toUpperCase()
                    : me.email.slice(0, 1).toUpperCase()
                  : ''}
              </Avatar>
              <div className='name-header-side-bar'>
                {me.name && me.name !== '_' ? me.name : me.email.split('@')[0]}
              </div>
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
          <div hidden={hiddenHeader} className='settings-auto-finding-cv'>
            <Checkbox disabled={disableTurnOnFindCV} checked={checkboxCV} onChange={onChangeCheckbox}>
              Cho phép tìm kiếm hồ sơ
            </Checkbox>
            <span hidden={disableTurnOnFindCV ? false : true} className='show-warning-cv'>
              Hồ sơ chưa đủ điều kiện cho phép tìm kiếm
            </span>
            <CVSettings
              idCV={idCV}
              handleTurnOnFindCV={handleTurnOnFindCV}
              open={isModalOpenSettingCV}
              handleClose={handleCancel}
              isTurnOn={checkboxCV}
            />
          </div>
        </div>
        <Menu
          style={{ backgroundColor: 'rgb(247, 248, 250)', borderInlineEnd: 'none' }}
          //   theme='light'
          onClick={onClickMenu}
          mode='inline'
          defaultSelectedKeys={
            currentURL === 'http://127.0.0.1:3001/settings' || currentURL === 'https://hfworks.id.vn/settings'
              ? ['5']
              : currentURL === 'http://127.0.0.1:3001/settings/my-companies' ||
                currentURL === 'https://hfworks.id.vn/settings/my-companies'
              ? ['4']
              : currentURL === 'http://127.0.0.1:3001/settings/my-jobs' ||
                currentURL === 'https://hfworks.id.vn/settings/my-jobs'
              ? ['5']
              : ['5']
          }
          items={[
            // {
            //   key: '1',
            //   icon: (
            //     <span style={{ fontSize: '22px', color: 'gray' }}>
            //       <AiFillDashboard />
            //     </span>
            //   ),
            //   label: 'Tổng Quan',
            //   style: { display: 'flex', alignItems: 'center', marginTop: '10px' }
            // },
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
              key: '2',
              icon: (
                <span style={{ fontSize: '22px', color: 'gray' }}>
                  <FaClipboardUser />
                </span>
              ),
              label: 'Hồ Sơ Của Tôi',
              style: { display: 'flex', alignItems: 'center' }
            }
            // {
            //   key: '3',
            //   icon: (
            //     <span style={{ fontSize: '22px', color: 'gray' }}>
            //       <FaUserCog />
            //     </span>
            //   ),
            //   label: 'Thiết Lập Hồ Sơ',
            //   style: { display: 'flex', alignItems: 'center' }
            // },

            // {
            //   key: '6',
            //   icon: (
            //     <span style={{ fontSize: '22px', color: 'gray' }}>
            //       <IoNotificationsSharp />
            //     </span>
            //   ),
            //   label: 'Thông Báo Việc Làm',
            //   style: { display: 'flex', alignItems: 'center' }
            // },
            // {
            //   key: '7',
            //   icon: (
            //     <span style={{ fontSize: '22px', color: 'gray' }}>
            //       <AiFillSetting />
            //     </span>
            //   ),
            //   label: 'Quản Lý Tài Khoản',
            //   style: { display: 'flex', alignItems: 'center' }
            // }
          ]}
        />
      </Sider>
    </Layout>
  )
}

export default SideBar
