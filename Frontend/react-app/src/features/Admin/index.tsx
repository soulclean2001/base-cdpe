import { Outlet, useNavigate, useOutlet } from 'react-router-dom'
import AdminSideBar from './components/AdminSideBar'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '~/app/store'
import HeaderEmployer from '~/components/HeaderEmployer'
import AdminOverview from './contents/Overview'
import { AuthState } from '../Auth/authSlice'
import { isExpired } from '~/utils/jwt'
const AdminPage = () => {
  const outlet = useOutlet()
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [hiddenButtonCollapsed, setHiddenButtonCollapsed] = useState(false)
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const [widthContent, setWidthContent] = useState('100%')

  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && !isExpired(auth.accessToken)) {
      if (auth.role !== 0) navigate('/admin-login')
    } else {
      navigate('/admin-login')
    }
  }, [auth])
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
        {outlet ? <Outlet /> : <AdminOverview />}
      </div>
    </div>
  )
}

export default AdminPage
