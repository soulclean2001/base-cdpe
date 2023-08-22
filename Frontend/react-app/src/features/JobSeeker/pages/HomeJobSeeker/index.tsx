import BannerCarousel from '~/components/BannerCarousel/BannerCarousel'
import Search from '~/components/Search/Search'
import './home.scss'
import TopCompany from './Components/TopCompany/TopCompany'
import TopJob from './Components/TopJob/TopJob'
import TopCarrer from './Components/TopCarrer/TopCarrer'

const Home = () => {
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
