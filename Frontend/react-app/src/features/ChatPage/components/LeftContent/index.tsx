import { Button, Input } from 'antd'
import './style.scss'
import { AiFillSetting } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import LeftItem from '../LeftItem'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApiResponse, RoomType, UserRole } from '~/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { setCurrentRoom, setRooms } from '../../chatSlice'
import { AuthState } from '~/features/Auth/authSlice'
import apiClient from '~/api/client'
import { socket } from '~/App'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'

const LeftContent = (props: any) => {
  const chat = useSelector((state: RootState) => state.chat)
  const dispatch = useDispatch()
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const { roleType } = props
  const [listRooms, setListRooms] = useState<RoomType[]>([])
  const navigate = useNavigate()
  const [idActive, setIdActive] = useState('')
  const handleBackHome = () => {
    console.log('roleType', roleType)
    if (roleType === 'ADMIN_TYPE') navigate('/admin')
    if (roleType === 'CANDIDATE_TYPE') navigate('/')
    if (roleType === 'EMPLOYER_TYPE') navigate('/employer')
  }

  const handleSetCurrentRoom = (room: any) => {
    dispatch(setCurrentRoom(room))
    handleActiveItem(room._id)
  }
  useEffect(() => {
    if (chat.currentRoom) setIdActive(chat.currentRoom._id)
  }, [chat.currentRoom])
  const handleActiveItem = (id: string) => {
    console.log('active chat id', id)
    setIdActive(id)
  }

  useEffect(() => {
    setListRooms(chat.rooms)
  }, [chat.rooms])
  useEffect(() => {
    if (notificaions.page > 0) fetchListRooms()
  }, [notificaions.total])
  const fetchListRooms = async () => {
    let rooms: RoomType[] = []
    if (auth.role === UserRole.Employer) {
      const listRooms: ApiResponse = await apiClient.get('/conversations/rooms/company')
      dispatch(setRooms(listRooms.result))
      rooms = listRooms.result
    }

    if (auth.role === UserRole.Candidate) {
      const listRooms: ApiResponse = await apiClient.get('/conversations/rooms/user')
      dispatch(setRooms(listRooms.result))
      rooms = listRooms.result
    }

    const roomIds = rooms.map((room) => room._id)
    socket.emit('join-conversations', roomIds)
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
        {listRooms.length > 0 &&
          listRooms.map((item) => (
            <div key={item._id} onClick={() => handleSetCurrentRoom(item)}>
              <LeftItem roleType={roleType} data={item} isActive={idActive === item._id ? true : false} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default LeftContent
