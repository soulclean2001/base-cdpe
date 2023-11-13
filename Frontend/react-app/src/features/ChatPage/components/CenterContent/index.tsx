import { Avatar } from 'antd'
import { BiSend } from 'react-icons/bi'
import './style.scss'
import InputEmoji from 'react-input-emoji'
import { useState, useEffect } from 'react'
import ChatItem from '../ChatItem'
import apiClient from '~/api/client'
import { ApiResponse, ConversationType } from '~/types'
import { AuthState } from '~/features/Auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { setMessage, addMoreMessage } from '../../chatSlice'
import InfiniteScroll from 'react-infinite-scroll-component'
import logoTemp from '~/assets/logo_temp.jpg'
const CenterContent = () => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)

  const chat = useSelector((state: RootState) => state.chat)

  const data = chat.messages
  const currentRoom = chat.currentRoom

  const listUsersCompany =
    (currentRoom && currentRoom.company.users && currentRoom.company.users.map((user: any) => user.user_id)) || []
  const dispatch = useDispatch()

  const fetchConversations = async () => {
    const res: ApiResponse = await apiClient.get(`/conversations/${currentRoom._id}?limit=12&page=1`)
    // setData(res.result)
    dispatch(setMessage(res.result))
  }

  const fetchMoreConversations = async () => {
    const res: ApiResponse = await apiClient.get(`/conversations/${currentRoom._id}`, {
      params: {
        limit: data.limit,
        page: data.page + 1
      }
    })
    // setData(res.result)
    dispatch(addMoreMessage(res.result))
  }

  useEffect(() => {
    if (currentRoom) fetchConversations()
  }, [currentRoom])

  const [text, setText] = useState('')

  const handleOnEnter = async () => {
    await handleSendMessage()
  }

  const handleSendMessage = async () => {
    const res: ApiResponse = await apiClient.post(`/conversations/send-message`, {
      room_id: currentRoom._id,
      content: text
    })

    if (!res) return

    // const conversation = res.result

    // dispatch(addMessage(conversation))

    setText('')
  }

  if (!currentRoom || !data.conversations)
    return (
      <div
        className='center-chat-content-container'
        style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <h4 style={{ textAlign: 'center' }}>Chào mừng bạn đến với HFWork</h4>
      </div>
    )
  return (
    <div className='center-chat-content-container'>
      <div className='header-content'>
        <Avatar
          size={'large'}
          className='logo'
          src={
            data?.infor_receiver
              ? data.infor_receiver.logo
                ? data.infor_receiver.logo
                : data.infor_receiver.avatar
              : logoTemp || logoTemp
          }
        />
        <div className='name'>
          {data?.infor_receiver
            ? data.infor_receiver.name
              ? data.infor_receiver.name
              : data.infor_receiver.company_name
            : '' || ''}
        </div>
      </div>
      <div
        className='list-chat'
        id='scrollableDiv'
        style={{
          // height: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        <InfiniteScroll
          dataLength={data.conversations.length}
          next={fetchMoreConversations}
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={data.page < data.total}
          loader={<h4>...</h4>}
          scrollableTarget='scrollableDiv'
        >
          {data.conversations.map((item: ConversationType) => (
            <ChatItem key={item._id} data={item} users={listUsersCompany} role={auth.role} />
          ))}
        </InfiniteScroll>
      </div>
      <div className='action-chat-container'>
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder='Nhập nội dung tin nhắn'
        />
        {/* <input type='text' value={text} onChange={(e) => setText(e.target.value)} /> */}
        <span className='btn-send' onClick={handleSendMessage}>
          <BiSend />
        </span>
      </div>
    </div>
  )
}

export default CenterContent
