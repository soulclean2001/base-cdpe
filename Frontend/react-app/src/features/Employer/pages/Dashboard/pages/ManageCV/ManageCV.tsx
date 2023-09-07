import { Col, Input, Row, Select } from 'antd'
import TableApplied from './components/TableApplied/TableApplied'
import './style.scss'
import { FiSearch } from 'react-icons/fi'
const ManageCV = () => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <div className='cv-applied-manage-container'>
      <div className='title'>Quản Lý Hồ Sơ Ứng Viên</div>
      <Row className='filter-container'>
        <Col md={8}>
          <Input size='large' placeholder='Tìm kiếm tên, email, số điện thoại' prefix={<FiSearch />} />
        </Col>
        <Col md={4}>
          <Select
            defaultValue='allJob'
            size='large'
            style={{ width: '100%' }}
            showSearch
            onChange={handleChange}
            options={[
              { value: 'Tất cả công việc', label: 'Tất cả công việc' },
              { value: '#jobId1 - job Name 1', label: '#jobId1 - job Name 1' },
              { value: '#jobId2 - job Name 2', label: '#jobId2 - job Name 2' },
              { value: '#jobId3 - job Name 3', label: '#jobId3 - job Name 3' }
            ]}
          />
        </Col>
        <Col md={4}>
          <Select
            size='large'
            style={{ width: '100%' }}
            defaultValue='allStatus'
            onChange={handleChange}
            options={[
              { value: 'allStatus', label: 'Tất tất trạng thái' },
              { value: 'pendding', label: 'pendding' },
              { value: 'hasReview', label: 'hasReview' },
              { value: 'reject', label: 'reject' },
              { value: 'approved', label: 'approved' }
            ]}
          />
        </Col>
      </Row>
      <div className='cv-applied-manage-content'>
        <div className='header-content'>
          <div className='total-cv'>{`Đã tìm thấy ${0} ứng viên`}</div>
          <div className='filter-table'>tất cả , cv chưa xem</div>
        </div>
        <div className='table-container'>
          <TableApplied />
        </div>
      </div>
    </div>
  )
}

export default ManageCV
