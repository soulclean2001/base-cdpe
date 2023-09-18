import { Button, Input } from 'antd'
import './style.scss'
import { AiFillSetting } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import LeftItem from '../LeftItem'

const LeftContent = () => {
  return (
    <div className='left-content-page-chat-container'>
      <div className='header-container'>
        <div className='logo'>Tin nhắn</div>
        <Button shape='circle' className='btn-setting' icon={<AiFillSetting />} />
      </div>
      <div className='search-container'>
        <Input className='input-search' size='large' placeholder='Nhập tên, email...' prefix={<FiSearch />} />
      </div>
      <div className='list-chat-container'>
        <LeftItem />
      </div>
    </div>
  )
}

export default LeftContent
