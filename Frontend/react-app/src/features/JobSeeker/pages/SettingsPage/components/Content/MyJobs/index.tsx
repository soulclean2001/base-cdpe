import { Tabs } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import ItemJob from './components/ItemJob'
import apiJobApplied from '~/api/jobsApplication.api'
import { useEffect, useState } from 'react'
const dataJobFollow = [
  {
    id: '1',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 1',
    nameCompany: 'nameCompany 1',
    province: 'province 1',
    salary: 'salary 1'
  },
  {
    id: '2',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 2',
    nameCompany: 'nameCompany 2',
    province: 'province 2',
    salary: 'salary 2'
  }
]
const dataJobsApplied = [
  {
    id: '1',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 1',
    nameCompany: 'nameCompany 1',
    province: 'province 1',
    salary: 'salary 1',
    status: 'Pending'
  },
  {
    id: '2',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 2',
    nameCompany: 'nameCompany 2',
    province: 'province 2',
    salary: 'salary 2',
    status: 'Rejected'
  },
  {
    id: '3',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 3',
    nameCompany: 'nameCompany 2',
    province: 'province 2',
    salary: 'salary 2',
    status: 'Approved'
  },
  {
    id: '4',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 4',
    nameCompany: 'nameCompany 4',
    province: 'province 2',
    salary: 'salary 2',
    status: 'Interview'
  },
  {
    id: '5',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 5',
    nameCompany: 'nameCompany 4',
    province: 'province 2',
    salary: 'salary 2',
    status: 'Hired'
  },
  {
    id: '6',
    logo: 'https://static.topcv.vn/company_logos/EPFPdSTI4GO7rt50vHNMxR1Wetw4d4tE_1637890540____68d4254397ee4890df952e5db722f389.jpg',
    jobTitle: 'Job Title 6',
    nameCompany: 'nameCompany 4',
    province: 'province 2',
    salary: 'salary 2',
    status: 'NotContactable'
  }
]
const onChangeTab = (key: string) => {
  console.log('click tab', key)
}
const items: TabsProps['items'] = [
  // {
  //   key: '1',
  //   label: 'Việc làm đã lưu',
  //   children: (
  //     <>
  //       {dataJobFollow.map((job) => (
  //         <ItemJob key={job.id} type='ITEM_SAVE_JOB' data={job} />
  //       ))}
  //     </>
  //   )
  // },
  {
    key: '2',
    label: 'Việc làm đã ứng tuyển',
    children: <></>
  }
]
interface ListJobType {
  [key: string]: any
}
const MyJobs = () => {
  const [listJobs, setListJobs] = useState<ListJobType[]>([])
  useEffect(() => {
    fetchListJobs()
  }, [])
  const fetchListJobs = async () => {
    await apiJobApplied.getAllJobApplicationsFromCandidate().then((rs) => {
      console.log('rs', rs)
      setListJobs(rs.result)
    })
  }
  return (
    <div className='my-jobs-container'>
      <div className='title'>Việc Làm Của Tôi</div>
      <div className='list-jobs-container'>
        <Tabs className='tab-container' defaultActiveKey='2' items={items} onChange={onChangeTab} />
        <div style={{ padding: '0 15px 15px 15px' }}>
          {listJobs &&
            listJobs.map((job) => (
              <ItemJob
                key={job.job._id}
                data={{
                  id: job.job._id,
                  logo: job.job.company.logo,
                  jobTitle: job.job.job_title,
                  nameCompany: job.job.company.company_name,
                  salary: !job.job.is_salary_visible
                    ? `${job.job.salary_range.min.toLocaleString('vi', {
                        currency: 'VND'
                      })} - ${job.job.salary_range.max.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`
                    : 'Thương lượng',
                  status: job.status,
                  province:
                    job.job.working_locations
                      .map((loc: any) => {
                        return loc.city_name
                      })
                      .filter((value: any, index: number, self: any) => {
                        return self.indexOf(value) === index
                      })
                      ?.join(', ') || '',
                  updateDate: job.updated_at
                }}
                type='ITEM_APPLIED_JOB'
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default MyJobs
