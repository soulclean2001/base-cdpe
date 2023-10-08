import { Link } from 'react-router-dom'
import './style.scss'

const PostDetail = () => {
  return (
    <div className='post-review-manage-container admin-users-manage-container'>
      <p style={{ fontSize: '14px' }}>
        <Link to='/admin/dashboard/post-review-manage'>Kiểm duyệt bài đăng</Link> / Bài đăng ID
      </p>

      <div className='title'>Chi tiết bài đăng ID</div>
      <div className='content-wapper'></div>
    </div>
  )
}

export default PostDetail
