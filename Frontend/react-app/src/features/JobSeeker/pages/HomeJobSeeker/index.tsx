import BannerCarousel from '~/components/BannerCarousel/BannerCarousel'
import Search from '~/components/Search/Search'
import './home.scss'
import TopCompany from './Components/TopCompany/TopCompany'
import TopJob from './Components/TopJob/TopJob'
import TopCarrer from './Components/TopCarrer/TopCarrer'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { useEffect } from 'react'
import { getMe } from '~/api/users.api'
import { isExpired } from '~/utils/jwt'

const Home = () => {
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  useEffect(() => {
    if (auth.accessToken) {
      getProfile()
    }
  }, [])
  const getProfile = async () => {
    const user = await getMe()
    console.log(user)
  }
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
