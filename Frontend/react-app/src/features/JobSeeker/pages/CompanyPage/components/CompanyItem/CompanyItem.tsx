import { Button, Col, Image, Row } from 'antd'
import './style.scss'
import { MdWork } from 'react-icons/md'
import { FaFolderOpen, FaUsers } from 'react-icons/fa'

const CompanyItem = (props: any) => {
  return (
    <Row className='company-item-container'>
      <Col span={24} className='image-container'>
        <div className='background-company'>
          <img
            width={'100%'}
            height={'100%'}
            className='cover-img'
            src={
              props.backgroundImg
                ? props.backgroundImg
                : 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fnull%2Fen%2F%E1%BA%A2nh_Cover.jpg&w=3840&q=75'
            }
          />
        </div>
        <div className='logo-company'>
          <img
            className='logo'
            src={
              props.logo ? props.logo : 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
            }
          />

          <div className='total-followers'>
            <span>
              <FaUsers />
              {`${props.followers ? props.followers : ''} lượt theo dõi`}
            </span>
          </div>
        </div>
      </Col>
      <Col span={24} className='company-item-info'>
        <div className='name-company'>{props.nameCompany ? props.nameCompany : 'Tên công ty'}</div>
        <div className='type-jobs'>
          <FaFolderOpen />
          {props.field ? props.field : 'Các lĩnh vực của công ty'}
        </div>
        <div className='quantiy-jobs'>
          <MdWork />
          {`${props.totalJobs ? props.totalJobs : ''} Việc làm`}
        </div>
      </Col>
      <Col className='btn-follow-container' span={24}>
        <Button size='large' className='btn-follow'>
          Chi tiết
        </Button>
      </Col>
    </Row>
  )
}

export default CompanyItem
