import { FaLocationDot } from 'react-icons/fa6'
import './style.scss'
import { Col, Row } from 'antd'
import ReactHtmlParser from 'html-react-parser'
import { FaUsers } from 'react-icons/fa'
import { AiFillPhone, AiTwotoneMail } from 'react-icons/ai'

import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'

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
        <div className='preview__info' style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
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
