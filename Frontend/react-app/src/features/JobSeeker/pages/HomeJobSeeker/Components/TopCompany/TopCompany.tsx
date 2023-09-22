import logo from '../../../../../../assets/react.svg'
import { useState, useEffect } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './topCompany.scss'
import { Pagination } from 'swiper/modules'
const TopCompany = () => {
  const dataTopCompany = [
    { id: '1', img: logo, name: 'KIMBERLY-CLARK 1' },
    { id: '2', img: 'https://insieutoc.vn/wp-content/uploads/2021/03/mau-logo-dep.jpg', name: 'KIMBERLY-CLARK 2' },
    { id: '3', img: 'https://images.vietnamworks.com/logo/nhck_vip_124074.jpg', name: 'KIMBERLY-CLARK 3' },
    { id: '4', img: 'https://images.vietnamworks.com/logo/pvcom_vip_124084.png', name: 'KIMBERLY-CLARK 4' },
    { id: '5', img: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_640.jpg', name: 'KIMBERLY-CLARK 5' }
  ]
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [slidesPerView, setSlidesPerView] = useState(4)
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth > 786) {
      setSlidesPerView(4)
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
    <div className='top-company-container'>
      <div className='title-top-company'>Các Công Ty Hàng Đầu</div>
      <div className='top-company-content'>
        <Swiper
          slidesPerView={slidesPerView}
          // grid={{
          //   rows: 2
          // }}
          spaceBetween={30}
          pagination={{
            clickable: true
          }}
          modules={[Pagination]}
          className='mySwiper'
        >
          {dataTopCompany &&
            dataTopCompany.map((item) => (
              <SwiperSlide key={item.id}>
                <div className='top-company-item'>
                  <img src={item.img} alt='' className='logo-company' />
                  <span className='name-company'>{item.name}</span>
                  <button className='btn-detail'>Chi tiết</button>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopCompany
