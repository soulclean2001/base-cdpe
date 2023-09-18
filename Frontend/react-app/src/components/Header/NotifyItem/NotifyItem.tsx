import { Avatar } from 'antd'
import './style.scss'
interface DataType {
  id: string
  logo: string
  name: string
  actionInfo: string
}
interface PropsType {
  data: DataType
}
const NotifyItem = (props: any) => {
  const { data }: PropsType = props
  if (!data) return <div>Bạn không có thông báo nào</div>
  return (
    <div className='notify-item-container'>
      <Avatar className='logo' src={data.logo ? data.logo : ''} shape='square' />
      <div className='info-notify'>
        <span className='name-company'>{data.name ? data.name : 'Name company'}</span>
        <span className='action-info'>{data.actionInfo ? data.actionInfo : 'action notify'}</span>
      </div>
    </div>
  )
}

export default NotifyItem
