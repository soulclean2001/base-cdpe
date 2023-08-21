import React, { useState } from 'react'
import { Carousel, Col, Row } from "antd"
import banner1 from '../../assets/banner_1.webp';
import banner2 from '../../assets/banner_2.webp';
import banner3 from '../../assets/banner_3.webp';
import banner4 from '../../assets/banner_4.webp';
import './bannerCarousel.scss'

// const infoCompanyStyle: React.CSSProperties ={
    
// }
const BannerCarousel = () => {
    const [dataForBanner,setDataforBanner] = useState([
        {
        id: "1",
        img: banner1,
        logo: banner1,
        nameCompany: "Mercedes-Ben"
        },
        {   
            id: "2",
            img: banner2,
            logo: banner2,
            nameCompany: "iTechwx Company"
        },
        {
            id: "3",
            img: banner3,
            logo: banner3,
            nameCompany: "Explor Global"
        },
        {
            id: "4",
            img: banner4,
            logo: banner4,
            nameCompany: "Chailie Binace"
        },
        {
            id: "5",
            img: banner4,
            logo: banner4,
            nameCompany: "Chailie Binace"
        },
    ])
  
  return (
    <><Carousel autoplay style={{padding:'15px'}}>
        { dataForBanner && dataForBanner.map((item) =>(
            <div key={item.id}>
            <img className='img-carousel' alt="" src={item.img}/>
            <Row className="banner-info-company-container" justify={'center'} align={'middle'}>
                <Col  md={20} sm={18} xs={16}>
                <Row className='info-company-content' align="middle">
                    <Col md={3} sm={6} xs={6} className="logo-company">
                        <img alt="" src={item.logo} className='img-logo'/>
                    </Col>
                    <Col md={21} sm={18} xs={18} className='name-company'>{item.nameCompany}</Col>
                </Row>
                </Col>
                
                <Col md={4} sm={6} xs={8} className='btn-join-container'>
                    <button className="btn-join-now">Xin việc</button>
                </Col>
                
            </Row>
        </div>   
        )) 
        }
        
        </Carousel>
    </>
        
  )

}
export default BannerCarousel