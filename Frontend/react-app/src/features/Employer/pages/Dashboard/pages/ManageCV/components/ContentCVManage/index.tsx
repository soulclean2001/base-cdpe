import { Col, Input, Row, Select, Tabs } from 'antd'
import { DatePicker } from 'antd'
// import viVN from 'antd/es/locale/vi_VN'
import { FiSearch } from 'react-icons/fi'
const { RangePicker } = DatePicker
import '../../style.scss'
import TableApplied from '../TableApplied/TableApplied'
const listJob = [
  { value: 'Tất cả công việc', label: 'Tất cả công việc' },
  { value: '#jobId1 - job Name 1', label: '#jobId1 - job Name 1' },
  { value: '#jobId2 - job Name 2', label: '#jobId2 - job Name 2' },
  { value: '#jobId3 - job Name 3', label: '#jobId3 - job Name 3' }
]
const listStatus = [
  { value: 'allStatus', label: 'Tất tất trạng thái' },
  { value: 'pending', label: 'pending' },
  { value: 'approved', label: 'approved' },
  { value: 'reject', label: 'reject' },
  { value: 'potential', label: 'potential' },
  { value: 'interview', label: 'interview' },
  { value: 'hired', label: 'hired' },
  { value: 'notcontactable', label: 'notcontactable' }
]
const ContentCVManage = () => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <div>
      <Row className='filter-container'>
        <Col md={8} sm={24} xs={24} style={{ padding: '5px' }}>
          <Input size='large' placeholder='Tìm kiếm tên, email, số điện thoại' prefix={<FiSearch />} />
        </Col>
        <Col md={6} sm={8} xs={24} style={{ padding: '5px' }}>
          <Select
            defaultValue='Tất cả công việc'
            size='large'
            style={{ width: '100%' }}
            showSearch
            onChange={handleChange}
            options={listJob}
          />
        </Col>
        <Col md={5} sm={8} xs={24} style={{ padding: '5px' }}>
          <RangePicker
            style={{ width: '100%' }}
            size='large'
            placeholder={['Từ ngày', 'Đến ngày']}
            format='DD-MM-YYYY'
            // locale={viVN}
          />
        </Col>
        <Col md={4} sm={8} xs={24} style={{ padding: '5px' }}>
          <Select
            size='large'
            style={{ width: '100%' }}
            defaultValue='allStatus'
            onChange={handleChange}
            options={listStatus}
          />
        </Col>
      </Row>
      <div className='cv-applied-manage-content'>
        <div className='header-content'>
          <div className='total-cv'>{`Đã tìm thấy ${0} ứng viên`}</div>
        </div>
        <div className='table-container'>
          <TableApplied />
        </div>
      </div>
    </div>
  )
}

export default ContentCVManage
