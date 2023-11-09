import { Modal } from 'antd'
import './style.scss'
import { useState, useEffect } from 'react'
import apiAdmin from '~/api/admin.api'
import apiCompany from '~/api/company.api'
import apiOrder from '~/api/order.api'
import { StatusOrder } from '~/types/order.type'
interface AnyType {
  [key: string]: any
}
interface DetailOrderType {
  _id: string
  order: any
  packages: AnyType[]
  service_orders: AnyType[]
}

const ModalDetailOrder = (props: any) => {
  const { idOrder, isModalOpen, handleCloseModal, roleType } = props
  const [detailData, setDetailData] = useState<DetailOrderType>()
  const [listServices, setListServices] = useState<AnyType[]>([])
  const [detailCompany, setDetailCompany] = useState<AnyType>()
  const [totalPayment, setTotalPayment] = useState(0)
  useEffect(() => {
    if (isModalOpen) fetchData()
  }, [isModalOpen])
  const fetchData = async () => {
    if (roleType === 'ADMIN_TYPE') {
      await apiAdmin.getDetailOrderById(idOrder).then(async (rs) => {
        console.log('rs detai', rs)
        setDetailData(rs.result)
        await apiCompany.getDetailCompany(rs.result.order.company_id).then((rs) => {
          console.log('detail copmpany', rs)
          setDetailCompany(rs.result)
        })
        const listTemp: AnyType[] = []
        let totalTemp = 0
        rs.result.service_orders.map((service: AnyType) => {
          rs.result.packages.map((pkg: AnyType) => {
            if (pkg._id === service.package_id) {
              totalTemp += pkg.price * service.quantity
              listTemp.push({
                name: `#SV_${pkg._id.slice(-5).toUpperCase()} - ${pkg.title} ${pkg.number_of_days_to_expire} ngày`,
                price: pkg.price,
                quantity: service.quantity
              })
            }
          })
        })
        setTotalPayment(totalTemp)
        console.log('listTemp', listTemp)
        setListServices(listTemp)
      })
    } else {
      await apiOrder.getDetailOrder(idOrder).then(async (rs) => {
        console.log('rs detai', rs)
        setDetailData(rs.result)
        await apiCompany.getDetailCompany(rs.result.order.company_id).then((rs) => {
          console.log('detail copmpany', rs)
          setDetailCompany(rs.result)
        })
        const listTemp: AnyType[] = []
        let totalTemp = 0
        rs.result.service_orders.map((service: AnyType) => {
          rs.result.packages.map((pkg: AnyType) => {
            if (pkg._id === service.package_id) {
              totalTemp += pkg.price * service.quantity
              listTemp.push({
                name: `#SV_${pkg._id.slice(-5).toUpperCase()} - ${pkg.title} ${pkg.number_of_days_to_expire} ngày`,
                price: pkg.price,
                quantity: service.quantity
              })
            }
          })
        })
        setTotalPayment(totalTemp)
        console.log('listTemp', listTemp)
        setListServices(listTemp)
      })
    }
  }
  if (!detailData || !detailCompany) return <></>
  return (
    <Modal
      width={700}
      className='modal-detail-order'
      title={<h2 style={{ borderBottom: '1px solid gray', paddingBottom: '15px' }}>Chi tiết đơn hàng {idOrder}</h2>}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer=''
    >
      <div className='content-modal-detail-container'>
        <div className='order-id'>Mã đơn hàng: {idOrder}</div>
        <div className='info-company-wapper'>
          <div className='title'>Thông tin khách hàng</div>
          <div className='name'>Tên: {detailCompany.company_name}</div>
          <div className='name'>
            Địa chỉ:{' '}
            {detailCompany.working_locations.map((loc: any, index: number) => (
              <div key={index} style={{ paddingLeft: '20px' }}>
                {loc.address}, {loc.district}, {loc.city_name}{' '}
              </div>
            ))}
          </div>
        </div>

        <div className='info-order-wapper'>
          <div className='title-service'>Danh sách dịch vụ</div>
          <div className='list-services'>
            <div className='service-item header'>
              <div className='name-service'>Dịch vụ</div>
              <div className='price'>Giá</div>
              <div className='quantity'>Sô lượng</div>
              <div className='total '>Thành tiền</div>
            </div>
            {listServices &&
              listServices.map((service, index) => (
                <div className='service-item' key={index}>
                  <div className='name-service'>{service.name}</div>
                  <div className='price'>{service.price.toLocaleString('vi', { currency: 'VND' })} đ</div>
                  <div className='quantity'>x {service.quantity}</div>
                  <div className='total '>
                    {(service.quantity * service.price).toLocaleString('vi', { currency: 'VND' })} đ
                  </div>
                </div>
              ))}
          </div>
          <div className='order-detail-info'>
            <div className='left-content'>
              <div className='title'>Chi tiết đơn hàng: </div>
              <div className='order-date'>Ngày đặt hàng: {detailData.order.created_at.slice(0, 10)}</div>
              <div className='update-date'>Cập nhật gần đây: {detailData.order.updated_at.slice(0, 10)}</div>
              <div className='update-date'>
                Trạng thái đơn hàng: {Object.values(StatusOrder)[Number(detailData.order.status)]}
              </div>
            </div>
            <div className='right-content'>
              <div className='item'>
                <div className='label'>Tổng tiền(Chưa VAT)</div>
                <div className='value'>{totalPayment.toLocaleString('vi', { currency: 'VND' })} VND</div>
              </div>
              <div className='item'>
                <div className='label'>Tổng tiền(Đã bao gồm VAT)</div>
                <div className='value'>
                  {(totalPayment * 0.1 + totalPayment).toLocaleString('vi', { currency: 'VND' })} VNĐ
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-modal-container'>
          <span>Thành tiền: {(totalPayment * 0.1 + totalPayment).toLocaleString('vi', { currency: 'VND' })} VNĐ</span>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDetailOrder
