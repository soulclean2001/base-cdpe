import { Tabs } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import ItemJob from './components/ItemJob'
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
  {
    key: '1',
    label: 'Việc làm đã lưu',
    children: (
      <>
        {dataJobFollow.map((job) => (
          <ItemJob key={job.id} type='ITEM_SAVE_JOB' data={job} />
        ))}
      </>
    )
  },
  {
    key: '2',
    label: 'Việc làm đã ứng tuyển',
    children: (
      <>
        {dataJobsApplied.map((job) => (
          <ItemJob key={job.id} data={job} type='ITEM_APPLIED_JOB' />
        ))}
      </>
    )
  }
]
const MyJobs = () => {
  return (
    <div className='my-jobs-container'>
      <div className='title'>Việc Làm Của Tôi</div>
      <div className='list-jobs-container'>
        <Tabs className='tab-container' defaultActiveKey='1' items={items} onChange={onChangeTab} />
      </div>
    </div>
  )
}

export default MyJobs
