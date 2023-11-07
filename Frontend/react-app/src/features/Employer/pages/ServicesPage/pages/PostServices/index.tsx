import { useEffect, useState } from 'react'
import ServiceItem from '../../components/ServiceItem'
import './style.scss'
import { Button } from 'antd'
import apiPackage from '~/api/package.api'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import apiCart, { ItemCartRequestType } from '~/api/cart.api'
import { toast } from 'react-toastify'
const listPostService = [
  { id: '1', name: 'Đăng Tuyển 30-ngày - M', price: 2000000 },
  { id: '2', name: 'Đăng Tuyển 30-ngày - Cơ Bản', price: 2300000 }
]
const listSupportsService = [{ id: '3', name: 'Thêm - Ưu Tiên Hàng Đầu 30 ngày - M', price: 2000000 }]

const descriptionsData = `Là sự kết hợp các dịch vụ đăng tuyển cơ bản trên trang web vietnamworks.com và Ứng Dụng Di Động của VietnamWorks, bao gồm:

Trên trang web: Tin tuyển dụng được đăng tuyển cơ bản
Trên Ứng Dụng Di Động: Tin tuyển dụng được đính kèm tag "HOT" và được hiển thị ở khu vực ưu tiên hơn so với các tin đăng tuyển cơ bản trong 30 ngày.`
interface PackageType {
  [key: string]: any
}
const PostServices = () => {
  const [itemActive, setItemActive] = useState('')
  const [descriptions, setDescriptions] = useState([''])
  const [includes, setIncludes] = useState([''])
  const [listServices, setListServices] = useState<PackageType[]>([])
  const [detailService, setDetailService] = useState<PackageType>()
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    await apiPackage.getAllPackageForEmployClient({ limit: '1000', page: '1', title: '' }).then((rs) => {
      console.log('rs', rs.result.pks)
      if (rs.result.pks) {
        setListServices(rs.result.pks)
        setItemActive(rs.result.pks[0]._id)
      }
    })
  }
  useEffect(() => {
    if (itemActive) fetchDetails(itemActive)
  }, [itemActive])
  const fetchDetails = async (id: string) => {
    await apiPackage.getDetailById(id).then((rs) => {
      console.log('detail', rs)
      setDetailService(rs.result)
    })
  }
  useEffect(() => {
    if (detailService && detailService.description && detailService.includes)
      handleFormatInfo(detailService.description, detailService.includes)
  }, [detailService])
  const handleFormatInfo = (des?: string, inc?: string) => {
    if (des) {
      setDescriptions(des.split('\n'))
    }
    if (inc) setIncludes(inc.split('\n'))
  }
  const handleAddToCart = async () => {
    await apiCart.getMyCart().then(async (rs) => {
      let item = { item_id: itemActive, quantity: 1 }
      await apiCart
        .getItemById(itemActive)
        .then(async (rs) => {
          if (rs.result) {
            item = { ...item, quantity: rs.result.item.quantity + 1 }
          }
        })
        .catch(() => {
          console.log('catch')
        })
      await apiCart
        .createOrUpdateItemCart({ item: item })
        .then((rs) => {
          console.log('rs add to cart', rs)
          toast.success(
            `Bạn đã thành công thêm gói dịch vụ #PACKAGE_${itemActive.slice(-5).toUpperCase()} vào giỏ hàng`
          )
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại')
        })
    })
  }

  return (
    <div className='post-options-service-container'>
      <div className='left-content-wapper'>
        <div className='list-options-post-service list-options-wapper'>
          <div className='title'>ĐĂNG TUYỂN</div>
          <div className='list-options'>
            {listServices &&
              listServices.map((item) => (
                <div key={item._id} onClick={() => setItemActive(item._id)}>
                  <ServiceItem
                    data={{ id: item._id, name: item.title, price: item.price }}
                    idActive={itemActive ? itemActive : listServices[0]._id}
                    hiddenBorder={item._id === listServices[listServices.length - 1]._id ? true : false}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className='list-options-suport-service list-options-wapper'>
          <div className='title'>QUẢNG CÁO</div>
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
      {!detailService ? (
        <>...</>
      ) : (
        <div className='right-content-wapper'>
          <div className='title-service'>
            <div className='name'>
              {detailService.title} - {detailService.number_of_days_to_expire} ngày - {detailService.code}
            </div>
            <div className='price'>{detailService.price.toLocaleString('vi', { currency: 'VND' })} VNĐ</div>
          </div>
          <div className='descriptions-wapper content-service-wapper'>
            <div className='title'>Mô tả dịch vụ:</div>
            <div className='descriptions'>
              {descriptions.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>
          <div className='descriptions-wapper content-service-wapper'>
            <div className='title'>Bao gồm:</div>
            <div className='descriptions'>
              {includes.map((item, index) => (
                <p key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <BsFillCheckCircleFill />
                  </span>
                  <span>{item}</span>
                </p>
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
            <Button onClick={handleAddToCart} className='btn-add-to-cart' size='large'>
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostServices
