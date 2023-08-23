import { SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Select, Space } from 'antd'
import './search.scss'

const Search = () => {
  const optionsArea = [
    {
      value: 'All',
      label: <span className='sub-option-area'>Tất cả khu vực</span>
    },
    {
      value: 'HCM',
      label: <span className='sub-option-area'>TP. Hồ Chí Minh</span>
    },
    {
      value: 'HN',
      label: <span className='sub-option-area'>TP. Hà Nội</span>
    }
  ]
  return (
    <div className='search-header-container'>
      <Row className='search-content' justify={'center'}>
        <Col xs={14} sm={14} md={12}>
          <Input
            className='search-input-left'
            placeholder='Tìm kiếm việc làm, công ty, chức vụ ...'
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={8} sm={8} md={5}>
          <Select className='search-input-right' defaultValue='All' options={optionsArea} />
        </Col>
        <Col xs={0} sm={0} md={3} className='btn-search-container'>
          <button className='btn-search'>Tìm kiếm</button>
        </Col>
      </Row>
    </div>
  )
}

export default Search
