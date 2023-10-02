import { Tabs } from 'antd'

import { TabsProps } from 'antd/lib'
import './style.scss'
import PostServices from './pages/PostServices'
const ServicesPage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'ĐĂNG TUYỂN',
      children: <PostServices />
    },
    {
      key: '2',
      label: 'TÌM HỒ SƠ',
      children: <></>
    }
  ]
  return (
    <div className='services-page-container'>
      <div className='tab-service-wapper'>
        <Tabs className='tab-options-services' defaultActiveKey='1' items={items} />
      </div>
    </div>
  )
}

export default ServicesPage
