import { Avatar } from 'antd'
import './style.scss'
interface DataType {
  id: string
  userId: string
  logo: string
  chatValue: string
}
interface PropsType {
  data: DataType
}
const ChatItem = (props: any) => {
  const { data }: PropsType = props
  if (!data) return <>chưa có chat</>
  return (
    <div className={data.userId === 'my' ? 'my-chat-item-container' : 'them-chat-item-container'}>
      <Avatar size={'default'} className='logo ' src={data.logo ? data.logo : ''} />
      <div className='chat-value '>
        <span>{data.chatValue}</span>
      </div>
    </div>
  )
}

export default ChatItem
