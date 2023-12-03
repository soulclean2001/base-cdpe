import Search from '~/components/Search/Search'
import './job.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { useEffect } from 'react'
// import { isExpired } from '~/utils/jwt'

const Job = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if ((auth && auth.isLogin && auth.accessToken && auth.role !== 2) || auth.verify === 2) {
      navigate('/candidate-login')
    }
  }, [auth])
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
