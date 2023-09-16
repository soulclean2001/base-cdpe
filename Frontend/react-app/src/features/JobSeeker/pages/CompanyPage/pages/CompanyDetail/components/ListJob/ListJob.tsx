import { Col, Input, Row } from 'antd'
import './style.scss'

import { FiSearch } from 'react-icons/fi'
import JobItem from '~/features/JobSeeker/pages/Job/Components/JobItem/JobItem'

const ListJob = () => {
  const customStyleItem = {
    backgroundColorBeforeHover: 'white',
    backgroundColorAfterHover: 'rgb(239, 245, 255)',
    borderBefore: '1px solid rgb(241, 241, 241)',
    borderAfter: '1px solid rgb(160, 193, 255)'
  }
  return (
    <div className='list-job-company-detail'>
      <Row className='title-container'>
        <Col lg={17} md={15} sm={24} xs={24}>
          <h2>VỊ TRÍ ĐANG TUYỂN DỤNG</h2>
        </Col>

        <Col lg={6} md={8} sm={24} xs={24} className='filter-container'>
          <Input allowClear size='large' placeholder='Nhập chức danh' prefix={<FiSearch />} />
        </Col>
      </Row>
      <JobItem style={customStyleItem} customHover={true} />
    </div>
  )
}

export default ListJob
