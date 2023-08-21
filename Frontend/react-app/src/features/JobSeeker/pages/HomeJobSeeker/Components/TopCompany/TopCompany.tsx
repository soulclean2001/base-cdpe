import logo from '../../../../../../assets/react.svg'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './topCompany.scss'
import { Pagination } from 'swiper/modules'
const TopCompany = () => {
  const dataTopCompany = [
    { id: '1', img: logo, name: 'KIMBERLY-CLARK 1' },
    { id: '2', img: 'https://insieutoc.vn/wp-content/uploads/2021/03/mau-logo-dep.jpg', name: 'KIMBERLY-CLARK 2' },
    { id: '3', img: logo, name: 'KIMBERLY-CLARK 3' },
    { id: '4', img: logo, name: 'KIMBERLY-CLARK 4' },
    { id: '5', img: logo, name: 'KIMBERLY-CLARK 5' }
  ]
  return (
    <div className='top-company-container'>
      <div className='title-top-company'>Các Công Ty Hàng Đầu</div>
      <div className='top-company-content'>
        <Swiper
          slidesPerView={4}
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
