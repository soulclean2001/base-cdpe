import { Avatar, Button } from 'antd'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import { setCurrentRoom } from '../../chatSlice'
interface DataType {
  id: string
  idUser: string
  idJob: string | undefined
  idCompany: string | undefined
  logo: string
  titleName: string
  nameCompany: string | undefined
  titleJob: string
}
interface PropsType {
  data: DataType
  infoRoom: {
    userId: string
    companyId: string
  }
}
const RightItem = (props: any) => {
  const { data, infoRoom }: PropsType = props
  const chat = useSelector((state: RootState) => state.chat)
  const rooms = chat.rooms || []
  const dispatch = useDispatch()

  const handleChangeRoom = ({ userId, companyId }: { userId: string; companyId: string }) => {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].user._id === userId && rooms[i].company._id === companyId) {
        dispatch(setCurrentRoom(rooms[i]))
      }
    }
  }

  if (!data) return <div>Chưa ứng tuyển công việc</div>
  return (
    <div className='right-item-chat-page-container'>
      <div className='left-wapper'>
        <Avatar className='logo' size={'large'} src={data.logo ? data.logo : ''} />
        <div className='info-item-wapper'>
          <div className='name-job'>{data.titleName ? data.titleName : 'titleName'}</div>
          <div className='name-company'>{data.nameCompany ? data.nameCompany : data.titleJob}</div>
        </div>
      </div>
      <div className='btn-container'>
        <Button
          className='btn-chat'
          onClick={() => {
            handleChangeRoom(infoRoom)
          }}
        >
          Nhắn tin
        </Button>
      </div>
    </div>
  )
}

export default RightItem
