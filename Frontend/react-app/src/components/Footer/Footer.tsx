import { Col, Row } from 'antd'
import './footer.scss'
import { NavLink } from 'react-router-dom'
import iosImg from '~/assets/iosIMG.png'
import chPlay from '~/assets/chPlayImg.png'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
const Footer = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  return (
    <div className='footer-container'>
      <>
        <Row className='footer-content'>
          <Col md={5} style={{ padding: '7px' }}>
            <div className='footer-title'>HFWork</div>
            <div>
              <NavLink to={''}>Về HFWork</NavLink>
            </div>
            <div>
              <NavLink to={''}>Liên hệ</NavLink>
            </div>
            <div>
              <NavLink to={''}>Hỏi đáp</NavLink>
            </div>
            <div>
              <NavLink to={''}>Thỏa thuận sử dụng</NavLink>
            </div>
            <div>
              <NavLink to={''}>Quy định bảo mật</NavLink>
            </div>
            <div>
              <NavLink to={''}>Quy chế hoạt động của HFWork</NavLink>
            </div>
            <div>
              <NavLink to={auth.role === 1 ? '/employer/road-map' : 'road-map'}>Sơ đồ website</NavLink>
            </div>
          </Col>
          <Col md={5} style={{ padding: '7px' }}>
            <div className='footer-title'>Dành cho Nhà tuyển dụng</div>
            <div>
              <NavLink to={''}>Đăng tin tuyển dụng</NavLink>
            </div>
            <div>
              <NavLink to={''}>Tìm kiếm Hồ sơ</NavLink>
            </div>
            <div>
              <NavLink to={''}>Liên hệ</NavLink>
            </div>
          </Col>
          <Col md={5} style={{ padding: '7px' }}>
            <div>
              <div className='footer-title'>Việc làm theo khu vực</div>
              <div>
                <NavLink to={''}>Hồ Chí Minh</NavLink>
              </div>
              <div>
                <NavLink to={''}>Hà Nội</NavLink>
              </div>
              <div>
                <NavLink to={''}>Hải Phòng</NavLink>
              </div>
              <div>
                <NavLink to={''}>Đà Nẳng</NavLink>
              </div>
              <div>
                <NavLink to={''}>Bình Dương</NavLink>
              </div>
            </div>

            <div>
              <NavLink to=''>Tìm việc làm</NavLink>
            </div>
          </Col>
          <Col md={5} style={{ padding: '7px' }}>
            <div>
              <div className='footer-title'>Việc làm theo ngành nghề</div>
              <div>
                <NavLink to={''}>Kế toán</NavLink>
              </div>
              <div>
                <NavLink to={''}>Ngân hàng</NavLink>
              </div>
              <div>
                <NavLink to={''}>IT - Phần mềm</NavLink>
              </div>
              <div>
                <NavLink to={''}>IT-Phần cứng/Mạng</NavLink>
              </div>
              <div>
                <NavLink to={''}>Xây dựng</NavLink>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className='footer-title'>Ứng dụng di động</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px', alignItems: 'center' }}>
              <img style={{ cursor: 'pointer', width: '48%', maxWidth: '110px' }} src={iosImg} alt='' />

              <img style={{ cursor: 'pointer', width: '48%', maxWidth: '110px' }} src={chPlay} alt='' />
            </div>
          </Col>
        </Row>
      </>
      <div className='footer-address'>
        <span>
          Copyright © Công Ty Cổ Phần HFWorks, 12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam
        </span>
      </div>
      {/* <Row className='footer-bottom-container' justify={'center'} align={'middle'}>
        <Col md={4} className='footer-name-web'>
          HFWork
        </Col>
        <Col md={20}>
          <Row className='bottom-diagram' justify={'end'}>
            <Col md={4}>Thỏa thuận sử dụng</Col>
            <Col md={4}>Quy định bảo mật</Col>
            <Col md={4}>Sơ đồ trang Web</Col>
          </Row>
        </Col>
      </Row> */}
    </div>
  )
}

export default Footer
