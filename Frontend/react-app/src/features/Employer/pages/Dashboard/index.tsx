import { useDispatch, useSelector } from 'react-redux'
import { FaBars } from 'react-icons/fa'
import './dashboard.scss'
import { handleChangeSideBar } from '../../employerSlice'
import SideBarEmployer from './components/SideBar/SideBarEmployer'
import { Outlet, useNavigate } from 'react-router-dom'

import { RootState } from '~/app/store'
import { useEffect, useState } from 'react'
import { AuthState } from '~/features/Auth/authSlice'
// import { isExpired } from '~/utils/jwt'

// import SideBarEmployer from './components/SideBar/SideBarEmployer'

const DashboarEmployer = () => {
  const url = window.location.href
  const dispatch = useDispatch()
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const [widthContent, setWidthContent] = useState('82.2%')
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [cssHeader, setCssHeader] = useState('')
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken) {
      if (auth.role !== 1) {
        navigate('/employer-login')
        return
      }
      if (auth.verify.toString() === '0') {
        navigate('/employer/active-page')
        return
      }
      if (auth.verify === 2) {
        navigate('/employer-login')
        return
      }
    } else {
      navigate('/employer-login')
      return
    }
  }, [auth])
  useEffect(() => {
    if (collap) {
      setWidthContent('100%')
    } else {
      setWidthContent('100%')
    }
  }, [collap])

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window
    return { innerWidth, innerHeight }
  }
  const [hiddenButtonCollapsed, setHiddenButtonCollapsed] = useState(false)
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
    <div className='employer-dashboard-container'>
      {/* <div style={{ width: '25%' }}> */}
      <SideBarEmployer roleType={'EMPLOYER_ROLE'} />
      {/* </div> */}

      <div
        className='employer-dashboard-content'
        style={{
          color:
            url === 'http://127.0.0.1:3001/employer/dashboard' || url === 'https://hfworks.id.vn/employer/dashboard'
              ? 'white'
              : 'black',
          width: widthContent,
          background:
            url === 'http://127.0.0.1:3001/employer/dashboard' || url === 'https://hfworks.id.vn/employer/dashboard'
              ? 'linear-gradient(270deg, #005aff, #001744)'
              : 'white'
        }}
      >
        <FaBars hidden={hiddenButtonCollapsed} onClick={() => dispatch(handleChangeSideBar())} />

        <Outlet />
      </div>
    </div>
  )
}

export default DashboarEmployer
