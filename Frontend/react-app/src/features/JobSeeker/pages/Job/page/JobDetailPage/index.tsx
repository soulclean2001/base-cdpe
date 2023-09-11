import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import banner from '~/assets/alena-aenami-cold-1k.jpg'

import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useEffect, useState } from 'react'
import JobInfo from './components/JobInfo/JobInfo'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
import ShowMoreJob from './components/ShowMoreJob/ShowMoreJob'

const onChange = (key: string) => {
  console.log(key)
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'THÔNG TIN',
    children: <JobInfo />
  },
  {
    key: '2',
    label: 'CÔNG TY',
    children: <CompanyInfo />
  },
  {
    key: '3',
    label: 'VIỆC LÀM KHÁC TỪ CÔNG TY',
    children: <ShowMoreJob />
  }
]
const JobDetailPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Theo dõi sự kiện cuộn chuột khi component được render
    window.addEventListener('scroll', handleScroll)

    // Xóa sự kiện cuộn chuột khi component bị unmount
    return () => {
      console.log('is', isVisible)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Hàm xử lý sự kiện cuộn chuột
  const handleScroll = () => {
    if (window.scrollY > 500) {
      // Hiển thị thẻ div khi người dùng đã cuộn qua một số pixel (ở đây là 200)
      setIsVisible(true)
    } else {
      // Ẩn thẻ div khi người dùng chưa cuộn đủ
      setIsVisible(false)
    }
  }
  return (
    <div className='job-detail-page-container'>
      <div className='page-background' style={{ backgroundImage: `url(${banner})` }}>
        <div className='background-overlay'></div>
      </div>
      <div className='content'>
        <div className='content-header'>
          <Row className='job-title-container'>
            <Col md={4} sm={24} xs={24} className='logo-company'>
              <img src='https://images.vietnamworks.com/pictureofcompany/86/10475262.png' />
            </Col>
            <Col md={20} sm={24} xs={24} className='title-info'>
              <div className='job-name'>[Vinhomes] Giám Đốc Hiện Trường (BQL Xây Dựng)</div>
              <div className='name-company'>Công Ty Cổ Phần Vinhomes</div>
              <div className='working-address'>{`Địa điểm làm việc: ${'Hưng Yên'}`}</div>
              <div className='salary'>Thương lượng</div>
              <Row justify={'space-between'}>
                <Col lg={18} md={16} sm={24} xs={24} style={{ marginBottom: '10px' }}>
                  <div className='total-accept'>{`- Số lượng tuyển: ${5} người`}</div>
                  <div className='expiration-date'>{`- Hạn cuối nhận hồ sơ: ${'25/09/2023'}`}</div>
                </Col>
                <Col lg={6} md={8} sm={24} xs={24} className='btn-container'>
                  <Button size='large' className='btn-follow' icon={<AiOutlineHeart />} />
                  <Button size='large' className='btn-apply'>
                    Nộp Đơn
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div className='job-info-container'>
          <Tabs className='tab-job-detail' defaultActiveKey='1' items={items} onChange={onChange} />
        </div>
        <Row className={`sticky-div ${isVisible ? '' : 'hidden'}`}>
          <Col lg={14} md={16} sm={23} xs={23} className='sticky-content'>
            <div className='logo'>
              <img src='https://images.vietnamworks.com/pictureofcompany/b0/11206510.png' alt='' />
            </div>
            <div className='sticky-info-container'>
              <div className='name-job'>[Vinhomes] Giám Đốc Hiện Trường (BQL Xây Dựng)</div>
              <div className='name-company'>Công Ty Cổ Phần Vinhomes</div>
            </div>
          </Col>

          <Col lg={4} md={4} sm={23} xs={23} className='btn-container'>
            <Button size='large' className='btn-follow' icon={<AiOutlineHeart />} />
            <Button size='large' className='btn-apply'>
              Nộp Đơn
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default JobDetailPage
