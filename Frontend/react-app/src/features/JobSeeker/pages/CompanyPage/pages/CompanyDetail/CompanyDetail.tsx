import { Button, Col, Row, Tabs, TabsProps } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'
import { BsFillShareFill } from 'react-icons/bs'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
import ListJob from './components/ListJob/ListJob'
const onChange = (key: string) => {
  console.log(key)
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Về chúng tôi',
    children: <CompanyInfo />
  },
  {
    key: '2',
    label: 'Vị trí đang tuyển dụng',
    children: <ListJob />
  }
]
const CompanyDetail = () => {
  return (
    <div id='company-detail-page-container'>
      <div className='header-container'>
        <div className='banner-container'>
          <img
            className='banner'
            src='https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fbanner-default-company.png&w=640&q=75'
          ></img>
        </div>
        <Row className='header-content'>
          <Col lg={18} md={17} sm={24} xs={24} className='left-content'>
            <div className='logo-container'>
              <div
                className='logo'
                style={{
                  backgroundImage: `url(${'https://images.vietnamworks.com/pictureofcompany/97/11105092.png'})`
                }}
              ></div>
            </div>
            <div className='info'>
              <div className='name-company'>WA Projects Limited</div>
              <div className='total-followers'>25 lượt theo dõi</div>
            </div>
          </Col>
          <Col lg={5} md={6} sm={24} xs={24} className='right-content'>
            <Button size='large' className='btn-follow'>
              Theo dõi
            </Button>
            <Button size='large' className='btn-report' icon={<AiFillFlag />} />
            <Button size='large' className='btn-share' icon={<BsFillShareFill />} />
          </Col>
        </Row>
        <Tabs className='tab-company-detail' defaultActiveKey='1' items={items} onChange={onChange} />
      </div>
    </div>
  )
}

export default CompanyDetail
