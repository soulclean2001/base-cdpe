import { useEffect, useState } from 'react'
import ServiceItem from '../../components/ServiceItem'
import './style.scss'
import { Button } from 'antd'
import apiPackage from '~/api/package.api'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import apiCart from '~/api/cart.api'
import ReactHtmlParser from 'html-react-parser'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { EmployerState, plusTotalItemCart } from '~/features/Employer/employerSlice'
import { RootState } from '~/app/store'

interface PackageType {
  [key: string]: any
}
const PostServices = () => {
  const disPath = useDispatch()
  const [itemActive, setItemActive] = useState('')
  const [descriptions, setDescriptions] = useState([''])
  const [includes, setIncludes] = useState([''])
  const [listServicesPost, setListServicesPost] = useState<PackageType[]>([])
  const [listServicesBanner, setListServicesBanner] = useState<PackageType[]>([])
  const [detailService, setDetailService] = useState<PackageType>()
  const employer: EmployerState = useSelector((state: RootState) => state.employer)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    await apiPackage.getAllPackageForEmployClient({ limit: '1000', page: '1', title: '', type: 'POST' }).then((rs) => {
      console.log('rs', rs.result.pks)
      if (rs.result.pks) {
        setListServicesPost(rs.result.pks)
        if (rs.result.pks[0]) setItemActive(rs.result.pks[0]._id)
      }
    })
    await apiPackage
      .getAllPackageForEmployClient({ limit: '1000', page: '1', title: '', type: 'BANNER' })
      .then((rs) => {
        console.log('rs', rs.result.pks)
        if (rs.result.pks) {
          setListServicesBanner(rs.result.pks)
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
    if (!employer.cart.idCart) return
    let item = { item_id: itemActive, quantity: 1 }
    await apiCart
      .getItemById(itemActive)
      .then(async (rs) => {
        if (rs.result) {
          item = { ...item, quantity: rs.result.item.quantity + 1 }
        }
      })
      .catch(() => {
        disPath(plusTotalItemCart())
      })
    await apiCart
      .createOrUpdateItemCart({ item: item })
      .then((rs) => {
        console.log('rs add to cart', rs)
        if (item.quantity > 1)
          toast.success(
            `#SV_${itemActive
              .slice(-5)
              .toUpperCase()} đã có sẵn trong giỏ hàng, số lượng trong giỏ hàng đã được cập nhật thành công`
          )
        else toast.success(`Bạn đã thành công thêm gói dịch vụ #SV_${itemActive.slice(-5).toUpperCase()} vào giỏ hàng`)
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      })
  }

  return (
    <div className='post-options-service-container'>
      <div className='left-content-wapper'>
        <div className='list-options-post-service list-options-wapper'>
          <div className='title'>ĐĂNG TUYỂN</div>
          <div className='list-options'>
            {listServicesPost &&
              listServicesPost.map((item) => (
                <div key={item._id} onClick={() => setItemActive(item._id)}>
                  <ServiceItem
                    data={{ id: item._id, name: item.title, price: item.price }}
                    idActive={itemActive ? itemActive : listServicesPost[0]._id}
                    hiddenBorder={item._id === listServicesPost[listServicesPost.length - 1]._id ? true : false}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className='list-options-suport-service list-options-wapper'>
          <div className='title'>QUẢNG CÁO</div>
          <div className='list-options'>
            {listServicesBanner &&
              listServicesBanner.map((item) => (
                <div key={item._id} onClick={() => setItemActive(item._id)}>
                  <ServiceItem
                    data={{ id: item._id, name: item.title, price: item.price }}
                    idActive={itemActive}
                    hiddenBorder={item._id === listServicesBanner[listServicesBanner.length - 1]._id ? true : false}
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
              {detailService.title} -{' '}
              {detailService.type === 'BANNER'
                ? `${detailService.number_of_days_to_expire} ngày`
                : `${detailService.value} bài đăng`}{' '}
            </div>
            <div className='price'>{detailService.price.toLocaleString('vi', { currency: 'VND' })} VNĐ</div>
          </div>
          <div className='descriptions-wapper content-service-wapper'>
            <div className='title'>Mô tả dịch vụ:</div>

            {/* <div className='descriptions'>
              {descriptions.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div> */}
            <div className='preview__info' style={{ color: '#333333', maxWidth: '100%', wordBreak: 'break-word' }}>
              {detailService.description ? ReactHtmlParser(detailService.description) : ''}
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
              {detailService.preview &&
                detailService.preview.map((url: string, index: number) => (
                  <div style={{ maxWidth: '25%' }} key={index}>
                    <img src={url} />
                  </div>
                ))}
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
