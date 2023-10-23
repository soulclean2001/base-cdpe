import { Button, Col, Input, Pagination, Row, Select } from 'antd'
import './style.scss'
import { BsSearch } from 'react-icons/bs'
import CompanyItem from '../../components/CompanyItem/CompanyItem'
import { useEffect, useState } from 'react'
import { getDataPage } from '~/api/fake.api'
import { getAllFiles } from '~/api/industries.api'
const listField = [
  { value: 'Tất cả lĩnh vực' },
  { value: 'Bán lẻ/Bán sỉ' },
  { value: 'Bảo hiểm' },
  { value: 'Bất động sản' },
  { value: 'Cơ khí/Máy móc/Thiết bị công nghiệp' },
  { value: 'Phần mềm CNTT' }
]
const dataCompany = [
  {
    id: '1',
    backgroundImage:
      'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fnull%2Fen%2FNSN_1_c2.jpg&w=3840&q=75',
    logo: 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2FXaydungcongnghiepNSN%2Fvi%2Flogo.png&w=3840&q=75',
    nameCompany: 'Công ty cổ phần Xây dựng & Công nghiệp',
    field: 'Kỹ thuật xây dựng/Cơ sở hạ tầng',
    followers: 51,
    totalJob: 8
  },
  {
    id: '2',
    backgroundImage:
      'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fnull%2Fen%2FLED_BACKGROUND_GI%E1%BB%AEA_1_.jpg&w=3840&q=75',
    logo: 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fcong-ty-co-phan-thiet-ke-va-xay-dung-giza-viet-nam%2Fen%2Flogo_giza_-_195x60.png&w=3840&q=75',
    nameCompany: 'Công ty cổ phần Xây dựng & Công nghiệp',
    field: 'Kỹ thuật xây dựng/Cơ sở hạ tầng',
    followers: 51,
    totalJob: 8
  },
  {
    id: '3',
    backgroundImage:
      'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fnull%2Fen%2FLED_BACKGROUND_GI%E1%BB%AEA_1_.jpg&w=3840&q=75',
    logo: 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fcong-ty-co-phan-thiet-ke-va-xay-dung-giza-viet-nam%2Fen%2Flogo_giza_-_195x60.png&w=3840&q=75',
    nameCompany: 'Công ty cổ phần Xây dựng & Công nghiệp',
    field: 'Kỹ thuật xây dựng/Cơ sở hạ tầng',
    followers: 51,
    totalJob: 8
  },
  {
    id: '4',
    backgroundImage:
      'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fnull%2Fen%2FLED_BACKGROUND_GI%E1%BB%AEA_1_.jpg&w=3840&q=75',
    logo: 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fcong-ty-co-phan-thiet-ke-va-xay-dung-giza-viet-nam%2Fen%2Flogo_giza_-_195x60.png&w=3840&q=75',
    nameCompany: 'Công ty cổ phần Xây dựng & Công nghiệp',
    field: 'Kỹ thuật xây dựng/Cơ sở hạ tầng',
    followers: 51,
    totalJob: 8
  }
]
const ListCompany = () => {
  const [pageClick, setPageClick] = useState(1)
  const [limitOnPage, setLimitOnPage] = useState(9)
  const handleChangePage = (valuePageClick: any) => {
    setPageClick(valuePageClick)
    console.log('xxx', valuePageClick)
  }
  //call fake api
  const initDataFake = [{ id: '', title: '', price: 0 }]
  const [dataFake, setDataFake] = useState(initDataFake)
  const [totalItems, setTotalItems] = useState(1)
  useEffect(() => {
    fetchFakeData()
  }, [pageClick])

  const fetchFakeData = async () => {
    const data = {
      limit: limitOnPage,
      skip: (pageClick - 1) * limitOnPage
    }
    const res = await getDataPage(data)
    setDataFake(res.products)
    setTotalItems(res.total)
    console.log('total', totalItems)
    console.log('datafake', dataFake)
  }
  return (
    <div className='company-page-content'>
      <div className='title'>Khám Phá Văn Hoá Công Ty</div>
      <div className='descrip'>Tìm hiểu văn hoá công ty và chọn cho bạn nơi làm việc phù hợp nhất.</div>
      <div className='company-search-container'>
        <Input size='large' placeholder='Nhập tên công ty' prefix={<BsSearch />} />
        <Button size='large' className='btn-search'>
          Tìm
        </Button>
      </div>
      <div className='list-company-container'>
        <Row className='title-container'>
          <Col lg={18} md={18} sm={24} xs={24} className='title-list-company'>{`Danh sách công ty (524)`}</Col>
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
            />
          </Col>
        </Row>
        <Row className='list-company' justify={'space-between'}>
          {/* {dataCompany &&
                dataCompany.map((companyItem) => (
                  <Col md={8} sm={24} key={companyItem.id} style={{ padding: '10px' }}>
                    <CompanyItem
                      backgroundImage={companyItem.backgroundImage}
                      logo={companyItem.logo}
                      nameCompany={companyItem.nameCompany}
                      field={companyItem.field}
                      followers={companyItem.followers}
                      totalJobs={companyItem.totalJob}
                    />
                  </Col>
                ))} */}
          {dataFake &&
            dataFake.map((item) => (
              <Col lg={8} md={12} sm={24} xs={24} key={item.id} style={{ padding: '10px' }}>
                <CompanyItem nameCompany={item.title} followers={item.price} totalJobs={item.price} />
              </Col>
            ))}
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
        <Pagination
          onChange={handleChangePage}
          responsive
          defaultCurrent={1}
          pageSize={limitOnPage}
          showSizeChanger={false}
          total={totalItems}
        />
      </div>
    </div>
  )
}

export default ListCompany
