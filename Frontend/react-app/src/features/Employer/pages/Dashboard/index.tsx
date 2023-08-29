import { useDispatch, useSelector } from 'react-redux'
import { FaBars } from 'react-icons/fa'
import './dashboard.scss'
import { handleChangeSideBar } from '../../employerSlice'
import SideBarEmployer from './components/SideBar/SideBarEmployer'
import { Outlet } from 'react-router-dom'
import { Col, Row } from 'antd'
import { RootState } from '~/app/store'
import { useEffect, useState } from 'react'
import ModalInfoPost from './components/ModalInfoPost/ModalInfoPost'
// import SideBarEmployer from './components/SideBar/SideBarEmployer'

const DashboarEmployer = () => {
  const dispatch = useDispatch()
  const collap = useSelector((state: RootState) => state.employer.collapsed)
  const [widthContent, setWidthContent] = useState('85%')
  useEffect(() => {
    if (collap) {
      setWidthContent('90%')
    } else {
      setWidthContent('82.2%')
    }
  }, [collap])
  return (
    <div className='employer-dashboard-container'>
      <div style={{ width: '25%' }}>
        <SideBarEmployer />
      </div>

      <div className='employer-dashboard-content' style={{ width: widthContent }}>
        <FaBars onClick={() => dispatch(handleChangeSideBar())} />

        <Outlet />
      </div>
    </div>
  )
}

export default DashboarEmployer
