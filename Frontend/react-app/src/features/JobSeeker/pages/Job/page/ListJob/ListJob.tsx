import { useEffect } from 'react'
import { Button, Col, Pagination, Row, Select } from 'antd'
import { useState } from 'react'
import JobItem from '../../Components/JobItem/JobItem'
import { getDataPage } from '~/api/fake.api'
import './style.scss'
const listCareer = [
  {
    value: 'An toàn lao động'
  },
  {
    value: 'Bác sĩ'
  },
  {
    value: 'Bán hàng'
  }
]
const listField = [
  { value: 'Tất cả lĩnh vực' },
  { value: 'Bán lẻ/Bán sỉ' },
  { value: 'Bảo hiểm' },
  { value: 'Bất động sản' },
  { value: 'Cơ khí/Máy móc/Thiết bị công nghiệp' },
  { value: 'Phần mềm CNTT' }
]
const listLevel = [
  { value: 'Tất cả cấp bật' },
  { value: 'Thực tập sinh/Sinh viên' },
  { value: 'Mới tối nghiệp' },
  { value: 'Nhân viên' },
  { value: 'Trưởng phòng' },
  { value: 'Giám đốc' }
]
const listTypeJobs = [
  { value: 'Tất cả loại hình' },
  { value: 'Bán thời gian' },
  { value: 'Toàn thời gian' },
  { value: 'Thực tập' },
  { value: 'Online' },
  { value: 'Nghề tự do' },
  { value: 'Hợp đồng thời vụ' },
  { value: 'Khác' }
]
const listSalary = [
  { value: 'Tất cả mức lương' },
  { value: 'Dưới 5 triệu' },
  { value: 'Từ 5 đến 10 triệu' },
  { value: 'Từ 10 đến 15 triệu' },
  { value: 'Trên 15 triệu' }
]
const dataJob = [
  {
    id: '1',
    img: 'https://images.vietnamworks.com/pictureofcompany/ed/11125246.png',
    nameJob: 'Brand Manager',
    nameCompany: 'Nestlé Vietnam Ltd.,',
    salary: 'Thương lượng',
    area: 'Hồ Chí Minh',
    timePost: 'Hôm nay'
  },
  {
    id: '2',
    img: 'https://images.vietnamworks.com/pictureofcompany/e4/11126406.png',
    nameJob: 'Internal Auditor, Internal Audit Department - Iad, Head Office',
    nameCompany: 'Ngân Hàng TNHH Indovina – Hội Sở',
    salary: 'Thương lượng',
    area: 'Hồ Chí Minh',
    timePost: 'Hôm nay'
  },
  {
    id: '3',
    img: 'https://images.vietnamworks.com/pictureofcompany/e4/11126406.png',
    nameJob: 'Corporate Banking Officer – Cho Lon Branch',
    nameCompany: 'Ngân Hàng TNHH Indovina – Hội Sở,',
    salary: 'Thương lượng',
    area: 'Hồ Chí Minh',
    timePost: 'Hôm nay'
  },
  {
    id: '4',
    img: 'https://images.vietnamworks.com/pictureofcompany/ab/10331916.png',
    nameJob: 'Thư Ký Giám Đốc Tài Chính',
    nameCompany: 'Công Ty TNHH Thời Trang Elise',
    salary: '$640 - $1100',
    area: 'Hồ Chí Minh',
    timePost: 'Hôm nay'
  }
]
const ListJob = () => {
  const [activeSort, setActiveSort] = useState('defaul-sort')
  const handleActiveSort = (event: any) => {
    setActiveSort(event.target.id)
  }
  //fake pagination
  const [pageClick, setPageClick] = useState(1)
  const [limitOnPage, setLimitOnPage] = useState(5)
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
  //
  //set value page click
  const handleChangePage = (valuePageClick: any) => {
    setPageClick(valuePageClick)
    console.log('xxx', valuePageClick)
  }
  //
  return (
    <div className='list-job-page-container'>
      <div className='title'>
        <div>
          <span>Dánh sách việc làm</span>
        </div>
      </div>
      <div className='job-content'>
        <Row className='menu-sort-job'>
          <Col md={5} sm={0} xs={0} className='select-menu select-carrer'>
            <Select
              mode='tags'
              placeholder={'Tất cả ngành nghề'}
              showSearch
              //   optionLabelProp='children'
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={15}
              size='large'
              options={listCareer}
            />
          </Col>
          <Col md={6} sm={0} xs={0} className=' select-menu select-carrer-field'>
            <Select
              placeholder={'Tất cả lĩnh vực'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listField}
            />
          </Col>
          <Col md={4} sm={0} xs={0} className='select-menu select-level'>
            <Select
              defaultValue={'Tất cả cấp bật'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listLevel}
            />
          </Col>
          <Col md={4} sm={0} xs={0} className='select-menu select-type-job'>
            <Select
              defaultValue={'Tất cả loài hình'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listTypeJobs}
            />
          </Col>
          <Col md={4} sm={0} xs={0} className='select-menu select-salary'>
            <Select
              defaultValue={'Tất cả mức lương'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listSalary}
            />
          </Col>
          <Col md={0} sm={24} xs={24}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button>Bộ lọc</Button>
              <Button>Sắp xếp</Button>
            </div>
          </Col>
        </Row>
        <Row className='list-job-container'>
          <Col md={16} sm={24} xs={24}>
            <div className='sort-list-job'>
              <span>Sắp xếp theo </span>
              <div id='sort-container'>
                <div
                  id='defaul-sort'
                  className={activeSort === 'defaul-sort' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >
                  Mặc định
                </div>
                <div
                  id='salary-low-to-hight'
                  className={activeSort === 'salary-low-to-hight' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Lương (thấp-cao)`}</div>
                <div
                  id='salary-hight-to-low'
                  className={activeSort === 'salary-hight-to-low' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Lương(cao-thấp)`}</div>
                <div
                  id='last-post-date'
                  className={activeSort === 'last-post-date' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Ngày đăng (mới nhất)`}</div>
                <div
                  id='old-post-date'
                  className={activeSort === 'old-post-date' ? `option-sort active-sort` : 'option-sort'}
                  onClick={handleActiveSort}
                >{`Ngày đăng (cũ nhất)`}</div>
              </div>
            </div>
            <div>
              {/* {dataJob &&
                dataJob.map((job) => (
                  <JobItem
                    key={job.id}
                    img={job.img}
                    nameJob={job.nameJob}
                    nameCompany={job.nameCompany}
                    salary={job.salary}
                    area={job.area}
                    timePost={job.timePost}
                  />
                ))} */}
              {dataFake && dataFake.map((item) => <JobItem key={item.id} nameJob={item.title} salary={item.price} />)}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
                <Pagination
                  onChange={handleChangePage}
                  responsive
                  defaultCurrent={1}
                  pageSize={limitOnPage}
                  //   current={totalItems}
                  //   showLessItems={false}
                  showSizeChanger={false}
                  total={totalItems}
                />
              </div>
            </div>
          </Col>
          <Col md={7} sm={0} xs={0} className='right-job-content'>
            quảng cáo
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ListJob
