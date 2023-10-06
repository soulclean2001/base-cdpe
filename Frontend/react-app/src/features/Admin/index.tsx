import { Outlet } from 'react-router-dom'
import AdminSideBar from './components/AdminSideBar'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '~/app/store'
import HeaderEmployer from '~/components/HeaderEmployer'
const AdminPage = () => {
  const [hiddenButtonCollapsed, setHiddenButtonCollapsed] = useState(false)
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  console.log('colap', collap)
  const [widthContent, setWidthContent] = useState('100%')
  useEffect(() => {
    if (collap) {
      setWidthContent('calc(100%-80px)')
    } else {
      setWidthContent('calc(100%-270px)')
    }
  }, [collap])
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }

  const [windowSize, setWindowSize] = useState(getWindowSize())
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    if (windowSize.innerWidth <= 786) {
      setHiddenButtonCollapsed(true)
    } else {
      setHiddenButtonCollapsed(false)
    }
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [windowSize.innerWidth <= 786])
  return (
    <div className='admin-page-container'>
      <AdminSideBar />
      <div className='admin-content-wapper' style={{ width: widthContent }}>
        <HeaderEmployer roleType={'ADMIN_ROLE'} hiddenButtonCollapsed={hiddenButtonCollapsed} />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminPage
