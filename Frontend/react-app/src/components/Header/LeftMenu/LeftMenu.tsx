import { useState } from 'react'

import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './leftMenu.scss'
import { NavLink } from 'react-router-dom'

const items: MenuProps['items'] = [
  {
    label: <NavLink to={'/jobs'}>Việc làm</NavLink>,
    key: 'jobSubmenu'

    // children: [
    //   {
    //     label: <NavLink to={'/jobs'}>Tìm việc làm</NavLink>,
    //     key: 'jobSearch'
    //   },
    //   {
    //     label: 'Việc làm mới nhất',
    //     key: 'newJob'
    //   },
    //   {
    //     label: 'Việc làm đã ứng tuyển',
    //     key: 'jobApplied'
    //   }
    // ]
  },
  {
    label: <NavLink to={'/companies'}>Công ty</NavLink>,
    key: 'companySubmenu'
    // children: [
    //   {
    //     label: <NavLink to={'/companies'}>Danh sách công ty</NavLink>,
    //     key: 'listCompany'
    //   },
    //   {
    //     label: 'Top công ty ',
    //     key: 'topCompany'
    //   }
    // ]
  },
  {
    label: <NavLink to={'/CV'}>Hồ sơ & CV</NavLink>,
    key: 'CVSubmenu'
    // children: [
    //   {
    //     label: 'Quản lý CV',
    //     key: 'controllCV'
    //   },
    //   {
    //     label: 'Mẫu CV',
    //     key: 'exampleCV'
    //   }
    // ]
  }
]

const LeftMenu = () => {
  const [current, setCurrent] = useState('mail')

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }
  return (
    <Menu className='left_menu_container' onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
  )
}

export default LeftMenu
