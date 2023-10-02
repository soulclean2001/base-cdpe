import { useEffect, useState } from 'react'
import ServiceItem from '../../components/ServiceItem'
import './style.scss'
import { Button } from 'antd'
const listPostService = [
  { id: '1', name: 'Đăng Tuyển 30-ngày - M', price: 2000000 },
  { id: '2', name: 'Đăng Tuyển 30-ngày - Cơ Bản', price: 2300000 }
]
const listSupportsService = [{ id: '3', name: 'Thêm - Ưu Tiên Hàng Đầu 30 ngày - M', price: 2000000 }]

const descriptionsData = `Là sự kết hợp các dịch vụ đăng tuyển cơ bản trên trang web vietnamworks.com và Ứng Dụng Di Động của VietnamWorks, bao gồm:

Trên trang web: Tin tuyển dụng được đăng tuyển cơ bản
Trên Ứng Dụng Di Động: Tin tuyển dụng được đính kèm tag "HOT" và được hiển thị ở khu vực ưu tiên hơn so với các tin đăng tuyển cơ bản trong 30 ngày.`
const PostServices = () => {
  const [itemActive, setItemActive] = useState('1')
  const [descriptions, setDescriptions] = useState([''])
  useEffect(() => {
    handleFormatInfo()
    console.log(handleFormatInfo())
  }, [])
  const handleFormatInfo = () => {
    if (descriptionsData) {
      setDescriptions(descriptionsData.split('\n'))
    }
  }
  return (
    <div className='post-options-service-container'>
      <div className='left-content-wapper'>
        <div className='list-options-post-service list-options-wapper'>
          <div className='title'>ĐĂNG TUYỂN</div>
          <div className='list-options'>
            {listPostService &&
              listPostService.map((item) => (
                <div key={item.id} onClick={() => setItemActive(item.id)}>
                  <ServiceItem
                    data={item}
                    idActive={itemActive}
                    hiddenBorder={item.id === listPostService[listPostService.length - 1].id ? true : false}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className='list-options-suport-service list-options-wapper'>
          <div className='title'>DỊCH VỤ HỖ TRỢ</div>
          <div className='list-options'>
            {listSupportsService &&
              listSupportsService.map((item) => (
                <div key={item.id} onClick={() => setItemActive(item.id)}>
                  <ServiceItem
                    data={item}
                    idActive={itemActive}
                    hiddenBorder={item.id === listSupportsService[listSupportsService.length - 1].id ? true : false}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className='right-content-wapper'>
        <div className='title-service'>
          <div className='name'>Đăng Tuyển 30-ngày - M</div>
          <div className='price'>1.953.000 VND</div>
        </div>
        <div className='descriptions-wapper content-service-wapper'>
          <div className='title'>Mô tả dịch vụ:</div>
          <div className='descriptions'>
            {descriptions.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
        <div className='picture-preview-wapper content-service-wapper'>
          <div className='title'>Hiển thị trên HFWorks cho Người tìm việc:</div>
          <div className='image-wapper'>
            <img src='https://images03.vietnamworks.com/buy-packages-online/jobPost_basicJobPostMobile.jpg' alt='' />
          </div>
        </div>
        <div className='btn-add-to-cart-container'>
          <Button className='btn-add-to-cart' size='large'>
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostServices
