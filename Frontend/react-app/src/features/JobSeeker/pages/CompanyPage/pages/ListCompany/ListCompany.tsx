import { Button, Col, Input, Pagination, Row, Select } from 'antd'
import './style.scss'
import { BsSearch } from 'react-icons/bs'
import CompanyItem from '../../components/CompanyItem/CompanyItem'
import { useEffect, useState } from 'react'

import { getAllFiles } from '~/api/industries.api'
import apiCompany from '~/api/company.api'
interface CompanyItemType {
  [key: string]: any
}
const ListCompany = () => {
  // const [pageClick, setPageClick] = useState(1)
  const limitOnPage = 9
  const [totalPage, setTotalPage] = useState(0)
  const [listCompany, setListCompany] = useState<Array<CompanyItemType>>()
  const [content, setContent] = useState('')
  const [field, setField] = useState('')
  useEffect(() => {
    getListCompany()
  }, [field])
  const getListCompany = async (page?: string) => {
    await apiCompany
      .searchCompany({ content, field, limit: limitOnPage.toString(), page: page ? page : '1' })
      .then((rs) => {
        setListCompany(rs.result.companies)
        setTotalPage(rs.result.total)
      })
  }
  const handleChangePage = (valuePageClick: any) => {
    // setPageClick(valuePageClick)
    getListCompany(valuePageClick)
  }

  return (
    <div className='company-page-content'>
      <div className='title'>Khám Phá Văn Hoá Công Ty</div>
      <div className='descrip'>Tìm hiểu văn hoá công ty và chọn cho bạn nơi làm việc phù hợp nhất.</div>
      <div className='company-search-container'>
        <Input
          allowClear
          onChange={(e) => setContent(e.target.value)}
          size='large'
          placeholder='Nhập tên công ty'
          prefix={<BsSearch />}
        />
        <Button onClick={() => getListCompany()} size='large' className='btn-search'>
          Tìm
        </Button>
      </div>
      <div className='list-company-container'>
        <Row className='title-container'>
          <Col lg={18} md={18} sm={24} xs={24} className='title-list-company'>{`Danh sách công ty (${totalPage})`}</Col>
          <Col lg={6} md={6} sm={24} xs={24}>
            <Select
              placeholder={'Tất cả lĩnh vực'}
              defaultValue={'Tất cả lĩnh vực'}
              showSearch
              // maxTagCount={1}
              // maxTagTextLength={8}
              style={{ width: '100%' }}
              size='large'
              options={[{ value: 'Tất cả lĩnh vực' }, ...getAllFiles]}
              onChange={(value) => setField(value === 'Tất cả lĩnh vực' ? '' : value)}
            />
          </Col>
        </Row>
        <Row className='list-company'>
          {listCompany && listCompany.length > 0 ? (
            listCompany.map((item) => (
              <Col lg={8} md={12} sm={24} xs={24} key={item._id} style={{ padding: '10px' }}>
                <CompanyItem
                  key={item._id}
                  idCompany={item._id}
                  field={item.fields}
                  logo={item.logo}
                  backgroundImg={item.background}
                  nameCompany={item.company_name}
                  followers={item.follow_num}
                  totalJobs={item.job_num}
                />
              </Col>
            ))
          ) : (
            <>Không tìm thấy</>
          )}
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
        <Pagination
          onChange={handleChangePage}
          responsive
          defaultCurrent={1}
          pageSize={limitOnPage}
          showSizeChanger={false}
          total={totalPage}
        />
      </div>
    </div>
  )
}

export default ListCompany
