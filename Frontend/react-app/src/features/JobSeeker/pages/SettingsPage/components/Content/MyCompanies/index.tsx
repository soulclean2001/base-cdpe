import { Tabs } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import ItemCompany from './components/ItemCompany'
import apiFollow from '~/api/follow.api'
import { useState, useEffect } from 'react'
const onChangeTab = (key: string) => {
  console.log(key)
}
const items: TabsProps['items'] = [
  // {
  //   key: '1',
  //   label: 'Nhà tuyển dụng xem hồ sơ',
  //   children: <ItemCompany />
  // },
  {
    key: '2',
    label: 'Đang theo dõi',
    children: <ItemCompany />
  }
]
const MyCompanies = () => {
  useEffect(() => {
    fetchGetCompaniesFollowed()
  }, [])
  const fetchGetCompaniesFollowed = async () => {
    await apiFollow.getCompanyCandidateHasFollowed().then((rs) => {
      console.log('rs', rs)
    })
  }

  return (
    <div className='my-company-container-in-setting-page'>
      <div className='title'>Công Ty Của Tôi</div>
      <div className='list-companies-container'>
        <Tabs className='tab-container' defaultActiveKey='1' items={items} onChange={onChangeTab} />
      </div>
    </div>
  )
}

export default MyCompanies
