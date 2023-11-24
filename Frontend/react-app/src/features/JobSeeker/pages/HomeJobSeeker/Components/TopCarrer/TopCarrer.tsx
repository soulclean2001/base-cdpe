import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './topCarrer.scss'
import carrer1 from '~/assets/carerr_kinh_doanh_ban_hang.webp'
import carrer2 from '~/assets/carerr_it_pm.webp'
import carrer3 from '~/assets/carerr_hanh_chinh_vp.webp'
import carrer4 from '~/assets/carerr_gaio_duc.webp'
import carrer5 from '~/assets/carerr_tu_van.webp'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import carrer6 from '~/assets/carerr_mkt.webp'
import carrer7 from '~/assets/carerr_van_tai.webp'
import carrer8 from '~/assets/carerr_kiem_toan.webp'
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
        img: carrer1,
        name: 'KINH DOANH/ BÁN HÀNG',
        totalJob: 0
      },
      {
        id: '2',
        img: carrer2,
        name: 'IT PHẦN MỀM',
        totalJob: 0
      },
      {
        id: '3',
        img: carrer3,
        name: 'HÀNH CHÍNH/ VĂN PHÒNG',
        totalJob: 0
      },
      {
        id: '4',
        img: carrer4,
        name: 'GIÁO DỤC/ ĐÀO TẠO',
        totalJob: 0
      },
      {
        id: '5',
        img: carrer5,
        name: 'TƯ VẤN',
        totalJob: 0
      },
      // {
      //   id: '6',
      //   img: carrer6,
      //   name: 'MARKETING/ TRUYỀN THÔNG/ QUẢNG CÁO',
      //   totalJob: 19999
      // },
      {
        id: '7',
        img: carrer7,
        name: 'VẬN TẢI/ KHO VẬN',
        totalJob: 0
      },
      {
        id: '8',
        img: carrer8,
        name: 'KẾ TOÁN/ KIỂM TOÁN',
        totalJob: 0
      }
    ]

    await apiHome.getTotalJobsByCareer().then((rs) => {
      if (!rs || !rs.result) return
      let listTemp: { id: string; img: string; name: string; totalJob: number }[] = []

      rs.result.map((item: { _id: string; jobs: number }) => {
        dataCarrer.map((data: { id: string; img: string; name: string; totalJob: number }) => {
          if (item._id.toString().toUpperCase() === data.name) {
            data.totalJob = item.jobs
            listTemp.push(data)
            let index = dataCarrer.indexOf(data)
            if (index > -1) dataCarrer.splice(index, 1)
          }
        })
      })
      setDataCarrer([...listTemp, ...dataCarrer])
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
