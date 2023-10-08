import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer/Footer'
import HeaderEmployer from './components/HeaderEmployer'
import AdminSideBar from './features/Admin/components/AdminSideBar'
import AdminPage from './features/Admin'

const Layout = (props: any) => {
  const { forRole } = props
  return (
    <div className='container'>
      {forRole && forRole === 'CADIDATE_ROLE' && (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
      {forRole && forRole === 'EMPLOYER_ROLE' && (
        <>
          <HeaderEmployer roleType={'EMPLOYER_ROLE'} />
          <Outlet />
          <Footer />
        </>
      )}
      {forRole && forRole === 'ADMIN_ROLE' && (
        <>
          <Outlet />
        </>
      )}
    </div>
  )
}

export default Layout
