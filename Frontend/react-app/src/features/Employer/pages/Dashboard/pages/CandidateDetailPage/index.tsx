import { Link, useParams } from 'react-router-dom'

import { Avatar, Button, Tooltip, UploadFile } from 'antd'
import './style.scss'
import { AiFillFlag, AiOutlineFlag } from 'react-icons/ai'
// import { MdDownload } from 'react-icons/md'
import Right from '~/features/JobSeeker/pages/CV/Right'
import { useEffect, useState } from 'react'
import { EducationLevel, ResumeType } from '~/types/resume.type'
import { defaultResume } from '~/features/JobSeeker/pages/CV'
import apiCandidate from '~/api/candidate.api'
import avatarTemp from '~/assets/logo_temp.jpg'
import apiTrackedCandidate from '~/api/trackedCandidate.api'
import { toast } from 'react-toastify'
interface DetailType {
  [key: string]: any
}
const CandidateDetailPage = (props: any) => {
  const { type } = props
  const { infoUrlCandidate } = useParams()

  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ])
  const [dataCandidate, setDataCandidate] = useState<DetailType>()
  const [dataCV, setDataCV] = useState<ResumeType>(defaultResume)
  useEffect(() => {
    fetchGetDetailCandidate()
  }, [])
  const fetchGetDetailCandidate = async () => {
    if (infoUrlCandidate) {
      const idCandidateUrl = infoUrlCandidate.match(/id-(\w+)/)
      if (idCandidateUrl && idCandidateUrl[1]) {
        await apiCandidate.getCandidateDetail(idCandidateUrl[1]).then((rs) => {
          setDataCandidate(rs.result)
          setDataCV(rs.result.cv)
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: rs.result.cv.user_info.avatar
            }
          ])
        })
      }
    }
  }
  const fetchSubmitFollowCandidate = async (type: string) => {
    if (!dataCandidate) return
    if (type === 'FOLLOW') {
      await apiTrackedCandidate
        .follow(dataCandidate._id)
        .then(() => {
          setDataCandidate({ ...dataCandidate, is_follwing: true })
          toast.success('Bạn đã theo dõi thành công')
        })
        .catch(() => {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại')
        })
    } else {
      await apiTrackedCandidate
        .unFollow(dataCandidate._id)
        .then(() => {
          setDataCandidate({ ...dataCandidate, is_follwing: false })
          toast.success('Bạn đã bỏ theo dõi thành công')
        })
        .catch(() => {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại')
        })
    }
  }

  if (!dataCandidate) return <>...</>
  return (
    <div className='candidate-detail-page-container'>
      <div style={{ padding: '0 20px', fontSize: '14px', fontWeight: 500 }}>
        Bảng điều khiển /{' '}
        {type === 'FOLLOW_TYPE' ? (
          <Link to={'/employer/dashboard/cv-manage/tracked-candidate'}>Danh sách đang theo dõi</Link>
        ) : (
          <Link to={'/employer/dashboard/find-candidate'}>Tìm kiếm ứng viên</Link>
        )}{' '}
        {'>'} {infoUrlCandidate?.match(/id-(\w+)/)?.[1]}
      </div>
      <div className='header-container'>
        <div className='left-container'>
          <Avatar
            className='avatar-candidate'
            size={'large'}
            src={dataCV.user_info.avatar && dataCV.user_info.avatar !== '_' ? dataCV.user_info.avatar : avatarTemp}
          />
          <div className='header-info-wapper'>
            <div className='name'>
              {dataCV.user_info?.first_name.toUpperCase() || ' '}
              {` `}
              {dataCV.user_info?.last_name.toUpperCase() || ' '}
            </div>
            <div className='wanted-job'>{dataCV.user_info.wanted_job_title}</div>
            <div className='wanted-level small-text-header-candidate-detail'>
              {dataCandidate?.level || 'Cấp bậc mong muốn'}
            </div>
            <div className='wanted-area small-text-header-candidate-detail'>
              Khu vực làm việc: {dataCandidate?.work_location.join(', ')}
            </div>
            <div className='birth-date small-text-header-candidate-detail'>{`Ngày sinh:  ${dataCV.user_info.date_of_birth}`}</div>
            <div className='lasted-update-date small-text-header-candidate-detail'>{`Lần cập nhật gần đây: ${
              dataCV.updated_at && dataCV.updated_at.slice(0, 10)
            }`}</div>
          </div>
        </div>
        <div className='right-btn-container'>
          <div className='btn-top-container'>
            {dataCandidate.is_follwing ? (
              <Tooltip title='Bỏ theo dõi'>
                <Button
                  onClick={() => fetchSubmitFollowCandidate('UNFOLLOW')}
                  className='btn-candidate-detail btn-save-cv'
                  icon={<AiFillFlag />}
                />
              </Tooltip>
            ) : (
              <Tooltip title='Theo dõi hồ sơ'>
                <Button
                  onClick={() => fetchSubmitFollowCandidate('FOLLOW')}
                  className='btn-candidate-detail btn-save-cv'
                  style={{ fontSize: '16px' }}
                  icon={<AiOutlineFlag />}
                />
              </Tooltip>
            )}

            {/* <Button className='btn-candidate-detail btn-show-contact'>Xem thông tin liên hệ</Button> */}
          </div>
        </div>
      </div>
      <div className='more-wannted-info-container'>
        <div className='left-content-wapper'>
          <div className='item-wannted'>
            <div className='title-wapper'>Cấp Bậc Mong Muốn</div>
            <div className='value-wapper'>{dataCandidate?.level || '_'}</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Năm Kinh Nghiệm</div>
            <div className='value-wapper'>
              {dataCandidate?.experience < 1
                ? 'Dưới 1'
                : dataCandidate?.experience > 5
                ? 'Trên 5'
                : dataCandidate?.experience}{' '}
              năm
            </div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Ngoại Ngữ</div>
            <div className='value-wapper'>
              {dataCV.languages.data.map((language, index) => (
                <span key={index}>
                  {language.language} - {language.level}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='right-content-wapper'>
          <div className='item-wannted'>
            <div className='title-wapper'>Trình Độ Học Vấn</div>
            <div className='value-wapper'>
              {Number(dataCandidate?.education_level)
                ? Object.keys(EducationLevel)[Number(dataCandidate?.education_level) - 1]
                : dataCandidate?.education_level}
            </div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Ngành Nghề</div>
            <div className='value-wapper'>{dataCandidate?.industry.join(', ')}</div>
          </div>
          {/* <div className='item-wannted'>
            <div className='title-wapper'>Lĩnh Vực</div>
            <div className='value-wapper'>Kế Toán/Kiểm Toán</div>
          </div> */}
          <div className='item-wannted'>
            <div className='title-wapper'>Khu Vực Mong Muốn</div>
            <div className='value-wapper'>{dataCandidate?.work_location.join(', ')}</div>
          </div>
        </div>
      </div>
      <div className='cv-candidate-container'>
        <Right data={dataCV} file={fileList[0]} hiddenButtonDownload={false} />
      </div>
    </div>
  )
}

export default CandidateDetailPage
