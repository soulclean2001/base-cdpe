
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './topCarrer.scss'
const TopCarrer = () => {
    const dataCarrer = [
        {
            id:'1',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"BÁN HÀNG",
            totalJob: 19999
        },
        {
            id:'2',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"IT - PHÂN MỀM",
            totalJob: 19999
        },
        {
            id:'3',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"MARKETING",
            totalJob: 19999
        },
        {
            id:'4',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"ĐIỆN / ĐIỆN TỬ",
            totalJob: 19999
        },
        {
            id:'5',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"TÀI CHÍNH / ĐẦU TƯ",
            totalJob: 19999
        },
        {
            id:'6',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"DỊCH VỤ KHÁCH HÀNG",
            totalJob: 19999
        },
        {
            id:'7',
            img: "https://images02.vietnamworks.com/mobile_banner/39fc1e25eac4528661800fe9e28267ca.png",
            name:"KẾ TOÁN",
            totalJob: 19999
        }
    ]
  return (
    <div className="top-carrer-container">
        <div className="title">
            Ngành Nghề Trọng Điểm
        </div>
        <div className="top-carrer-content">
        <Swiper
        pagination={{
            clickable: true,
          }}
        slidesPerView={6}
        navigation={true}
        spaceBetween={20}
        modules={[Pagination, Navigation]}
        className="mySwiper3"
      >
        {
            dataCarrer && dataCarrer.map((item)=>(
            <SwiperSlide className='carrer-item' key={item.id}>
                <img className='img-carrer' src={item.img} alt=''/>
                <div className="name-carrer">{item.name}</div>
                <div className="total-job">{`${item.totalJob} Việc làm`}</div>
            </SwiperSlide>
            ))
        }
        
      </Swiper>
        </div>
    </div>
  )
}

export default TopCarrer