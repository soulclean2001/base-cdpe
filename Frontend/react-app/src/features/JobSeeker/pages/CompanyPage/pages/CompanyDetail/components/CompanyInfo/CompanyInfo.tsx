import { Carousel, Col, Row } from 'antd'
import './style.scss'

import { BsPlayCircle } from 'react-icons/bs'
import ReactHtmlParser from 'html-react-parser'
import { TypeCompanyDetail } from '../../CompanyDetail'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'

interface PropsType {
  data: TypeCompanyDetail
}
const CompanyInfo = (props: any) => {
  const { data }: PropsType = props
  const convertToEmbedLink = (url: string) => {
    // let url = 'https://www.youtube.com/watch?v=xNRJwmlRBNU&ab_channel=ADesignerWhoCodes'
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    let match = url.match(regExp)

    if (match && match[2].length == 11) {
      return `//www.youtube.com/embed/${match[2]}`
    } else {
      return 'error'
    }
  }
  if (!data) return <div style={{ height: '100vh' }}>...</div>
  return (
    <div id='tab-company-info-container-in-company-detail'>
      <Row className='top-container'>
        <Col span={24}>
          <h2 className='title-about'>TỔNG QUAN</h2>
        </Col>
        <Col lg={12} md={24} sm={24} xs={24} className='about-company-container'>
          <Row className='about-info-container'>
            <Col lg={4} md={6} sm={24} xs={24} className='label-info'>
              Địa chỉ
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data &&
                data.working_locations.map((loc: WorkingLocation, index: number) => (
                  <div key={index} style={{ paddingBottom: '7px' }}>
                    {loc.branch_name}, {loc.address}, {loc.district}, {loc.city_name}
                  </div>
                ))}
            </Col>
          </Row>
          <Row className='about-info-container'>
            <Col lg={4} md={6} sm={24} xs={24} className='label-info'>
              Quy mô
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data && data.company_size ? data.company_size : 0} nhân sự
            </Col>
          </Row>
          <Row className='about-info-container'>
            <Col lg={4} md={6} sm={24} xs={24} className='label-info'>
              Lĩnh vực
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data && data.fields ? data.fields.join(', ') : ''}
            </Col>
          </Row>
          {/* <Row className='about-info-container'>
            <Col lg={4} md={6} sm={24} xs={24} className='label-info'>
              Liên hệ
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              ...
            </Col>
          </Row> */}
        </Col>
        {data.pictures && (
          <Col lg={12} md={24} sm={24} xs={24} className='right-img-container'>
            <Carousel autoplay>
              {data.pictures.map((item: any, index: number) => (
                <div key={index} className='img-carosel-container'>
                  <img src={item} />
                </div>
              ))}
            </Carousel>
          </Col>
        )}
      </Row>
      <div className='benefit-company-detail-container'>
        <h2 className='title-about' style={{ paddingTop: '20px' }}>
          GIỚI THIỆU
        </h2>
        <div className='preview__info' style={{ color: '#333333', maxWidth: '100%', wordBreak: 'break-word' }}>
          {data && data.company_info ? ReactHtmlParser(data.company_info) : ''}
        </div>
      </div>
      <div className='video-company-detail-container'>
        <h2 className='video-title'>VIDEO</h2>
        <div className='video-content'>
          {data.videos && data.videos[0] ? (
            <iframe
              width={'100%'}
              height={'400px'}
              src={convertToEmbedLink(data.videos[0].toString())}
              allow='autoplay; encrypted-media'
              allowFullScreen
              title='video'
            ></iframe>
          ) : (
            <BsPlayCircle />
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyInfo
