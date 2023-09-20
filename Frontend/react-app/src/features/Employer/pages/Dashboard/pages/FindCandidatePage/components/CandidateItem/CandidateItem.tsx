import { Avatar, Button } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
interface DataType {
  id: string
  avatar: string
  nameCandidate: string
  jobTitle: string
  educationLevel: string
  expYear: string
  provinceWanted: string
  updateDate: string
}
interface PropsType {
  data: DataType
}
const CandidateItem = (props: any) => {
  const navigate = useNavigate()
  const { data }: PropsType = props
  const handleClickShowDetail = () => {
    const convertNameEng = data.nameCandidate
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/employer/dashboard/candidate-detail/${convertName}-id-${data.id}`)
  }
  if (!data) return <div>Không có dữ liệu ứng viên</div>
  return (
    <div className='candidate-item-container'>
      <div className='left-container'>
        <div className='avatar-container'>
          <Avatar size={'large'} src={data.avatar ? data.avatar : ''} className='avatar-candidate'></Avatar>
        </div>
        <div className='info-containerr'>
          <div className='name'>{data.nameCandidate ? data.nameCandidate : 'Tên ứng viên'}</div>
          <div className='job-title'>{data.jobTitle ? data.jobTitle : 'Vị trí công việc mong muốn'}</div>
          <div className='exp-year'>{`Năm kinh nghiệm: ${data.expYear}`}</div>
          {/* <div className='year-old'>{`Tuổi: ${yearOld}`}</div> */}
          <div className='education'>{`Trình độ học vấn: ${data.educationLevel}`}</div>
          <div className='province'>{`Khu vực mong muốn: ${data.provinceWanted}`}</div>
        </div>
      </div>

      <div className='right-container'>
        <div className='update-date'>{`Cập nhật: ${data.updateDate}`}</div>

        <Button onClick={handleClickShowDetail} size='large' className='btn-show-detail-info'>
          Hồ sơ chi tiết
        </Button>

        <span className='btn-follow-candidate icon'>
          <AiFillFlag />
        </span>
      </div>
    </div>
  )
}

export default CandidateItem
