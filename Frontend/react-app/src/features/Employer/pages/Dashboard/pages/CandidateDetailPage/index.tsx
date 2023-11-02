import { useParams } from 'react-router-dom'

import { Avatar, Button, UploadFile } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'
// import { MdDownload } from 'react-icons/md'
import Right from '~/features/JobSeeker/pages/CV/Right'
import { useEffect, useState } from 'react'
import { EducationLevel, ResumeType } from '~/types/resume.type'
import { defaultResume } from '~/features/JobSeeker/pages/CV'
import apiCandidate from '~/api/candidate.api'
interface DetailType {
  [key: string]: any
}
const CandidateDetailPage = (props: any) => {
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
          console.log('detail rs', rs)
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

  return (
    <div className='candidate-detail-page-container'>
      <div className='header-container'>
        <div className='left-container'>
          <Avatar className='avatar-candidate' size={'large'} src={dataCV.user_info.avatar} />
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
            <Button className='btn-candidate-detail btn-save-cv' icon={<AiFillFlag />}>
              {/* Lưu hồ sơ */}
            </Button>
            {/* <Button className='btn-candidate-detail btn-download' icon={<MdDownload />}>
              Tải về
            </Button> */}
            <Button className='btn-candidate-detail btn-show-contact'>Xem thông tin liên hệ</Button>
          </div>
          {/* <div className='btn-bot-container'>
            <Button className='btn-candidate-detail btn-show-contact'>Xem thông tin liên hệ</Button>
          </div> */}
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
