import { useState, useEffect } from 'react'
import './servicesPage.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import ServiceItem from './components/ServiceItem/ServiceItem'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isExpired } from '~/utils/jwt'

const HomePage = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (auth && auth.isLogin && auth.accessToken && !isExpired(auth.accessToken) && auth.role !== 1) {
      navigate('/employer-login')
    }
  }, [auth])
  const services = [
    {
      title: 'Đăng Tuyển',
      img: 'https://employer.vietnamworks.com/v2/img/gallery/home-offer-5.svg?v=1693145251',
      price: '2,160,000',
      descriptions: [
        { value: 'Đảm bảo hài lòng 100%' },
        { value: 'Đăng tuyển nhanh chóng và nhận hồ sơ ngay lập tức' },
        { value: 'Quản lý hồ sơ trực tuyến của bạn dễ dàng' }
      ]
    },
    {
      title: 'Tìm hồ sơ',
      img: 'https://employer.vietnamworks.com/v2/img/gallery/home-offer-2.svg',
      price: '3,870,000',
      descriptions: [
        { value: '30 ngày truy cập không giới hạn hệ thống dữ liệu chuyên nghiệp' },
        { value: 'Tìm ứng viên hiệu quả và nhanh chóng' },
        { value: 'Chủ động tìm kiếm ứng viên ngay hôm nay' }
      ]
    },
    {
      title: 'Quảng bá thương hiệu',
      img: 'https://employer.vietnamworks.com/v2/img/gallery/home-offer-6.svg?v=1693145251',
      price: '23,200,000',
      descriptions: [
        {
          value:
            'Trang chủ HFWork nhận được hơn 7 triệu lượt truy cập mỗi tháng từ các ứng viên và chuyên gia giỏi nhất tại Việt Nam'
        },
        { value: 'Đặt Logo và Banner tại trang chủ sẽ là vị trí chiến lược để thu hút nhân tài' }
      ]
    }
  ]
  const [hasMore, serHasMore] = useState(true)
  const [items, setItems] = useState<any>([services[0]])
  const fetchMoreData = () => {
    if (items && items.length >= services.length) {
      serHasMore(false)
      return
    }
    setTimeout(() => {
      // if (items && items.length === 0) setItems([services[0]])
      if (items && items.length === 1) setItems([...items, services[1]])
      if (items && items.length === 2) setItems([...items, services[2]])
    }, 50)
  }
  return (
    <div className='employer-home-page-container'>
      <div className='services-top-banner'>
        <img src='https://employer.vietnamworks.com/v2/img/gallery/emp_hero_banner.jpg' alt='' />
      </div>
      <div className='services-content'>
        <div className='services-page-title-container'>
          <h1>DỊCH VỤ CỦA CHÚNG TÔI</h1>
          <p>
            Chúng tôi cung cấp nhiều dịch vụ giúp nhà tuyển dụng kết nối với nhiều nhân tài hơn, để họ có thể kết nối
            với ứng cử viên nhanh hơn
          </p>
        </div>

        <hr />
        <InfiniteScroll
          style={{ width: '100%' }}
          className='infinite-scroll-custom'
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4></h4>}
        >
          {items &&
            items.map((item: any, index: number) => (
              <ServiceItem
                key={item.title}
                title={item.title}
                price={item.price}
                img={item.img}
                descriptions={item.descriptions}
                swap={index % 2 === 0 ? false : true}
              />
            ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default HomePage
