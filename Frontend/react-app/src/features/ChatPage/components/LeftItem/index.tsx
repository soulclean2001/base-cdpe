import { Avatar, Button } from 'antd'
import './style.scss'
import { FiMoreHorizontal } from 'react-icons/fi'

const LeftItem = () => {
  return (
    <div className='left-chat-item-container'>
      <div className='left-wapper'>
        <Avatar src='' />
        <div className='info-chat-container'>
          <div className='name'>Tên</div>
          <div className='latest-message'>Tin nhắn gần đâyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</div>
        </div>
      </div>
      <div className='right-wapper'>
        <div className='latest-time'>10 phút</div>
        <div className='btn-container'>
          <Button shape='circle' className='btn-more-option' icon={<FiMoreHorizontal />} />
        </div>
      </div>
    </div>
  )
}

export default LeftItem
