import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import banner from '~/assets/alena-aenami-cold-1k.jpg'

import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useEffect, useState } from 'react'
import JobInfo from './components/JobInfo/JobInfo'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
import ShowMoreJob from './components/ShowMoreJob/ShowMoreJob'
import ModalApplyCV from './components/ModalApplyCV'
import { useParams } from 'react-router-dom'
import apiPost from '~/api/post.api'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'

interface JobDetailType {
  [key: string]: any
}
const JobDetailPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { infoUrlJobDetail } = useParams()
  const [jobDetail, setJobDetail] = useState<JobDetailType>()
  const [jobInfo, setJobInfo] = useState({})
  const [companyInfo, setCompanyInfo] = useState({})
  const [headerModalApply, setHeaderModalApply] = useState({})
  const getPostById = async () => {
    if (infoUrlJobDetail) {
      const idJobDetail = infoUrlJobDetail.match(/id-(\w+)/)
      await apiPost.getPostById(idJobDetail?.[1] as string).then((rs) => {
        setJobDetail(rs.result)
        setJobInfo({
          description: rs.result.job_description,
          requirement: rs.result.job_requirement,
          skills: rs.result.skills,
          benefits: rs.result.benefits,
          working_locations: rs.result.working_locations,
          created_at: rs.result.created_at.slice(0, 10).split('-').reverse().join('/'),
          job_level: rs.result.job_level,
          industries: rs.result.industries
        })
        setCompanyInfo({
          info: rs.result.company.company_info,
          working_locations: rs.result.company.working_locations,
          company_size: rs.result.company.company_size
        })
      })
    }
  }
  useEffect(() => {
    getPostById()
  }, [])

  useEffect(() => {
    // Theo dõi sự kiện cuộn chuột khi component được render
    window.addEventListener('scroll', handleScroll)

    // Xóa sự kiện cuộn chuột khi component bị unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Hàm xử lý sự kiện cuộn chuột
  const handleScroll = () => {
    if (window.scrollY > 500) {
      // Hiển thị thẻ div khi người dùng đã cuộn qua một số pixel (ở đây là 500)
      setIsVisible(true)
    } else {
      // Ẩn thẻ div khi người dùng chưa cuộn đủ
      setIsVisible(false)
    }
  }
  const showModalApplyCV = () => {
    if (jobDetail) {
      setHeaderModalApply({
        id: jobDetail._id,
        logo: jobDetail.company.logo,
        nameJob: jobDetail.job_title,
        nameCompany: jobDetail.company.company_name,
        salary: jobDetail.is_salary_visible
          ? jobDetail.salary_range &&
            `${jobDetail.salary_range.min.toLocaleString('vi', {
              currency: 'VND'
            })} - ${jobDetail.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
          : 'Thương lượng',
        level: jobDetail.job_level,
        address: jobDetail.working_locations
      })
      setIsModalOpen(true)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1_info_job',
      label: 'THÔNG TIN',
      children: <JobInfo data={jobInfo} />
    },
    {
      key: '2_info_company',
      label: 'CÔNG TY',
      children: <CompanyInfo data={companyInfo} />
    },
    {
      key: '3_else_jobs',
      label: 'VIỆC LÀM KHÁC TỪ CÔNG TY',
      children: <ShowMoreJob />
    }
  ]
  return (
    <div className='job-detail-page-container'>
      <div
        className='page-background'
        style={{
          backgroundImage: `url(${jobDetail && jobDetail.company.background ? jobDetail.company.background : banner})`
        }}
      >
        <div className='background-overlay'></div>
      </div>
      <div className='content'>
        <div className='content-header'>
          <Row className='job-title-container'>
            <Col md={4} sm={24} xs={24} className='logo-company'>
              <img src={jobDetail && jobDetail.company.logo ? jobDetail.company.logo : ''} />
            </Col>
            <Col md={20} sm={24} xs={24} className='title-info'>
              <div className='job-name'>{jobDetail && jobDetail.job_title ? jobDetail.job_title : 'Tên việc làm'}</div>
              <div className='name-company'>
                {jobDetail && jobDetail.company.company_name ? jobDetail.company.company_name : 'Tên công ty'}
              </div>
              <div className='working-address'>{`Địa điểm làm việc: ${
                jobDetail && jobDetail.working_locations
                  ? jobDetail.working_locations
                      .map((loc: WorkingLocation) => {
                        return loc.city_name
                      })
                      .filter((value: string, index: number, self: string) => {
                        return self.indexOf(value) === index
                      })
                  : 'Khu vực làm việc'
              }`}</div>
              <div className='salary'>
                {jobDetail && jobDetail.is_salary_visible
                  ? jobDetail.salary_range &&
                    `${jobDetail.salary_range.min.toLocaleString('vi', {
                      currency: 'VND'
                    })} - ${jobDetail.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
                  : 'Thương lượng'}
              </div>
              <Row justify={'space-between'}>
                <Col lg={18} md={16} sm={24} xs={24} style={{ marginBottom: '10px' }}>
                  <div className='total-accept'>{`- Số lượng tuyển: ${
                    jobDetail && jobDetail.number_of_employees_needed ? jobDetail.number_of_employees_needed : 0
                  } người`}</div>
                  <div className='expiration-date'>{`- Hạn cuối nhận hồ sơ: ${
                    jobDetail && jobDetail.expired_date
                      ? jobDetail.expired_date.slice(0, 10).split('-').reverse().join('-')
                      : 'dd/MM/YYYY'
                  }`}</div>
                </Col>
                <Col lg={6} md={8} sm={24} xs={24} className='btn-container'>
                  <Button size='large' className='btn-follow' icon={<AiOutlineHeart />} />
                  <Button onClick={showModalApplyCV} size='large' className='btn-apply'>
                    Nộp Đơn
                  </Button>
                  <ModalApplyCV headerModalData={headerModalApply} open={isModalOpen} handleCancel={handleCancel} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div className='job-info-container'>
          <Tabs className='tab-job-detail' defaultActiveKey='1_info_job' items={items} onChange={onChange} />
        </div>
        <Row className={`sticky-div ${isVisible ? '' : 'hidden'}`}>
          <Col lg={14} md={16} sm={23} xs={23} className='sticky-content'>
            <div className='logo'>
              <img
                src={
                  jobDetail && jobDetail.company.logo
                    ? jobDetail.company.logo
                    : 'https://images.vietnamworks.com/pictureofcompany/86/10475262.png'
                }
                alt=''
              />
            </div>
            <div className='sticky-info-container'>
              <div className='name-job'>{jobDetail && jobDetail.job_title ? jobDetail.job_title : 'Tên việc làm'}</div>
              <div className='name-company'>
                {jobDetail && jobDetail.company.company_name ? jobDetail.company.company_name : 'Tên công ty'}
              </div>
            </div>
          </Col>

          <Col lg={4} md={4} sm={23} xs={23} className='btn-container'>
            <Button size='large' className='btn-follow' icon={<AiOutlineHeart />} />
            <Button onClick={showModalApplyCV} size='large' className='btn-apply'>
              Nộp Đơn
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default JobDetailPage
