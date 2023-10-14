import './style.scss'
import Search from '~/components/Search/Search'

import { Outlet, useNavigate } from 'react-router-dom'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { useEffect } from 'react'
import { isExpired } from '~/utils/jwt'
const CompanyPage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && !isExpired(auth.accessToken) && auth.role !== 2) {
      navigate('/candidate-login')
    }
  }, [auth])
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
