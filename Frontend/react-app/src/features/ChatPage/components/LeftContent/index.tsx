import { Button, Input } from 'antd'
import './style.scss'
import { AiFillSetting } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import LeftItem from '../LeftItem'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const dataItemChat = [
  { id: '1', logo: '', name: 'AA', latestChat: 'abc', latestTime: '9 phút' },
  { id: '2', logo: '', name: 'BB', latestChat: 'XZB', latestTime: '10 phút' }
]
const LeftContent = (props: any) => {
  const { handleSetIdChatRoom, roleType } = props
  const navigate = useNavigate()
  const [idActive, setIdActive] = useState('')
  const handleBackHome = () => {
    console.log('roleType', roleType)
    if (roleType === 'ADMIN_TYPE') navigate('/admin')
    if (roleType === 'CANDIDATE_TYPE') navigate('/')
    if (roleType === 'EMPLOYER_TYPE') navigate('/employer')
  }
  useEffect(() => {
    if (idActive) handleSetIdChatRoom(idActive)
  }, [idActive])
  const handleActiveItem = (id: string) => {
    console.log('active chat id', id)
    setIdActive(id)
  }
  return (
    <div className='left-content-page-chat-container'>
      <div className='header-container'>
        <div className='logo' onClick={handleBackHome}>
          HFWorks
        </div>
        <Button shape='circle' className='btn-setting' icon={<AiFillSetting />} />
      </div>
      <div className='search-container'>
        <Input className='input-search' size='large' placeholder='Nhập tên, email...' prefix={<FiSearch />} />
      </div>
      <div className='list-chat-container'>
        {dataItemChat.map((item) => (
          <div key={item.id} onClick={() => handleActiveItem(item.id)}>
            <LeftItem data={item} isActive={idActive === item.id ? true : false} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftContent
