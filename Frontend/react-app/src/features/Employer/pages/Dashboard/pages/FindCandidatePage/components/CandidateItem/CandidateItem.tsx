import { Avatar, Button } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'

const CandidateItem = (props: any) => {
  const { avatar, nameCandidate, jobTitle, yearOld, education, expYear, province, updateData } = props
  return (
    <div className='candidate-item-container'>
      <div className='left-container'>
        <div className='avatar-container'>
          <Avatar size={'large'} src={avatar} className='avatar-candidate'></Avatar>
        </div>
        <div className='info-containerr'>
          <div className='name'>{nameCandidate ? nameCandidate : 'Tên ứng viên'}</div>
          <div className='job-title'>{jobTitle ? jobTitle : 'Vị trí công việc hiện tại'}</div>
          <div className='exp-year'>{`Năm kinh nghiệm: ${expYear}`}</div>
          <div className='year-old'>{`Tuổi: ${yearOld}`}</div>
          <div className='education'>{`Trình độ học vấn: ${education}`}</div>
          <div className='province'>{`Khu vực sinh sống: ${province}`}</div>
        </div>
      </div>

      <div className='right-container'>
        <div className='update-date'>{`Cập nhật: ${updateData}`}</div>

        <Button size='large' className='btn-show-detail-info'>
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
