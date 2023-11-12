import { Button, Col, Image, Row } from 'antd'
import './style.scss'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const ServiceItem = (props: any) => {
  const descriptions: [{ value: string }] = props.descriptions
  const img: string = props.img
  const title: string = props.title
  const price: string = props.price
  const swap: boolean = props.swap
  const navigate = useNavigate()
  const [style, setStyle] = useState<any>({})
  // useEffect(() => {
  //   if (swap) {
  //     setStyle({ ...style, flexDirection: 'row-reverse' })
  //   }
  // }, [swap])
  const handleOnLoad = () => {
    if (swap) {
      setStyle({ flexDirection: 'row-reverse', width: '100%' })
    } else setStyle({ width: '100%' })
  }
  return (
    <div className='wapper-services' onLoad={handleOnLoad}>
      <Row className='service-item-container' style={style}>
        <Col md={14} sm={24} className='img-container'>
          <img
            width={'100%'}
            height={'100%'}
            src={img ? img : 'https://employer.vietnamworks.com/v2/img/gallery/home-offer-5.svg?v=1693145251'}
          />
        </Col>
        <Col md={10} sm={24}>
          <div className='service-item-content'>
            <div className='content-wapper'>
              <div className='title'>{title ? title : 'Title'}</div>
              <div className='price'>{`${price} VNĐ`}</div>
              <div className='descriptions-container'>
                {descriptions &&
                  descriptions.map((description) => (
                    <div className='description-item' key={description.value}>
                      <div style={{ color: '#28a745' }}>
                        <BsFillCheckCircleFill />
                      </div>
                      <div>{description.value ? description.value : 'Đảm bảo hài lòng 100%'}</div>
                    </div>
                  ))}
              </div>
              <div className='btn-buy-now-container'>
                <Button onClick={() => navigate('/employer/services')} size='large' className='btn-buy-now'>
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ServiceItem
