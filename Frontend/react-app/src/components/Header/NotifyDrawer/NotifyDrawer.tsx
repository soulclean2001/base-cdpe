import { GrNotification } from 'react-icons/gr'
import './style.scss'
import { Drawer } from 'antd'
import { NavLink } from 'react-router-dom'
import NotifyItem from '../NotifyItem/NotifyItem'

interface DataType {
  id: string
  logo: string
  name: string
  actionInfo: string
}
interface PropsType {
  open: boolean
  onClose: any
  roleType: string
  dataNotify: Array<DataType>
}
const NotifyDrawer = (props: any) => {
  const { open, onClose, roleType, dataNotify }: PropsType = props

  return (
    <Drawer
      // closable={false}
      className='notify-drawer-container'
      title={
        <div className='title-container'>
          <span>
            <GrNotification />
          </span>
          <h2>Thông Báo</h2>
        </div>
      }
      placement='right'
      onClose={onClose}
      open={open}
    >
      <div className='content-wapper'>
        <div className='top-content'>
          {roleType === 'CANDIDATE' && (
            <>
              <span>Cập nhật hồ sơ để tìm thấy công việc phù hợp.</span>
              <NavLink to={'/CV'}>Cập nhật</NavLink>
            </>
          )}
          {roleType === 'EMPLOYER' && (
            <>
              <span>Tạo bài đăng để tìm những ứng viên phù hợp.</span>
              <NavLink to={'/employer/dashboard/post-manage'}>Quản lý bài đăng</NavLink>
            </>
          )}
        </div>
        {!dataNotify ? (
          <div className='list-item-notify'>Bạn không có thông báo</div>
        ) : (
          <div className='list-item-notify'>
            {dataNotify.map((data) => (
              <NotifyItem key={data.id} data={data} />
            ))}
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default NotifyDrawer
