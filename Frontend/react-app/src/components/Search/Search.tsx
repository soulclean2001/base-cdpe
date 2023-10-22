import { SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Select } from 'antd'
import './search.scss'
import { DataOptionType } from '~/features/Employer/pages/Dashboard/components/ModalWorkLocation'
import { getAllProviencesApi } from '~/api/provinces.api'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [content, setContent] = useState(location && location.state ? location.state.content : '')
  const [cityName, setCityName] = useState(location && location.state ? location.state.cityName : '')
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
  const handleSubmitSearch = () => {
    console.log('xx')
    navigate('/jobs', { state: { content: content, cityName: cityName === 'Tất cả khu vực' ? '' : cityName } })
    // window.location.reload()
  }

  return (
    <div className='search-header-container'>
      <Row className='search-content' justify={'center'}>
        <Col xs={14} sm={14} md={12}>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            allowClear
            size='large'
            className='search-input-left'
            placeholder='Tìm kiếm việc làm,  chức vụ ...'
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={8} sm={8} md={5}>
          <Select
            onChange={(value) => setCityName(value)}
            showSearch
            size='large'
            className='search-input-right'
            defaultValue={cityName ? cityName : 'Tất cả khu vực'}
            options={provincesData}
          />
        </Col>
        <Col xs={0} sm={0} md={3} className='btn-search-container'>
          <button onClick={handleSubmitSearch} className='btn-search'>
            Tìm kiếm
          </button>
        </Col>
      </Row>
    </div>
  )
}

export default Search
