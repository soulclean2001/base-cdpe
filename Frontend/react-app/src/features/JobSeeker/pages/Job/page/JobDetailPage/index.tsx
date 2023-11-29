import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import banner from '~/assets/alena-aenami-cold-1k.jpg'
// import { subDays } from 'date-fns'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useEffect, useState } from 'react'
import JobInfo from './components/JobInfo/JobInfo'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
// import ShowMoreJob from './components/ShowMoreJob/ShowMoreJob'
import ModalApplyCV from './components/ModalApplyCV'
import { useNavigate, useParams } from 'react-router-dom'
import apiPost from '~/api/post.api'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import ListJob from '../../../CompanyPage/pages/CompanyDetail/components/ListJob/ListJob'
import logoTemp from '~/assets/HF_logo.jpg'
import apiJobAplli from '~/api/jobsApplication.api'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
interface JobDetailType {
  [key: string]: any
}
const JobDetailPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { infoUrlJobDetail } = useParams()
  const [jobDetail, setJobDetail] = useState<JobDetailType>()
  const [jobInfo, setJobInfo] = useState({})
  const [companyInfo, setCompanyInfo] = useState({})
  const [headerModalApply, setHeaderModalApply] = useState({})
  const [checkApplied, setCheckApplied] = useState(false)
  const [checkExpires, setCheckExpires] = useState(false)
  const [checkBacklist, setCheckBacklist] = useState(false)
  const [checkStatus, setCheckStatus] = useState(false)

  const getPostById = async () => {
    if (infoUrlJobDetail) {
      const idJobDetail = infoUrlJobDetail.match(/id-(\w+)/)
      if (!idJobDetail || !idJobDetail[1]) return
      let userId = ''
      if (auth.user_id) userId = auth.user_id
      await apiPost.getPostById(idJobDetail[1] as string, userId).then((rs) => {
        if (new Date(rs.result.expired_date) < new Date()) setCheckExpires(true)
        if (rs.result.is_not_apply) setCheckBacklist(true)

        if (rs.result.status.toString() !== '0' || !rs.result.visibility) {
          setCheckStatus(true)
        }
        setJobDetail(rs.result)
        setJobInfo({
          description: rs.result.job_description,
          requirement: rs.result.job_requirement,
          skills: rs.result.skills,
          benefits: rs.result.benefits,
          working_locations: rs.result.working_locations,
          created_at: rs.result.posted_date.slice(0, 10).split('-').reverse().join('/'),
          job_level: rs.result.job_level,
          industries: rs.result.careers,
          application_email: rs.result.application_email
        })
        setCompanyInfo({
          info: rs.result.company.company_info,
          working_locations: rs.result.company.working_locations,
          company_size: rs.result.company.company_size,
          fields: rs.result.company.fields
        })
      })
      if (auth && auth.isLogin) {
        await apiJobAplli.checkApplied(idJobDetail[1]).then((rs) => {
          setCheckApplied(rs.result.is_applied)
        })
      }
    }
  }
  useEffect(() => {
    getPostById()
  }, [infoUrlJobDetail])
  useEffect(() => {
    if (isSubmit) {
      getPostById()
      setIsSubmit(false)
    }
  }, [isSubmit])

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
    if (!auth || !auth.isLogin) {
      navigate('/candidate-login')
      return
    }
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
  const handleSubmit = () => {
    setIsSubmit(true)
    setIsModalOpen(false)
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
      children: <ListJob companyId={jobDetail ? jobDetail.company_id : ''} />
    }
  ]
  if (!jobDetail)
    return <div style={{ height: '86vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>...</div>
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
              <img src={jobDetail && jobDetail.company.logo ? jobDetail.company.logo : logoTemp} />
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
                      ? 'Hết ngày ' +
                        new Date(jobDetail.expired_date).toISOString().slice(0, 10).split('-').reverse().join('-')
                      : 'dd/MM/YYYY'
                  }`}</div>
                </Col>
                <Col lg={6} md={8} sm={24} xs={24} className='btn-container'>
                  <Button size='large' className='btn-follow' icon={<AiOutlineHeart />} />
                  <Button
                    disabled={checkStatus || checkApplied || checkBacklist || checkExpires ? true : false}
                    onClick={showModalApplyCV}
                    size='large'
                    className='btn-apply'
                    style={{
                      backgroundColor:
                        checkStatus || checkApplied || checkBacklist || checkExpires ? '#f58968' : '#ff7d55'
                    }}
                  >
                    {checkApplied ? 'Đã nộp đơn' : checkExpires ? 'Hết hạn' : 'Nộp đơn'}
                  </Button>
                  <ModalApplyCV
                    handleSubmit={handleSubmit}
                    headerModalData={headerModalApply}
                    open={isModalOpen}
                    handleCancel={handleCancel}
                  />
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
              <img src={jobDetail && jobDetail.company.logo ? jobDetail.company.logo : logoTemp} alt='' />
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
            <Button
              style={{
                backgroundColor: checkStatus || checkApplied || checkBacklist || checkExpires ? '#f58968' : '#ff7d55'
              }}
              disabled={checkStatus || checkApplied || checkBacklist || checkExpires ? true : false}
              onClick={showModalApplyCV}
              size='large'
              className='btn-apply'
            >
              {checkApplied ? 'Đã nộp đơn' : checkExpires ? 'Hết hạn' : 'Nộp đơn'}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default JobDetailPage
