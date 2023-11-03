import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import './style.scss'
import { Avatar, Button, Dropdown, MenuProps, Tooltip, UploadFile } from 'antd'

import axios from 'axios'
import { useState, useEffect } from 'react'
import { BiBlock, BiCommentError, BiSolidUserX } from 'react-icons/bi'
import { FaUserPlus } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import apiJobsAppli from '~/api/jobsApplication.api'
import { ResumeType } from '~/types/resume.type'
import { defaultResume } from '~/features/JobSeeker/pages/CV'
import Right from '~/features/JobSeeker/pages/CV/Right'
import { MdConnectWithoutContact, MdDelete } from 'react-icons/md'
import { IoMdMail } from 'react-icons/io'
import { FiMoreVertical } from 'react-icons/fi'
import { JobApplicationStatus } from '~/types/jobAppliacation.type'
interface DetailType {
  [key: string]: any
}
const CVAppliedDetailPage = () => {
  const { infoUrlAppliedCV } = useParams()
  const [myDetail, setMyDetail] = useState<DetailType>()
  const [dataCV, setDataCV] = useState<ResumeType>(defaultResume)
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    // uid: '-1',
    // name: 'image.png',
    // status: 'done',
    // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ])
  //   const docs = [
  //     {
  //       uri: 'https://tuyen-dung-bucket.s3.ap-southeast-1.amazonaws.com/images/2f402330a2346629137c1f500.pdf',
  //       fileType: 'pdf',
  //       fileName: 'demo.pdf'
  //     }
  //   ]
  const [docs, setDocs] = useState<{ uri: string; fileType: string; fileName: string }[]>([])
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    if (!infoUrlAppliedCV) return
    const idCandidateUrl = infoUrlAppliedCV.match(/id-(\w+)/)
    if (!idCandidateUrl || !idCandidateUrl[1]) return
    await apiJobsAppli.getJobsApplicationById(idCandidateUrl[1]).then(async (rs) => {
      console.log('detail', rs)
      setMyDetail(rs.result)
      if (rs.result.cv) {
        setDataCV(rs.result.cv)
        if (rs.result.cv.user_info.avatar)
          setFileList([
            { uid: rs.result.cv._id, name: 'image.png', status: 'done', url: rs.result.cv.user_info.avatar }
          ])
      }

      if (rs.result.type === 1 && rs.result.cv_link) {
        const response = await axios.get(
          // 'https://tuyen-dung-bucket.s3.ap-southeast-1.amazonaws.com/images/2f402330a2346629137c1f500.pdf',
          rs.result.cv_link,
          {
            headers: {
              'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Origin': '*'
            },
            responseType: 'blob' // Important
          }
        )
        console.log('response', response)
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const blobUrl: string = URL.createObjectURL(blob)

        setDocs([{ uri: blobUrl, fileType: 'pdf', fileName: 'cv.pdf' }])
      }
    })
  }
  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title='Gửi Mail'>
          <a style={{ color: '#1677ff' }}>
            <IoMdMail />
          </a>
        </Tooltip>
      ),
      key: '0'
    },
    {
      label: (
        <Tooltip title='Hủy bỏ'>
          <a style={{ color: '#1677ff' }}>
            <MdDelete />
          </a>
        </Tooltip>
      ),
      key: '2'
    },
    {
      label: (
        <Tooltip title='Thêm vào sổ đen'>
          <a style={{ color: '#1677ff' }}>
            <BiBlock />
          </a>
        </Tooltip>
      ),
      key: '3'
    }
  ]

  if (!myDetail) return <>...</>
  else
    return (
      <div className='doc-view-container'>
        <div style={{ padding: '0 20px', fontSize: '14px', fontWeight: 500 }}>
          Bảng điều khiển / <Link to={'/employer/dashboard/cv-manage'}>Hồ sơ ứng tuyển</Link> {'>'}{' '}
          {infoUrlAppliedCV?.match(/id-(\w+)/)?.[1]}
        </div>
        <div className='info-candidate'>
          <div className='header-container'>
            <div className='left-container'>
              <Avatar className='avatar-candidate' size={'large'} src={dataCV.user_info.avatar} />
              <div className='header-info-wapper'>
                <div className='name'>{myDetail.full_name}</div>
                <div className='wanted-job'>{`Chief Accountant`}</div>
                {/* <div className='wanted-level small-text-header-candidate-detail'>{`Trưởng phòng`}</div> */}
                <div className='wanted-area small-text-header-candidate-detail'>Email: {myDetail.email}</div>
                <div className='birth-date small-text-header-candidate-detail'>
                  Số điện thoại: {myDetail.phone_number}
                </div>
                <div className='birth-date small-text-header-candidate-detail'>
                  Trạng thái: {Object.values(JobApplicationStatus)[Number(myDetail.status)]}
                </div>
                <div className='lasted-update-date small-text-header-candidate-detail'>{`Ngày nộp: ${myDetail.application_date.slice(
                  0,
                  10
                )}`}</div>
              </div>
            </div>
            <div className='right-btn-container'>
              <div className='btn-top-container'>
                {myDetail.status === 0 && (
                  <>
                    <Tooltip title='Chấp nhận CV'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<FaUserPlus />}
                      />
                    </Tooltip>
                    <Tooltip title='Từ chối CV'>
                      <Button
                        style={{ fontSize: '22px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiSolidUserX />}
                      />
                    </Tooltip>
                  </>
                )}
                {myDetail.status === 1 && (
                  <>
                    <Tooltip title='Phỏng vấn'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<MdConnectWithoutContact />}
                      />
                    </Tooltip>
                    <Tooltip title='Không thể liên hệ'>
                      <Button
                        style={{ fontSize: '22px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiCommentError />}
                      />
                    </Tooltip>
                  </>
                )}
                {myDetail.status === 3 && (
                  <>
                    <Tooltip title='Chấp nhận CV'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<FaUserPlus />}
                      />
                    </Tooltip>
                    <Tooltip title='Từ chối CV'>
                      <Button
                        style={{ fontSize: '22px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiSolidUserX />}
                      />
                    </Tooltip>
                  </>
                )}
                {myDetail.status === 4 && (
                  <>
                    <Tooltip title='Nhận việc'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<FaUserPlus />}
                      />
                    </Tooltip>
                    <Tooltip title='Từ chối'>
                      <Button
                        style={{ fontSize: '22px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiSolidUserX />}
                      />
                    </Tooltip>
                  </>
                )}
                {myDetail.status === 7 && (
                  <>
                    <Tooltip title='Phỏng vấn'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<MdConnectWithoutContact />}
                      />
                    </Tooltip>
                    <Tooltip title='Từ chối'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiSolidUserX />}
                      />
                    </Tooltip>
                  </>
                )}
                {myDetail.status !== 2 && myDetail.status !== 5 ? (
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <FiMoreVertical />
                    </a>
                  </Dropdown>
                ) : (
                  <>
                    <Tooltip title='Hủy bỏ'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<MdDelete />}
                      />
                    </Tooltip>

                    <Tooltip title='Thêm vào sổ đen'>
                      <Button
                        style={{ fontSize: '18px' }}
                        className='btn-candidate-detail btn-save-cv'
                        icon={<BiBlock />}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {myDetail.type === 1 && myDetail.cv_link ? (
          <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
        ) : (
          <Right data={dataCV} file={fileList[0]} hiddenButtonDownload={false} />
        )}
      </div>
    )
}

export default CVAppliedDetailPage
