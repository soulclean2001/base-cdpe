import RightItem from '../RightItem'
import './style.scss'
const dataJobApplied = [
  { idJob: 'idJob1', idCompany: 'idCompany1', logo: '', nameJob: 'name job1', nameCompany: 'name company 1' },
  { idJob: 'idJob2', idCompany: 'idCompany2', logo: '', nameJob: 'name job2', nameCompany: 'name company 2' }
]
const RightContent = () => {
  return (
    <div className='right-content-chat-page-container'>
      <div className='header-container'>
        <h5>TIN TUYỂN DỤNG ĐÃ ỨNG TUYỂN</h5>
      </div>
      <div className='list-applied-jobs'>
        {dataJobApplied.map((job) => (
          <RightItem key={job.idJob} data={job} />
        ))}
      </div>
    </div>
  )
}

export default RightContent
