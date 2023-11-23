import { GrNotification } from 'react-icons/gr'
import './style.scss'
import { Drawer } from 'antd'
import { NavLink } from 'react-router-dom'
import NotifyItem from '../NotifyItem/NotifyItem'
import { useEffect, useState } from 'react'
import apiNotify, { RequestNotify } from '~/api/notify.api'
import { NotifyState, getAllByMe, setMoreWhenScroll, setTotalUnRead } from './notifySlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { AuthState } from '~/features/Auth/authSlice'
// import InfiniteScroll from 'react-infinite-scroll-component'
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
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const { open, onClose, roleType }: PropsType = props
  const [isLoading, setIsLoading] = useState(false)

  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const disPath = useDispatch()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()

  const fetchMoreNotifications = async () => {
    console.log('FETCH MORE NOTIFICATIONS')

    const res = await apiNotify.getAllByMe({
      filter: {
        limit: '10',
        page: (notificaions.page + 1).toString()
      }
    })
    console.log('res', res)
    // setData(res.result)
    disPath(setMoreWhenScroll(res.result))
  }

  useEffect(() => {
    if (auth.isLogin && auth.verify !== 2 && auth.accessToken && auth.user_id) fetchGetDataNoti()
  }, [auth])

  const fetchGetDataNoti = async (page?: string) => {
    let request: RequestNotify = { filter: { page: page ? page : '1', limit: '10' } }
    await dispatchAsync(getAllByMe(request))
    await apiNotify.getTotalUnRead().then((rs) => {
      disPath(setTotalUnRead(rs.result))
    })
  }
  const handleScroll = async (e: any) => {
    const target = e.target
    // console.log(
    //   target.scrollTop,
    //   target.clientHeight,
    //   target.scrollTop + target.clientHeight,
    //   target.scrollHeight,
    //   target.scrollHeight - target.scrollHeight * 0.1
    // )
    if (isLoading) return
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - target.scrollHeight * 0.1 &&
      notificaions.notifications.length < notificaions.total
    ) {
      setIsLoading(true)
      setTimeout(async () => {
        await fetchMoreNotifications().then(() => {
          setIsLoading(false)
        })
      }, 1000)
    }
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
      <div id='content-wapper-drawer-notify'>
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
          <div className='list-item-notify' id='notify-scroll-id' onScroll={handleScroll}>
            {/* <InfiniteScroll
              dataLength={notificaions.notifications.length}
              next={fetchMoreNotifications}
              hasMore={notificaions.notifications.length < notificaions.total}
              loader={<h4>...</h4>}
              scrollableTarget='notify-scroll-id'
            > */}
            {notificaions.notifications.map((data, index) => (
              <NotifyItem
                key={index}
                data={{
                  id: data._id,
                  actionInfo: data.content,
                  createDate: data.created_at,
                  isRead: data.is_readed,
                  type: data.type,
                  logo: data.sender_info?.avatar,
                  idSender: data.sender_info?.sender,
                  nameSender: data.sender_info?.name,
                  idCompany: data.sender_info?.company_id,
                  jobTitle: data.jobTitle,
                  jobId: data.job_id,
                  candidate_id: data.candidate_id
                }}
              />
            ))}
            {/* </InfiniteScroll> */}
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default NotifyDrawer
