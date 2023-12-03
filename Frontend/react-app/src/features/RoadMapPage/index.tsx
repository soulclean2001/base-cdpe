import './style.scss'
import bg from '~/assets/alena-aenami-cold-1k.jpg'
const RoadMapPage = () => {
  return (
    <div className='road-map-page-container' style={{ backgroundImage: `url(${bg})` }}>
      <h1>Sơ Đồ Trang Web (Road Map)</h1>
      <div className='content-wapper'>
        <div className='item'>
          <h4>NGƯỜI TÌM VIỆC</h4>
          <div className='title'>Tìm việc làm</div>
          <div className='title'>Tìm công ty</div>
          <div className='title'>Tạo/ cập nhật hồ sơ</div>
          <div className='title'>Bật tắt tìm việc</div>
          <div className='title'>Danh sách công ty đang theo dõi</div>
          <div className='title'>Danh sách việc làm đã ứng tuyển</div>
          <div className='title'>Nhắn tin</div>
          <div className='title'>Đăng nhập</div>
          <div className='title'>Đăng ký</div>
          <div className='title'>Quên mật khẩu</div>
        </div>
        <div className='item'>
          <h4>NHÀ TUYỂN DỤNG</h4>
          <div className='title'>Xem danh sách gói dịch vụ trang web</div>
          <div className='title'>Giỏ hàng</div>
          <div className='title'>Thống kê</div>
          <div className='title'>Quản lý tin tuyển dụng</div>
          <div className='title'>Cập nhật thông tin công ty</div>
          <div className='title'>Quản lý hồ sơ viên</div>
          <div className='title'>Tìm kiếm ứng viên</div>
          <div className='title'>Danh sách đơn hàng</div>
          <div className='title'>Dịch vụ đã mua</div>
          <div className='title'>Nhắn tin</div>
          <div className='title'>Đăng nhập</div>
          <div className='title'>Đăng ký</div>
          <div className='title'>Quên mật khẩu</div>
        </div>
      </div>
    </div>
  )
}

export default RoadMapPage
