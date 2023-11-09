import { Carousel, Col, Row } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { BsPlayCircle } from 'react-icons/bs'
import ReactHtmlParser from 'html-react-parser'
import { TypeCompanyDetail } from '../../CompanyDetail'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
// const descriptionsData = `History and Background
// Formed in spring 2004 the practice has thoroughly embraced BIM and has been using Revit (but also ArchiCAD and other BIM software) since 2006.

// All architectural staff are qualified architects, the majority having attended HCMC University. WA Projects has an exceptionally low turnover of staff, which has been key to our continued success.

// Our sustained growth has been, and continues to be by recommendation - the best form of marketing ! Our strength is in our ability to deliver consistently high-quality architectural packages, drawings and BIM models on programme that are to`
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
      console.log('match[2]', match[2])
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
            <Col lg={2} md={6} sm={24} xs={24} className='label-info'>
              Địa chỉ
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data &&
                data.working_locations.map((loc: WorkingLocation, index: number) => (
                  <div key={index} style={{ paddingBottom: '7px' }}>
                    {loc.address}, {loc.district}, {loc.city_name}
                  </div>
                ))}
            </Col>
          </Row>
          <Row className='about-info-container'>
            <Col lg={2} md={6} sm={24} xs={24} className='label-info'>
              Quy mô
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data && data.company_size ? data.company_size : 0} nhân sự
            </Col>
          </Row>
          <Row className='about-info-container'>
            <Col lg={2} md={6} sm={24} xs={24} className='label-info'>
              Lĩnh vực
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              {data && data.fields ? data.fields.join(', ') : ''}
            </Col>
          </Row>
          <Row className='about-info-container'>
            <Col lg={2} md={6} sm={24} xs={24} className='label-info'>
              Liên hệ
            </Col>
            <Col lg={19} md={17} sm={24} xs={24} className='info'>
              ...
            </Col>
          </Row>
          <h2 className='title-about' style={{ paddingTop: '20px' }}>
            GIỚI THIỆU
          </h2>
          <div className='preview__info' style={{ color: '#333333', maxWidth: '100%', wordBreak: 'break-word' }}>
            {data && data.company_info ? ReactHtmlParser(data.company_info) : ''}
          </div>
          {/* {descriptions &&
            descriptions.map((item, index) => (
              <div key={index} className='description'>
                {item}
              </div>
            ))} */}
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
      {/* <div className='benefit-company-detail-container'>
        <h2 className='benefit-title'>PHÚC LỢI</h2>
        <Row className='benefit-content'>
          <Col md={8} sm={11} xs={23} className='benefit-item'>
            <div className='benefit-item-wapper'>
              <div className='icon'>
                <BiMoneyWithdraw />
              </div>
              <div className='value'>13 month salary</div>
            </div>
          </Col>
          <Col md={8} sm={11} xs={23} className='benefit-item'>
            <div className='benefit-item-wapper'>
              <div className='icon'>
                <BiMoneyWithdraw />
              </div>
              <div className='value'>13 month salary</div>
            </div>
          </Col>
          <Col md={8} sm={11} xs={23} className='benefit-item'>
            <div className='benefit-item-wapper'>
              <div className='icon'>
                <BiMoneyWithdraw />
              </div>
              <div className='value'>13 month salary</div>
            </div>
          </Col>
        </Row>
      </div> */}
    </div>
  )
}

export default CompanyInfo
