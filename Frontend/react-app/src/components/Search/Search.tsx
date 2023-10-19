import { SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Select, Space } from 'antd'
import './search.scss'
import { DataOptionType } from '~/features/Employer/pages/Dashboard/components/ModalWorkLocation'
import { getAllProviencesApi } from '~/api/provinces.api'
import { useEffect, useState } from 'react'
const initValue: DataOptionType[] = []
const Search = () => {
  const [provincesData, setProvincesData] = useState<Array<DataOptionType>>([{ value: 'Tất cả khu vực' }])
  useEffect(() => {
    fetchProvinces()
  }, [])
  const fetchProvinces = async () => {
    const res = await getAllProviencesApi().then((rs) => {
      setProvincesData([...provincesData, ...rs])
    })
    console.log('res', res)
    // setProvincesData(res)
  }
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
            allowClear
            size='large'
            className='search-input-left'
            placeholder='Tìm kiếm việc làm,  chức vụ ...'
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={8} sm={8} md={5}>
          <Select
            showSearch
            size='large'
            className='search-input-right'
            defaultValue='Tất cả khu vực'
            options={provincesData}
          />
        </Col>
        <Col xs={0} sm={0} md={3} className='btn-search-container'>
          <button className='btn-search'>Tìm kiếm</button>
        </Col>
      </Row>
    </div>
  )
}

export default Search
