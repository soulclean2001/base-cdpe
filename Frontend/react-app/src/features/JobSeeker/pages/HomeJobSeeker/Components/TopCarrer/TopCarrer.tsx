import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './topCarrer.scss'
import apiHome from '~/api/home.api'
const TopCarrer = () => {
  const [dataCarrer, setDataCarrer] = useState<{ id: string; img: string; name: string; totalJob: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let dataCarrer = [
      {
        id: '1',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'BẢO HIỂM',
        totalJob: 19999
      },
      {
        id: '2',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'BÁN LẺ/ BÁN SỈ',
        totalJob: 19999
      },
      {
        id: '3',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'XUẤT NHẬP KHẨU',
        totalJob: 19999
      },
      {
        id: '4',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'BÁO CHÍ/ TRUYỀN HÌNH',
        totalJob: 19999
      },
      {
        id: '5',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'ĐIỆN TỬ VIỄN THÔNG',
        totalJob: 19999
      },
      {
        id: '6',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'BẤT ĐỘNG SẢN',
        totalJob: 19999
      },
      {
        id: '7',
        img: 'https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png',
        name: 'VẬN TẢI/ KHO VẬN',
        totalJob: 19999
      }
    ]

    await apiHome.getTotalJobsByCareer().then((rs) => {
      if (!rs.result) return
      let listTemp: { id: string; img: string; name: string; totalJob: number }[] = []

      rs.result.map((item: { _id: string; jobs: number }) => {
        dataCarrer.map((data: { id: string; img: string; name: string; totalJob: number }) => {
          if (item._id.toString().toUpperCase() === data.name) {
            data.totalJob = item.jobs
            listTemp.push(data)
          }
        })
      })
      setDataCarrer(listTemp)
    })
  }
  // set size
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
  //
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
