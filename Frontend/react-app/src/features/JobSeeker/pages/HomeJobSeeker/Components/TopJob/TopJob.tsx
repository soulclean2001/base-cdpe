import { NavLink, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect } from 'react'

import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import './topJob.scss'
import { Grid, Pagination } from 'swiper/modules'
import { Col, Row, Tooltip } from 'antd'
import apiHome from '~/api/home.api'
import logoTemp from '~/assets/HF_logo.jpg'

interface DataType {
  [key: string]: any
}
const TopJob = () => {
  const navigate = useNavigate()
  const [listData, setListData] = useState<DataType[]>()
  useEffect(() => {
    fetchGetData()
  }, [])
  const fetchGetData = async () => {
    await apiHome.getTopJobs().then(async (rs) => {
      if (rs && rs.result) setListData(rs.result)
    })
  }

  const handleClickShowDetail = (idJob: string, nameJob: string) => {
    // const convertNameEng = nameJob
    //   .normalize('NFD')
    //   .replace(/[\u0300-\u036f]/g, '')
    //   .toLowerCase()
    // const convertName = convertNameEng.replace(/\s+/g, '-').trim()
    console.log(nameJob)

    // navigate(`/jobs/${convertName}-id-${idJob}`)
    navigate(`/jobs/id-${idJob}`)
  }

  //set total show when change size window
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
  //
  return (
    <div className='top-job-container'>
      <div className='title-top-job-container'>
        <div className='title-top-job'>Việc Làm Tốt Nhất</div>
        <NavLink to={'/jobs'} className='tab-all-job'>
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
          {listData &&
            listData.map((item, index) => (
              <div key={index}>
                {item.job && (
                  <SwiperSlide key={index} onClick={() => handleClickShowDetail(item.job._id, item.job.job_title)}>
                    <Row className='top-job-item' align={'middle'}>
                      <Col span={8} className='icon-company-container'>
                        <img
                          className='icon-company'
                          src={item.logo ? item.logo : logoTemp}
                          alt=''
                          // style={{ width: 'auto', height: 'auto', objectFit: 'contain' }}
                        />
                      </Col>
                      <Col span={16} className='job-content'>
                        <Tooltip title={item.job.job_title}>
                          <div className='name-job'>{item.job.job_title}</div>
                        </Tooltip>
                        <Tooltip title={item.company_name}>
                          <div className='name-company'>{item.company_name}</div>
                        </Tooltip>
                        <div className='price-job'>
                          {item.job.is_salary_visible
                            ? `${item.job.salary_range.min.toLocaleString('vi', {
                                currency: 'VND'
                              })} - ${item.job.salary_range.max.toLocaleString('vi', {
                                style: 'currency',
                                currency: 'VND'
                              })}`
                            : 'Thương lượng'}
                        </div>
                        <div className='area-job'>
                          {item.job.working_locations
                            .map((loc: any) => {
                              return loc.city_name
                            })
                            .join(', ')}
                        </div>
                      </Col>
                    </Row>
                  </SwiperSlide>
                )}
              </div>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopJob
