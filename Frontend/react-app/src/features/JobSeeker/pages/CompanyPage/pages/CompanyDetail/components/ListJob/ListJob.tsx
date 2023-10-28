import { Col, Input, Pagination, Row } from 'antd'
import './style.scss'

import { FiSearch } from 'react-icons/fi'
import JobItem from '~/features/JobSeeker/pages/Job/Components/JobItem/JobItem'
import apiCompany from '~/api/company.api'
import { useEffect, useState } from 'react'
interface JobItemType {
  [key: string]: any
}
const ListJob = (props: any) => {
  const { companyId } = props
  const customStyleItem = {
    backgroundColorBeforeHover: 'white',
    backgroundColorAfterHover: 'rgb(239, 245, 255)',
    borderBefore: '1px solid rgb(241, 241, 241)',
    borderAfter: '1px solid rgb(160, 193, 255)'
  }
  const [listJobs, setListJobs] = useState<Array<JobItemType>>([])

  const [pageClick, setPageClick] = useState(1)
  const limit = 5
  const displayedData = listJobs.slice((pageClick - 1) * limit, (pageClick - 1) * limit + limit)
  useEffect(() => {
    if (companyId) getAllJob()
  }, [companyId])
  const getAllJob = async () => {
    if (!companyId) return
    await apiCompany.getAllJobByCompanyId(companyId).then((rs) => {
      setListJobs(rs.result)
    })
  }
  const handleChangePage = (valuePageClick: any) => {
    setPageClick(valuePageClick)
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
      {displayedData &&
        displayedData.map((job) => (
          <JobItem
            key={job._id}
            style={customStyleItem}
            customHover={true}
            idJob={job._id}
            img={job.company.logo}
            nameJob={job.job_title}
            nameCompany={job.company.company_name}
            salary={
              job.is_salary_visible
                ? `${job.salary_range.min.toLocaleString('vi', {
                    currency: 'VND'
                  })} - ${job.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
                : 'Thương lượng'
            }
          />
        ))}

      <Pagination
        style={{ display: 'flex', justifyContent: 'center' }}
        onChange={handleChangePage}
        defaultCurrent={1}
        current={pageClick}
        pageSize={limit}
        total={listJobs.length}
      />
    </div>
  )
}

export default ListJob
