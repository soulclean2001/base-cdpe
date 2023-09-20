import { useParams } from 'react-router-dom'

import { Avatar, Button, UploadFile } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'
// import { MdDownload } from 'react-icons/md'
import Right from '~/features/JobSeeker/pages/CV/Right'
import { useState } from 'react'
import { ResumeType } from '~/types/resume.type'
import { defaultResume } from '~/features/JobSeeker/pages/CV'

const CandidateDetailPage = (props: any) => {
  const { infoUrlCandidate } = useParams()

  if (infoUrlCandidate) {
    const idCandidateUrl = infoUrlCandidate.match(/id-(\w+)/)
    console.log('id candidate url', idCandidateUrl?.[1])
  }

  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ])
  const [data, setData] = useState<ResumeType>(defaultResume)
  return (
    <div className='candidate-detail-page-container'>
      <div className='header-container'>
        <div className='left-container'>
          <Avatar
            className='avatar-candidate'
            size={'large'}
            src={'https://images.vietnamworks.com/pictureofresume/1a/169382835110122422.png'}
          />
          <div className='header-info-wapper'>
            <div className='name'>Doan Thi Thanh Tuyen</div>
            <div className='wanted-job'>{`Chief Accountant`}</div>
            <div className='wanted-level small-text-header-candidate-detail'>{`Trưởng phòng`}</div>
            <div className='wanted-area small-text-header-candidate-detail'>{`Bình Thạnh, Hồ Chí Minh`}</div>
            <div className='birth-date small-text-header-candidate-detail'>{`Ngày sinh:  01/11/1988`}</div>
            <div className='lasted-update-date small-text-header-candidate-detail'>{`Lần cập nhật gần đây: 20/09/2023`}</div>
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
            <div className='value-wapper'>Trưởng Phòngpp</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Năm Kinh Nghiệm</div>
            <div className='value-wapper'>12 Năm</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Ngoại Ngữ</div>
            <div className='value-wapper'>
              <span>English - Cao Cấp</span>
              <span>English - Cao Cấp</span>
            </div>
          </div>
        </div>
        <div className='right-content-wapper'>
          <div className='item-wannted'>
            <div className='title-wapper'>Trình Độ Học Vấn</div>
            <div className='value-wapper'>Cử Nhân</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Ngành Nghề</div>
            <div className='value-wapper'>Kế Toán</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Lĩnh Vực</div>
            <div className='value-wapper'>Kế Toán/Kiểm Toán</div>
          </div>
          <div className='item-wannted'>
            <div className='title-wapper'>Khu Vực Mong Muốn</div>
            <div className='value-wapper'>Hồ Chí Minhmmmmmmmmmmmmmmmmmmm</div>
          </div>
        </div>
      </div>
      <div className='cv-candidate-container'>
        <Right data={data} file={fileList[0]} hiddenButtonDownload={false} />
      </div>
    </div>
  )
}

export default CandidateDetailPage
