import { Avatar } from 'antd'
import './style.scss'
import { format, parseISO } from 'date-fns'
import apiNotify from '~/api/notify.api'
import { useDispatch } from 'react-redux'
import { setIsRead } from '../NotifyDrawer/notifySlice'

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
  data: DataType
}
const NotifyItem = (props: any) => {
  const { data }: PropsType = props
  const disPath = useDispatch()
  const handleReadingNotify = async (id: string) => {
    await apiNotify.seeNotify(id).then(() => {
      disPath(setIsRead(id))
    })
  }
  if (!data) return <div>...</div>
  return (
    <div onClick={() => handleReadingNotify(data.id)} className='notify-item-container'>
      <Avatar className='logo' src={data.logo ? data.logo : ''} shape='circle' />
      <div className='info-notify'>
        <span className='name-company'>{data.name ? data.name : ''}</span>
        <span className={data.isRead ? 'action-info' : 'action-info info-not-read'}>
          {data.actionInfo ? data.actionInfo : 'action notify'}
        </span>
        <span className={data.isRead ? 'create-time' : 'create-time time-not-read'}>
          {data.createDate ? format(parseISO(data.createDate), 'dd-MM-yyyy HH:mm:ss') : 'time'}
        </span>
      </div>
      <span className={data.isRead ? 'is-read' : 'is-read not-read'}> </span>
    </div>
  )
}

export default NotifyItem
