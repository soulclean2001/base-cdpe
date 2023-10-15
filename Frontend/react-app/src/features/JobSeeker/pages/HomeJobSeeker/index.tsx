import { useEffect } from 'react'
import BannerCarousel from '~/components/BannerCarousel/BannerCarousel'
import Search from '~/components/Search/Search'
import './home.scss'
import TopCompany from './Components/TopCompany/TopCompany'
import TopJob from './Components/TopJob/TopJob'
import TopCarrer from './Components/TopCarrer/TopCarrer'
// import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
// import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { useNavigate } from 'react-router-dom'
// import { isExpired } from '~/utils/jwt'
import { AuthState } from '~/features/Auth/authSlice'
// import me from '~/api/me.api'
// import { isExpired } from '~/utils/jwt'

const Home = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && auth.role !== 2) {
      navigate('/candidate-login')
    }
  }, [auth])

  const userInfo = useSelector((state: RootState) => state.jobSeeker)
  console.log('info by ui', userInfo)

  return (
    <div className='home-container'>
      <div className='home-search-container'>
        <Search />
      </div>

      <div className='home-carousel-container'>
        <BannerCarousel />
      </div>
      <TopCompany />
      <div>
        <TopJob />
      </div>
      <div>
        <TopCarrer />
      </div>
    </div>
  )
}

export default Home
