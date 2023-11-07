import { useState, useEffect } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './topCompany.scss'
import { Pagination } from 'swiper/modules'
import { Tooltip } from 'antd'
import apiHome from '~/api/home.api'
import logoTemp from '~/assets/HF_logo.jpg'
import { useNavigate } from 'react-router-dom'
import apiCompany from '~/api/company.api'
interface DataType {
  [key: string]: any
}
const TopCompany = () => {
  const navigate = useNavigate()
  const [listData, setListData] = useState<DataType[]>()
  useEffect(() => {
    fetchGetData()
  }, [])
  const fetchGetData = async () => {
    await apiHome.getCompaniesBanner().then(async (rs) => {
      console.log('list ', rs)
      if (!rs.result) {
        await apiCompany.searchCompany({ limit: '10', page: '1' }).then((rs) => {
          setListData(rs.result.companies)
        })
        return
      }
      setListData(rs.result)
    })
  }
  const handleClickShowDetail = (idCompany: string, nameCompany: string) => {
    const convertNameEng = nameCompany
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/companies/${convertName}-id-${idCompany}`)
  }
  //set css
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
    if (windowSize.innerWidth > 992) {
      setSlidesPerView(6)
    }
    if (windowSize.innerWidth <= 992) {
      setSlidesPerView(4)
    }
    if (windowSize.innerWidth <= 768) {
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
          {listData &&
            listData.map((item) => (
              <SwiperSlide key={item._id}>
                <div className='top-company-item'>
                  <img src={item.logo ? item.logo : logoTemp} alt='' className='logo-company' />
                  <Tooltip title={item.name}>
                    <span className='name-company'>
                      {item.company_name ? item.company_name.slice(0, 16) : 'Tên công ty'}
                    </span>
                  </Tooltip>

                  <button onClick={() => handleClickShowDetail(item._id, item.company_name)} className='btn-detail'>
                    Chi tiết
                  </button>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopCompany
