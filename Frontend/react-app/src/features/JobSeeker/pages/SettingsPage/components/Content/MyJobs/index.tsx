import { Tabs } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import ItemJob from './components/ItemJob'
import apiJobApplied from '~/api/jobsApplication.api'
import { useEffect, useState } from 'react'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'

interface ListJobType {
  [key: string]: any
}
const MyJobs = () => {
  const [listJobs, setListJobs] = useState<ListJobType[]>([])
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  useEffect(() => {
    if (notificaions.page > 0) fetchListJobs()
  }, [notificaions.total])

  const fetchListJobs = async () => {
    await apiJobApplied.getAllJobApplicationsFromCandidate().then((rs) => {
      setListJobs(rs.result)
    })
  }
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
  return (
    <div className='my-jobs-container'>
      <div className='title'>Việc Làm Của Tôi</div>
      <div className='list-jobs-container'>
        <Tabs className='tab-container' defaultActiveKey='2' items={items} onChange={onChangeTab} />
        <div style={{ padding: '0 15px 15px 15px' }}>
          {listJobs &&
            listJobs.map((job) => (
              <ItemJob
                key={job._id}
                data={{
                  id: job.job._id,
                  logo: job.job.company.logo,
                  jobTitle: job.job.job_title,
                  nameCompany: job.job.company.company_name,
                  salary: job.job.is_salary_visible
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
          {!listJobs ||
            (listJobs.length < 1 && (
              <span style={{ fontSize: '14px', fontWeight: '300' }}>Bạn chưa ứng tuyển công việc</span>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MyJobs
