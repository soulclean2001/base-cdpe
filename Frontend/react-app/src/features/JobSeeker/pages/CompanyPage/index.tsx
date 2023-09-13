import './style.scss'
import Search from '~/components/Search/Search'

import { Outlet } from 'react-router-dom'

const CompanyPage = () => {
  return (
    <div className='company-page-container'>
      <div style={{ paddingTop: '20px' }}>
        <Search />
      </div>
      <div className='company-page-contentt'>
        <Outlet />
      </div>
    </div>
  )
}

export default CompanyPage
