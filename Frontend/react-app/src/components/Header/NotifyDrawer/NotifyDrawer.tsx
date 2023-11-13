import { GrNotification } from 'react-icons/gr'
import './style.scss'
import { Drawer } from 'antd'
import { NavLink } from 'react-router-dom'
import NotifyItem from '../NotifyItem/NotifyItem'
import { useState, useEffect } from 'react'
import apiNotify, { RequestNotify } from '~/api/notify.api'
import { NotifyState, addNotify, getAllByMe, setNotifications } from './notifySlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
interface DataType {
  id: string
  logo?: string
  name?: string
  actionInfo?: string
  createDate?: string
  isRead?: boolean
  type?: string
}
interface PropsType {
  open: boolean
  onClose: any
  roleType: string
  dataNotify: Array<DataType>
}
interface AnyType {
  [key: string]: any
}
const NotifyDrawer = (props: any) => {
  const { open, onClose, roleType, dataNotify }: PropsType = props
  const [listNotify, setListNotify] = useState<DataType[]>([])
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const disPath = useDispatch()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  useEffect(() => {
    fetchGetDataNoti()
  }, [])
  useEffect(() => {
    console.log('notificaions.notifications', notificaions.notifications)
  }, [notificaions.notifications])
  const fetchGetDataNoti = async (page?: string) => {
    let request: RequestNotify = { filter: { page: page ? page : '1', limit: '1' } }
    await dispatchAsync(getAllByMe(request))
    // await apiNotify.getAllByMe(request).then((rs) => {
    //   console.log('list notify', rs)
    //   if (rs.result) {
    //     let tempt = rs.result.map((noti: AnyType) => {
    //       return {
    //         id: noti._id,
    //         actionInfo: noti.content,
    //         createDate: noti.created_at,
    //         isRead: noti.is_readed,
    //         type: noti.type
    //       }
    //     })
    //     setListNotify(tempt)
    //     disPath(setNotifications(rs.result))
    //   }
    // })
  }
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
          {roleType === 'CANDIDATE_ROLE' && (
            <>
              <span>Cập nhật hồ sơ để tìm thấy công việc phù hợp.</span>
              <NavLink to={'/CV'}>Cập nhật</NavLink>
            </>
          )}
          {roleType === 'EMPLOYER_ROLE' && (
            <>
              <span>Tạo bài đăng để tìm những ứng viên phù hợp.</span>
              <NavLink to={'/employer/dashboard/post-manage'}>Quản lý bài đăng</NavLink>
            </>
          )}
          {roleType === 'ADMIN_ROLE' && (
            <>
              <span>Xin chào Quản trị viên.</span>
              {/* <NavLink to={'/employer/dashboard/post-manage'}>Quản lý bài đăng</NavLink> */}
            </>
          )}
        </div>
        {!notificaions.notifications ? (
          <div className='list-item-notify'>Bạn không có thông báo</div>
        ) : (
          <div className='list-item-notify'>
            {notificaions.notifications.map((data) => (
              <NotifyItem
                key={data._id}
                data={{
                  id: data._id,
                  actionInfo: data.content,
                  createDate: data.created_at,
                  isRead: data.is_readed,
                  type: data.type
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default NotifyDrawer
