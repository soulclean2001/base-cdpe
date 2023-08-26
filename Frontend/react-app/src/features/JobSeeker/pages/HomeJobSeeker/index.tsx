// import { useState, useEffect } from 'react'
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

// import me from '~/api/me.api'
// import { isExpired } from '~/utils/jwt'

const Home = () => {
  // const dispatchAsync: AppThunkDispatch = useAppDispatch()
  // const auth: AuthState = useSelector((state: RootState) => state.auth)
  const userInfo = useSelector((state: RootState) => state.jobSeeker)
  console.log('info by ui', userInfo)
  // useEffect(() => {
  //   if (auth.accessToken) {
  //     getProfile()
  //   }
  // }, [])
  // const getProfile = async () => {
  //   // const user = dispatchAsync(getMe())
  //   // console.log('xxx', user)
  //   // const data ={id:user.data.}
  //   // dispatchAsync(setMeStatus(user))
  //   const user2 = await getMe()
  //   console.log('use2 ', user2)
  // }
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
