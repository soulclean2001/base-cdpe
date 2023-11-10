import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination as SwiperPage, Mousewheel } from 'swiper/modules'
import { Button, Col, Pagination, Row, Select } from 'antd'
import { useState } from 'react'
import JobItem from '../../Components/JobItem/JobItem'

import './style.scss'
import CompanyRightItem from './components/CompanyRightItem'
import { useLocation } from 'react-router-dom'
import apiPost, { PostRequestSearchType } from '~/api/post.api'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import { getAllIndustries } from '~/api/industries.api'
import apiHome from '~/api/home.api'
// const listField = [
//   { value: 'Tất cả lĩnh vực' },
//   { value: 'Bán lẻ/Bán sỉ' },
//   { value: 'Bảo hiểm' },
//   { value: 'Bất động sản' },
//   { value: 'Cơ khí/Máy móc/Thiết bị công nghiệp' },
//   { value: 'Phần mềm CNTT' }
// ]
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
  { value: 'all', label: 'Tất cả mức lương' },
  { value: '0-4999999', label: 'Dưới 5 triệu' },
  { value: '5000000-10000000', label: 'Từ 5 đến 10 triệu' },
  { value: '10000000-15000000', label: 'Từ 10 đến 15 triệu' },
  { value: '15000001-max', label: 'Trên 15 triệu' }
]

interface JobItemType {
  _id: string
  logo: string
  jobTitle: string
  companyName: string
  salary_range: { min: number; max: number }
  working_locations: WorkingLocation[]
  created_at: string
  is_salary_visible: boolean
}
interface TopCompanyDataType {
  id: string
  name: string
  logo: string
  banner: string
}
const ListJob = () => {
  const location = useLocation()
  const [listTopCompany, setListTopCompany] = useState<TopCompanyDataType[]>([])
  const limitOnPage = 2
  const [totalItems, setTotalItems] = useState(1)
  const [activeSort, setActiveSort] = useState('last-post-date')
  const [listJobs, setListJobs] = useState<Array<JobItemType>>([])
  const [pageClick, setPageClick] = useState(1)
  const initRequestFilter: PostRequestSearchType = {
    sort_by_post_date: '-1',
    page: '1',
    limit: limitOnPage.toString(),
    content: location.state ? location.state.content : '',
    working_location: location.state ? location.state.cityName : ''
  }
  const [requestSearch, setRequestSearch] = useState<PostRequestSearchType>(initRequestFilter)

  useEffect(() => {
    if (location && location.state) {
      setRequestSearch({ ...requestSearch, content: location.state.content, working_location: location.state.cityName })
    }
  }, [location.state])
  useEffect(() => {
    setPageClick(1)
    getJobs()
  }, [requestSearch])
  const getJobs = async (page?: string) => {
    await apiPost.searchJobs({ ...requestSearch, page: page ? page : '1' }).then((rs) => {
      console.log('Rs', rs)
      let jobs: JobItemType[] = []
      rs.result.jobs.map((job: any) => {
        console.log('job', job)
        jobs.push({
          _id: job._id,
          logo: job.company.logo,
          companyName: job.company.company_name,
          created_at: job.posted_date.slice(0, 10),
          is_salary_visible: job.salary_visible,
          jobTitle: job.job_title,
          salary_range: job.salary_range,
          working_locations: job.working_locations
        })
      })
      setListJobs(jobs)
      setTotalItems(rs.result.total)
    })
  }

  const handleActiveSort = (event: any) => {
    if (event.target.id === 'last-post-date')
      setRequestSearch({ ...requestSearch, sort_by_post_date: '-1', sort_by_salary: '' })
    if (event.target.id === 'old-post-date')
      setRequestSearch({ ...requestSearch, sort_by_post_date: '1', sort_by_salary: '' })
    if (event.target.id === 'salary-low-to-hight')
      setRequestSearch({ ...requestSearch, sort_by_salary: '1', sort_by_post_date: '' })
    if (event.target.id === 'salary-hight-to-low')
      setRequestSearch({ ...requestSearch, sort_by_salary: '-1', sort_by_post_date: '' })
    setActiveSort(event.target.id)
    // console.log('event.target.id', event.target.id)
  }

  const handleSetSalary = (value: string) => {
    if (value === 'all') {
      setRequestSearch({ ...requestSearch, 'salary[min]': '', 'salary[max]': '' })
      return
    }
    let parts = value.split('-')

    let min = parts[0]
    let max = ''

    if (parts[1] !== 'max') {
      max = parts[1]
    }

    setRequestSearch({ ...requestSearch, 'salary[min]': min, 'salary[max]': max })
  }
  //set value page click
  const handleChangePage = async (valuePageClick: any) => {
    setPageClick(valuePageClick)
    // setPageClick(valuePageClick)
    // setRequestSearch({ ...requestSearch, page: valuePageClick })
    await getJobs(valuePageClick)
  }
  //
  useEffect(() => {
    fetchTopCompany()
  }, [])
  const fetchTopCompany = async () => {
    await apiHome.getCompaniesBanner().then((rs) => {
      console.log('top ', rs)
      let temp = rs.result.map((company: { [key: string]: any }) => {
        return { id: company._id, name: company.company_name, logo: company.logo, banner: company.background }
      })
      console.log('temp', temp)
      setListTopCompany(temp)
    })
  }

  return (
    <div className='list-job-page-container'>
      <div className='title'>
        <div>
          <span>Dánh sách việc làm</span>
        </div>
      </div>
      <div className='job-content'>
        <Row className='menu-sort-job'>
          <Col lg={5} md={0} sm={0} xs={0} className='select-menu select-carrer'>
            <Select
              // mode='tags'
              defaultValue='Tất cả ngành nghề'
              showSearch
              //   optionLabelProp='children'
              style={{ width: '100%' }}
              // maxTagCount={1}
              // maxTagTextLength={15}
              size='large'
              options={[{ value: 'Tất cả ngành nghề' }, ...getAllIndustries]}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, career: value === 'Tất cả ngành nghề' ? '' : value })
              }
            />
          </Col>
          {/* <Col lg={6} md={0} sm={0} xs={0} className=' select-menu select-carrer-field'>
            <Select
              placeholder={'Tất cả lĩnh vực'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listField}
            />
          </Col> */}
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-level'>
            <Select
              defaultValue={'Tất cả cấp bật'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listLevel}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, job_level: value === 'Tất cả cấp bật' ? '' : value })
              }
            />
          </Col>
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-type-job'>
            <Select
              defaultValue={'Tất cả loại hình'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listTypeJobs}
              onChange={(value) =>
                setRequestSearch({ ...requestSearch, job_type: value === 'Tất cả loại hình' ? '' : value })
              }
            />
          </Col>
          <Col lg={4} md={0} sm={0} xs={0} className='select-menu select-salary'>
            <Select
              defaultValue={'all'}
              showSearch
              style={{ width: '100%' }}
              maxTagCount={1}
              maxTagTextLength={8}
              size='large'
              options={listSalary}
              onChange={(value) => handleSetSalary(value)}
            />
          </Col>
          <Col lg={0} md={24} sm={24} xs={24}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button>Bộ lọc</Button>
              <Button>Sắp xếp</Button>
            </div>
          </Col>
        </Row>
        <Row className='list-job-container'>
          <Col lg={16} md={24} sm={24} xs={24}>
            <div className='sort-list-job'>
              <span>Sắp xếp theo </span>
              <div id='sort-container'>
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
              </div>
            </div>
            <div>
              {listJobs &&
                listJobs.map((item) => (
                  <JobItem
                    key={item._id}
                    idJob={item._id}
                    img={item.logo}
                    nameJob={item.jobTitle}
                    salary={
                      !item.is_salary_visible
                        ? `${item.salary_range.min.toLocaleString('vi', {
                            currency: 'VND'
                          })} - ${item.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
                        : 'Thương lượng'
                    }
                    nameCompany={item.companyName}
                    area={item.working_locations
                      .map((loc) => {
                        return loc.city_name
                      })
                      .filter((value, index, self) => {
                        return self.indexOf(value) === index
                      })}
                    timePost={item.created_at}
                  />
                ))}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 0' }}>
                <Pagination
                  onChange={handleChangePage}
                  responsive
                  defaultCurrent={1}
                  pageSize={limitOnPage}
                  current={pageClick}
                  //   current={totalItems}
                  //   showLessItems={false}
                  showSizeChanger={false}
                  total={totalItems}
                />
              </div>
            </div>
          </Col>
          <Col lg={7} md={0} sm={0} xs={0} className='right-job-content'>
            <div className='list-top-company'>
              <div className='title'>Các Công Ty Hàng Đầu</div>

              <Swiper
                autoplay
                // style={{ width: '100%', height: '100%', maxHeight: '190vh' }}
                style={{
                  width: '100%',
                  // height: '100%',
                  height: listTopCompany && listTopCompany.length > 5 ? '190vh' : `${listTopCompany.length * 250}px`,
                  maxHeight: listTopCompany && listTopCompany.length > 5 ? '190vh' : `${listTopCompany.length * 250}px`
                }}
                slidesPerView={listTopCompany && listTopCompany.length > 5 ? 5 : listTopCompany.length}
                direction={'vertical'}
                // spaceBetween={'180px'}
                pagination={{
                  clickable: true
                }}
                mousewheel={true}
                modules={[SwiperPage, Mousewheel]}
                className='mySwiper'
              >
                {listTopCompany &&
                  listTopCompany.map((item) => (
                    <SwiperSlide key={item.id} style={{ height: '100%', width: '100%' }}>
                      <CompanyRightItem data={item} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ListJob
