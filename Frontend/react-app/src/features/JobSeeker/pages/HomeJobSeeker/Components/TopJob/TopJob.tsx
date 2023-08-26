import iconReact from '../../../../../../assets/react.svg'
import { NavLink } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect } from 'react'

import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import './topJob.scss'
import { Grid, Pagination } from 'swiper/modules'
import { Col, Row } from 'antd'

const TopJob = () => {
  const dataTopJob = [
    {
      id: '1',
      logo: 'https://insieutoc.vn/wp-content/uploads/2021/03/mau-logo-dep.jpg',
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '2',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '3',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '4',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '5',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '6',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    },
    {
      id: '7',
      logo: iconReact,
      nameJob: 'Nhân viên quan hệ khách hàng ABCXYZ',
      nameCompany: 'Công ty trách nhiệm hữu hạng 10 thành viên BBBB',
      salary: 'Thương lượng',
      area: 'TP. Hồ Chí Minh'
    }
  ]
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [slidesPerView, setSlidesPerView] = useState(3)
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth > 786) {
      setSlidesPerView(3)
    }
    if (windowSize.innerWidth <= 786) {
      setSlidesPerView(2)
    }
    if (windowSize.innerWidth <= 576) {
      setSlidesPerView(1)
    }
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [windowSize])
  return (
    <div className='top-job-container'>
      <div className='title-top-job-container'>
        <div className='title-top-job'>Việc Làm Tốt Nhất</div>
        <NavLink to={'/all'} className='tab-all-job'>
          Xem tất cả
        </NavLink>
      </div>
      <div className='top-job-content'>
        <Swiper
          slidesPerView={slidesPerView}
          grid={{
            rows: 2
          }}
          spaceBetween={20}
          pagination={{
            clickable: true
          }}
          modules={[Grid, Pagination]}
          className='mySwiper1'
        >
          {dataTopJob &&
            dataTopJob.map((item) => (
              <SwiperSlide key={item.id}>
                <Row className='top-job-item' align={'middle'}>
                  <Col span={8} className='icon-company-container'>
                    <img className='icon-company' src={item.logo} alt='' style={{ width: '70%', height: '70%' }} />
                  </Col>
                  <Col span={16} className='job-content'>
                    <div className='name-job'>{item.nameJob}</div>
                    <div className='name-company'>{item.nameCompany}</div>
                    <div className='price-job'>{item.salary}</div>
                    <div className='area-job'>{item.area}</div>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopJob
