import { FaLocationDot } from 'react-icons/fa6'
import './style.scss'
import { Col, Row } from 'antd'
import ReactHtmlParser from 'html-react-parser'
import { FaUsers } from 'react-icons/fa'
import { AiFillPhone, AiTwotoneMail } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
// const descriptionsData = `Thành lập từ năm 2005, Golden Gate (Công Ty CP Thương Mại Dịch Vụ Cổng Vàng) là đơn vị tiên phong áp dụng mô hình chuỗi nhà hàng tại Việt Nam, với 5 phong cách ẩm thực chính, bao gồm: Lẩu, Nướng, Á, Âu và quán cà phê. Golden Gate hiện sở hữu hơn 22 thương hiệu cùng gần 400 nhà hàng đa phong cách trên 40 tỉnh thành, phục vụ 18 triệu lượt khách hàng mỗi năm và vẫn đang không ngừng nỗ lực phát triển hơn.

// Tầm nhìn: "Lựa chọn Ẩm thực số 1"
// Sứ mệnh: "Nhân viên hạnh phúc - Khách hàng hài lòng"
// Triết lí kinh doanh: "Nâng cao chất lượng cuộc sống"
// Gía trị cốt lõi:
// CHÍNH TRỰC – Làm điều đúng, ngay cả khi không ai quan sát
// NHÂN VĂN – Yêu thương con người và hành động tử tế
// HIỆU SUẤT CAO – Làm nhanh, chính xác và tạo ra giá trị vượt trội

// Lấy con người làm trung tâm, chúng tôi luôn mong muốn sẽ có thêm những cộng sự mới, sống và làm việc cùng Golden Gate.`
interface DataType {
  info: string
  working_locations: WorkingLocation[]
  company_size: string
}
interface PropsType {
  data: DataType
}
const CompanyInfo = (props: any) => {
  const { data }: PropsType = props
  // const [descriptions, setDescriptions] = useState([''])
  // useEffect(() => {
  //   if (data.info) handleFormatInfo()
  // }, [data])
  // const handleFormatInfo = () => {
  //   if (data.info) {
  //     setDescriptions(data.info.split('\n'))
  //   }
  // }
  return (
    <Row className='tab-company-info-container'>
      <Col lg={17} md={15} sm={24} xs={24} className='left-content'>
        <h2>TỔNG QUAN</h2>
        <div className='preview__info' style={{ color: 'black', maxWidth: '100%', wordBreak: 'break-word' }}>
          {data.info && ReactHtmlParser(data.info)}
        </div>
        {/* {descriptions &&
          descriptions.map((item, index) => (
            <div key={index} className='description'>
              {item}
            </div>
          ))} */}
      </Col>
      <Col lg={6} md={8} sm={24} xs={24} className='right-content'>
        <div className='item-container location-container'>
          <div className='icon'>
            <FaLocationDot />
          </div>
          <div className='item-content location-content'>
            <div className='label'>ĐỊA ĐIỂM</div>
            {data.working_locations &&
              data.working_locations.map((location, index) => (
                <div
                  key={index}
                  className='data location'
                >{`${location.address}, ${location.district}, ${location.city_name}`}</div>
              ))}
          </div>
        </div>
        <div className='item-container total-employer-container'>
          <div className='icon'>
            <FaUsers />
          </div>
          <div className='item-content total-employer-content'>
            <div className='label'>QUY MÔ CÔNG TY</div>
            <div className='data total-employer'>{data.company_size ? data.company_size : 0} thành viên</div>
          </div>
        </div>
        <div className='item-container contact-container'>
          <div className='icon' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {/* <MdContactless /> */}
            <AiTwotoneMail />
            <AiFillPhone />
          </div>
          <div className='item-content contact-content'>
            <div className='label'>LIÊN HỆ</div>
            <div className='data'>
              <div className='email'>fonttt0169@gmail.com</div>
              <div className='phone-number'>0365887759</div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default CompanyInfo
