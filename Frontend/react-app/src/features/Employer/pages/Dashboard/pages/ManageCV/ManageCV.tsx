import { Tabs } from 'antd'

import './style.scss'

import { TabsProps } from 'antd/lib'
import ContentCVManage from './components/ContentCVManage'
import { useState } from 'react'

const ManageCV = () => {
  const [tabKey, setTabKey] = useState('tab-applied-cv')
  const onChange = (key: string) => {
    setTabKey(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'tab-applied-cv',
      label: <div className='tab-item'>Hồ sơ đã ứng tuyển</div>,
      children: <></>
    },
    // {
    //   key: 'tab-saved-cv',
    //   label: <div className='tab-item'>Hồ sơ đã lưu</div>,
    //   children: <ContentCVManage tabKey={tabKey} />
    // },
    {
      key: 'tab-back-list',
      label: <div className='tab-item'>Danh sách đen</div>,
      children: <></>
    },
    {
      key: 'tab-deleted',
      label: <div className='tab-item'>Đã xóa</div>,
      children: <></>
    }
  ]
  return (
    <div className='cv-applied-manage-container'>
      <div className='title'>Quản Lý Hồ Sơ Ứng Viên</div>

      <div className='tabs-post-manage-container'>
        <Tabs className='tabs-post-manage' defaultActiveKey='1' items={items} onChange={onChange} />
        <ContentCVManage tabKey={tabKey} />
      </div>
    </div>
  )
}

export default ManageCV
