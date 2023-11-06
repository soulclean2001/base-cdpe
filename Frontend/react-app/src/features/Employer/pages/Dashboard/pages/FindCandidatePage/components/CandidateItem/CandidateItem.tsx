import { Avatar, Button } from 'antd'
import './style.scss'
import { AiFillFlag, AiOutlineFlag } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import avatarTemp from '~/assets/logo_temp.jpg'
export interface DataTypeCandidateItem {
  id: string
  cv_id?: string
  avatar?: string
  nameCandidate: string
  jobTitle?: string
  educationLevel?: string
  expYear?: number
  provinceWanted?: string[]
  updateDate?: string
  isFollowed?: boolean
}
interface PropsType {
  data: DataTypeCandidateItem
  hideFollow: boolean
}
const CandidateItem = (props: any) => {
  const navigate = useNavigate()
  const { data, hideFollow }: PropsType = props
  const handleClickShowDetail = () => {
    const convertNameEng = data.nameCandidate
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()
    if (!hideFollow) navigate(`/employer/dashboard/find-candidate/${convertName}-id-${data.id}`)
    else navigate(`/employer/dashboard/cv-manage/tracked-candidate/${convertName}-id-${data.id}`)
  }
  if (!data) return <div>Không có dữ liệu ứng viên</div>
  return (
    <div className='candidate-item-container'>
      <div className='left-container'>
        <div className='avatar-container'>
          <Avatar
            size={'large'}
            src={data.avatar && data.avatar !== '_' ? data.avatar : avatarTemp}
            className='avatar-candidate'
          ></Avatar>
        </div>
        <div className='info-containerr'>
          <div className='name'>{data.nameCandidate ? data.nameCandidate : 'Tên ứng viên'}</div>
          <div className='job-title'>{data.jobTitle ? data.jobTitle : 'Vị trí công việc mong muốn'}</div>
          <div className='exp-year'>
            {`Kinh nghiệm: ${
              data.expYear === 10 ? 'Trên 10 năm' : data.expYear === 0 ? 'Dưới 1 năm' : `${data.expYear} năm`
            }`}
          </div>
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

        <span hidden={hideFollow} className='btn-follow-candidate icon'>
          {data.isFollowed ? <AiFillFlag /> : <AiOutlineFlag />}
        </span>
      </div>
    </div>
  )
}

export default CandidateItem
