import { Avatar } from 'antd'
import './style.scss'
import { ConversationType, UserRole } from '~/types'
interface DataType {
  id: string
  userId: string
  logo: string
  chatValue: string
}
interface PropsType {
  data: ConversationType
  isMe: boolean
  users: string[]
  role: UserRole
}
const ChatItem = (props: any) => {
  const { data, users, role }: PropsType = props
  let isLeft = false
  if (users) {
    if (role === UserRole.Employer) {
      if (users.includes(data.sender_id)) isLeft = false
      else isLeft = true
    } else {
      if (users.includes(data.sender_id)) isLeft = true
      else isLeft = false
    }
  }

  if (!data) return <>chưa có chat</>

  return (
    <div
      // className={data.userId === 'my' ? 'my-chat-item-container' : 'them-chat-item-container'}
      className={isLeft ? 'them-chat-item-container' : 'my-chat-item-container'}
    >
      {/* <Avatar size={'default'} className='logo ' src={data.logo ? data.logo : ''} /> */}
      <div className='chat-value '>
        <span>{data.content}</span>
      </div>
    </div>
  )
}

export default ChatItem
