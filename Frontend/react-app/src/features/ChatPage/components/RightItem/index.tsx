import { Avatar, Button } from 'antd'
import './style.scss'
interface DataType {
  idUser: string
  idJob: string | undefined
  idCompany: string | undefined
  logo: string
  titleName: string
  nameCompany: string | undefined
}
interface PropsType {
  data: DataType
}
const RightItem = (props: any) => {
  const { data }: PropsType = props
  if (!data) return <div>Chưa ứng tuyển công việc</div>
  return (
    <div className='right-item-chat-page-container'>
      <div className='left-wapper'>
        <Avatar className='logo' size={'large'} src={data.logo ? data.logo : ''} />
        <div className='info-item-wapper'>
          <div className='name-job'>{data.titleName ? data.titleName : 'titleName'}</div>
          <div className='name-company'>{data.nameCompany ? data.nameCompany : ''}</div>
        </div>
      </div>
      <div className='btn-container'>
        <Button className='btn-chat'>Nhắn tin</Button>
      </div>
    </div>
  )
}

export default RightItem
