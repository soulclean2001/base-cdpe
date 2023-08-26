import { Col, Row } from 'antd'
import './footer.scss'
import { NavLink } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='footer-container'>
      <>
        <Row className='footer-content'>
          <Col md={5}>
            <div className='title'>HFWork</div>
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
          </Col>
          <Col md={5}>
            <div className='title'>Dành cho Nhà tuyển dụng</div>
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
          <Col md={5}>
            <div>
              <div className='title'>Việc làm theo khu vực</div>
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
          <Col md={5}>
            <div>
              <div className='title'>Việc làm theo ngành nghề</div>
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
            <div>
              <NavLink to=''>Tìm việc làm</NavLink>
            </div>
          </Col>
          <Col md={4}>
            <div className='title'>Ứng dụng di động</div>
          </Col>
        </Row>
      </>
      <div className='footer-address'>
        <span>
          Copyright © Công Ty Cổ Phần Navigos Group Việt Nam Tầng 20, tòa nhà E.Town Central, 11 Đoàn Văn Bơ, Phường
          13, Quận 4, TP.HCM, Việt Nam
        </span>
      </div>
      <Row className='footer-bottom-container' justify={'center'} align={'middle'}>
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
      </Row>
    </div>
  )
}

export default Footer
