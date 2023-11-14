import { GrNotification } from 'react-icons/gr'
import './style.scss'
import { Drawer } from 'antd'
import { NavLink } from 'react-router-dom'
import NotifyItem from '../NotifyItem/NotifyItem'
import { useEffect } from 'react'
import apiNotify, { RequestNotify } from '~/api/notify.api'
import { NotifyState, getAllByMe, setMoreWhenScroll, setTotalUnRead } from './notifySlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import InfiniteScroll from 'react-infinite-scroll-component'
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

const NotifyDrawer = (props: any) => {
  const { open, onClose, roleType }: PropsType = props

  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const disPath = useDispatch()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const fetchMoreConversations = async () => {
    const res = await apiNotify.getAllByMe({
      filter: {
        limit: '1',
        page: (notificaions.page + 1).toString()
      }
    })
    // setData(res.result)
    disPath(setMoreWhenScroll(res.result))
  }

  useEffect(() => {
    fetchGetDataNoti()
  }, [])

  const fetchGetDataNoti = async (page?: string) => {
    let request: RequestNotify = { filter: { page: page ? page : '1', limit: '1000' } }
    await dispatchAsync(getAllByMe(request))
    await apiNotify.getTotalUnRead().then((rs) => {
      disPath(setTotalUnRead(rs.result))
    })
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
            <InfiniteScroll
              dataLength={notificaions.notifications.length}
              next={fetchMoreConversations}
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              inverse={true} //
              hasMore={notificaions.page < notificaions.notifications.length / notificaions.page}
              loader={<h4>...</h4>}
              scrollableTarget='scrollableDiv'
            >
              {notificaions.notifications.map((data, index) => (
                <NotifyItem
                  key={index}
                  data={{
                    id: data._id,
                    actionInfo: data.content,
                    createDate: data.created_at,
                    isRead: data.is_readed,
                    type: data.type,
                    logo: data.sender_info?.avatar
                  }}
                />
              ))}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default NotifyDrawer
