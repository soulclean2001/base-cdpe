import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './topCarrer.scss'
import { useDispatch } from 'react-redux'
const TopCarrer = (props: any) => {
  const dataCarrer = [
    {
      id: '1',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'BÁN HÀNG',
      totalJob: 19999
    },
    {
      id: '2',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'IT - PHÂN MỀM',
      totalJob: 19999
    },
    {
      id: '3',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'MARKETING',
      totalJob: 19999
    },
    {
      id: '4',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'ĐIỆN / ĐIỆN TỬ',
      totalJob: 19999
    },
    {
      id: '5',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'TÀI CHÍNH / ĐẦU TƯ',
      totalJob: 19999
    },
    {
      id: '6',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'DỊCH VỤ KHÁCH HÀNG',
      totalJob: 19999
    },
    {
      id: '7',
      img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
      name: 'KẾ TOÁN',
      totalJob: 19999
    }
  ]
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [slidesPerView, setSlidesPerView] = useState(6)

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }

    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth > 992) {
      setSlidesPerView(6)
    }
    if (windowSize.innerWidth <= 992) {
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
    <div className='top-carrer-container'>
      <div className='title'>Ngành Nghề Trọng Điểm</div>
      <div className='top-carrer-content'>
        <Swiper
          pagination={{
            clickable: true
          }}
          slidesPerView={slidesPerView}
          navigation={true}
          spaceBetween={20}
          modules={[Pagination, Navigation]}
          className='mySwiper3'
        >
          {dataCarrer &&
            dataCarrer.map((item) => (
              <SwiperSlide className='carrer-item' key={item.id}>
                <img className='img-carrer' src={item.img} alt='' />
                <div className='name-carrer'>{item.name}</div>
                <div className='total-job'>{`${item.totalJob} Việc làm`}</div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopCarrer
