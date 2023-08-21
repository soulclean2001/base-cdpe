import { useDispatch } from 'react-redux'
import { FaBars } from 'react-icons/fa'
import './dashboard.scss'
import { handleChangeSideBar } from '../../employerSlice'
import SideBarEmployer from './components/SideBar/SideBarEmployer'
// import SideBarEmployer from './components/SideBar/SideBarEmployer'

const DashboarEmployer = () => {
  const dispatch = useDispatch()

  return (
    <div className='employer-dashboard-container'>
      <SideBarEmployer />
      <div className='employer-dashboard-content'>
        <FaBars onClick={() => dispatch(handleChangeSideBar())} />
        <span>content dashboar</span>
      </div>
    </div>
  )
}

export default DashboarEmployer
