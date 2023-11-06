import { useState, useEffect } from 'react'
import { Carousel, Col, Row } from 'antd'
import './bannerCarousel.scss'
import apiHome from '~/api/home.api'
import logoTemp from '~/assets/HF_logo.jpg'
import bannerTemp from '~/assets/banner_temp.jpg'
import { useNavigate } from 'react-router-dom'
interface DataType {
  [key: string]: any
}
const BannerCarousel = () => {
  const navigate = useNavigate()
  const [listData, setListData] = useState<DataType[]>()
  useEffect(() => {
    fetchGetData()
  }, [])
  const fetchGetData = async () => {
    await apiHome.getCompaniesBanner().then((rs) => {
      console.log('list ', rs)
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
  return (
    <>
      <Carousel autoplay style={{ padding: '15px' }}>
        {listData &&
          listData.map((item) => (
            <div key={item._id}>
              <img className='img-carousel' alt='' src={item.background ? item.background : bannerTemp} />
              <Row className='banner-info-company-container' justify={'center'} align={'middle'}>
                <Col md={20} sm={18} xs={16}>
                  <Row className='info-company-content' align='middle'>
                    <Col md={3} sm={6} xs={6} className='logo-company'>
                      <img alt='' src={item.logo ? item.logo : logoTemp} className='img-logo' />
                    </Col>
                    <Col md={21} sm={18} xs={18} className='name-company'>
                      {item.company_name ? item.company_name.slice(0, 16) : 'Tên công ty'}
                    </Col>
                  </Row>
                </Col>

                <Col md={4} sm={6} xs={8} className='btn-join-container'>
                  <button onClick={() => handleClickShowDetail(item._id, item.company_name)} className='btn-join-now'>
                    Chi tiết
                  </button>
                </Col>
              </Row>
            </div>
          ))}
      </Carousel>
    </>
  )
}
export default BannerCarousel
