import { useNavigate } from 'react-router-dom'
import './rightMenu.scss'
import RightMenuPhone from '../RightMenuPhone/RightMenuPhone'

const RightMenu = () => {
  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/candidate-login')
  }
  const handleSignUp = () => {
    navigate('/candidate-sign-up')
  }
  const handleTabEmployer = () => {
    navigate('/employer')
  }
  return (
    <div className='right_menu_container'>
      <div className='right_menu_container_pc'>
        <button className='btn btn-login' onClick={() => handleLogin()}>
          Đăng nhập
        </button>
        <button className='btn btn-sign-up' onClick={handleSignUp}>
          Đăng ký
        </button>
        <button className='btn btn-tab-employer' onClick={handleTabEmployer}>
          Đăng tuyển & Tìm hồ sơ
        </button>
      </div>
      <>
        <RightMenuPhone />
      </>
    </div>
  )
}
export default RightMenu
