import Search from '~/components/Search/Search'
import './job.scss'
import { Outlet } from 'react-router-dom'

const Job = () => {
  return (
    <div className='job-container'>
      <div className='search-container'>
        <Search />
      </div>
      <Outlet />
    </div>
  )
}

export default Job
