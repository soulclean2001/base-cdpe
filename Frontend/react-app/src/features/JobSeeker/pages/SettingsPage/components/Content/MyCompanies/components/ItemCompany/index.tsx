import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'

const ItemCompany = () => {
  return (
    <Row className='item-follow-container' justify={'space-between'}>
      <Col lg={19} md={19} sm={24} xs={24} className='left-container'>
        <div className='logo-container'>
          <img
            src='https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg'
            alt=''
          />
        </div>
        <div className='info-company'>
          <div className='name-company'>WA Projects Limited</div>
          <div className='fields'>{`Lĩnh vực:  ${'IT-Phần mềm / Marketing'}`} </div>
          <div className='address'>{`Địa chỉ:  ${'Gò Vấp, TP. Hồ Chí Minh'}`}</div>
        </div>
      </Col>
      <Col lg={3} md={4} sm={24} xs={24} className='right-container'>
        <span className='time-seen'>9 tháng trước</span>
        <div className='btn-container'>
          <Button className='btn-follow' icon={<AiOutlineHeart />} />
          <Button className='btn-show-detail'>Chi tiết</Button>
        </div>
      </Col>
    </Row>
  )
}

export default ItemCompany
