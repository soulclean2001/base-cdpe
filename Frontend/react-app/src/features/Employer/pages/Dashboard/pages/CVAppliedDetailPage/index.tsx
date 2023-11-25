import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import './style.scss'
import { Avatar, Button, Dropdown, MenuProps, Tooltip, UploadFile } from 'antd'

import axios from 'axios'
import { useState, useEffect } from 'react'
import { BiBlock, BiCommentError, BiSolidUserX } from 'react-icons/bi'
import { FaTrashRestoreAlt, FaUserPlus } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import apiJobsAppli from '~/api/jobsApplication.api'
import { ResumeType } from '~/types/resume.type'
import { defaultResume } from '~/features/JobSeeker/pages/CV'
import Right from '~/features/JobSeeker/pages/CV/Right'
import { MdConnectWithoutContact, MdDelete } from 'react-icons/md'

import { FiMoreVertical } from 'react-icons/fi'
import { JobApplicationStatus } from '~/types/jobAppliacation.type'
import avatarTemp from '~/assets/logo_temp.jpg'
import apiJobsApplication from '~/api/jobsApplication.api'
import { toast } from 'react-toastify'
import { CgUnblock } from 'react-icons/cg'
import { RiUserStarFill } from 'react-icons/ri'
import apiJob from '~/api/post.api'
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
  const [jobName, setJobName] = useState('')
  const [docs, setDocs] = useState<{ uri: string; fileType: string; fileName: string }[]>([])
  useEffect(() => {
    fetchData()
  }, [infoUrlAppliedCV])
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
      await apiJob.getPostById(rs.result.job_post_id).then((rs) => {
        if (rs && rs.result) setJobName(rs.result.job_title)
      })
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
  const fetchActionApplication = async (id: string, type?: string, status?: number) => {
    if (!id) return
    if (type === 'APPROVE') {
      await apiJobsApplication.approveCV(id).then((rs) => {
        console.log('approve', rs)
        toast.success(`#CV_${id.slice(-5).toUpperCase()} đã được chấp nhận`)
        setMyDetail({ ...myDetail, status: 1 })
      })
    }
    if (type === 'REJECT') {
      await apiJobsApplication.rejectCV(id).then((rs) => {
        console.log('reject', rs)
        toast.success(`#CV_${id.slice(-5).toUpperCase()} đã bị từ chối`)
        setMyDetail({ ...myDetail, status: 2 })
      })
    }
    if (status && status > -1) {
      await apiJobsApplication.updateStatus(id, status).then((rs) => {
        console.log('rs update', rs)
        toast.success(
          `#CV_${id.slice(-5).toUpperCase()} đã thay đổi trạng thái sang ${Object.values(JobApplicationStatus)[status]}`
        )
        setMyDetail({ ...myDetail, status: status })
      })
    }
  }
  const handleActionChangeProfileStatus = async (id: string, profileStatus: string, statusLabel: string) => {
    await apiJobsApplication.updateProfileStatus(id, profileStatus).then(async () => {
      toast.success(`#CV_${id.slice(-5).toUpperCase()} đã thay đổi trạng thái sang ${statusLabel}`)
      setMyDetail({ ...myDetail, profile_status: profileStatus })
    })
  }
  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title='Hủy bỏ'>
          <a
            onClick={() => handleActionChangeProfileStatus(myDetail && myDetail._id, 'deleted', 'Đã hủy')}
            style={{ color: '#1677ff' }}
          >
            <MdDelete />
          </a>
        </Tooltip>
      ),
      key: '2'
    },
    {
      label: (
        <Tooltip title='Thêm vào sổ đen'>
          <a
            onClick={() => handleActionChangeProfileStatus(myDetail && myDetail._id, 'blacklist', 'Đã hủy')}
            style={{ color: '#1677ff' }}
          >
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
          Bảng điều khiển / <Link to={'/employer/dashboard/cv-manage'}>Hồ sơ ứng tuyển</Link> {'>'} #CV_
          {infoUrlAppliedCV
            ?.match(/id-(\w+)/)?.[1]
            .slice(-5)
            .toUpperCase()}
        </div>
        <div className='info-candidate'>
          <div className='header-container'>
            <div className='left-container'>
              <Avatar
                className='avatar-candidate'
                size={'large'}
                src={dataCV.user_info.avatar && dataCV.user_info.avatar !== '_' ? dataCV.user_info.avatar : avatarTemp}
              />
              <div className='header-info-wapper'>
                <div className='name'>{myDetail.full_name}</div>
                <div className='wanted-job'>{jobName}</div>
                {/* <div className='wanted-level small-text-header-candidate-detail'>{`Trưởng phòng`}</div> */}
                <div className='wanted-area small-text-header-candidate-detail'>Email: {myDetail.email}</div>
                <div className='birth-date small-text-header-candidate-detail'>
                  Số điện thoại: {myDetail.phone_number}
                </div>
                <div className='birth-date small-text-header-candidate-detail'>
                  Trạng thái: {Object.values(JobApplicationStatus)[Number(myDetail.status)]}
                </div>
                <div className='lasted-update-date small-text-header-candidate-detail'>{`Ngày nộp: ${
                  myDetail.application_date ? myDetail.application_date.slice(0, 10) : ''
                }`}</div>
              </div>
            </div>
            <div className='right-btn-container'>
              {myDetail.profile_status === 'available' && (
                <div className='btn-top-container'>
                  {myDetail.status === 0 && (
                    <>
                      <Tooltip title='Chấp nhận CV'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, 'APPROVE')}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<FaUserPlus />}
                        />
                      </Tooltip>
                      <Tooltip title='Từ chối CV'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, 'REJECT')}
                          style={{ fontSize: '22px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<BiSolidUserX />}
                        />
                      </Tooltip>
                      {myDetail.type !== 1 && (
                        <Tooltip title='Tiềm năng'>
                          <Button
                            onClick={() => fetchActionApplication(myDetail._id, '', 3)}
                            style={{ fontSize: '18px' }}
                            className='btn-candidate-detail btn-save-cv'
                            icon={<RiUserStarFill />}
                          />
                        </Tooltip>
                      )}
                    </>
                  )}
                  {myDetail.status === 1 && (
                    <>
                      <Tooltip title='Phỏng vấn'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, '', 4)}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<MdConnectWithoutContact />}
                        />
                      </Tooltip>
                      <Tooltip title='Không thể liên hệ'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, '', 7)}
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
                          onClick={() => fetchActionApplication(myDetail._id, 'APPROVE')}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<FaUserPlus />}
                        />
                      </Tooltip>
                      <Tooltip title='Từ chối CV'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, 'REJECT')}
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
                          onClick={() => fetchActionApplication(myDetail._id, '', 5)}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<FaUserPlus />}
                        />
                      </Tooltip>
                      <Tooltip title='Từ chối'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, 'REJECT')}
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
                          onClick={() => fetchActionApplication(myDetail._id, '', 4)}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<MdConnectWithoutContact />}
                        />
                      </Tooltip>
                      <Tooltip title='Từ chối'>
                        <Button
                          onClick={() => fetchActionApplication(myDetail._id, 'REJECT')}
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
                          onClick={() => handleActionChangeProfileStatus(myDetail._id, 'deleted', 'Đã hủy')}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<MdDelete />}
                        />
                      </Tooltip>

                      <Tooltip title='Thêm vào sổ đen'>
                        <Button
                          onClick={() => handleActionChangeProfileStatus(myDetail._id, 'blacklist', 'Đã chặn')}
                          style={{ fontSize: '18px' }}
                          className='btn-candidate-detail btn-save-cv'
                          icon={<BiBlock />}
                        />
                      </Tooltip>
                    </>
                  )}
                </div>
              )}
              {myDetail.profile_status === 'blacklist' && (
                <div className='btn-top-container'>
                  <Tooltip title='Hủy bỏ'>
                    <Button
                      onClick={() => handleActionChangeProfileStatus(myDetail._id, 'deleted', 'Đã hủy')}
                      style={{ fontSize: '18px' }}
                      className='btn-candidate-detail btn-save-cv'
                      icon={<MdDelete />}
                    />
                  </Tooltip>
                  <Tooltip title='Bỏ chặn'>
                    <Button
                      onClick={() => handleActionChangeProfileStatus(myDetail._id, 'available', 'Hiệu lực')}
                      style={{ fontSize: '18px' }}
                      className='btn-candidate-detail btn-save-cv'
                      icon={<CgUnblock />}
                    />
                  </Tooltip>
                </div>
              )}
              {myDetail.profile_status === 'deleted' && (
                <div className='btn-top-container'>
                  <Tooltip title='Hoàn tát'>
                    <Button
                      onClick={() => handleActionChangeProfileStatus(myDetail._id, 'deleted', 'Đã hủy')}
                      style={{ fontSize: '18px' }}
                      className='btn-candidate-detail btn-save-cv'
                      icon={<FaTrashRestoreAlt />}
                    />
                  </Tooltip>
                  <Tooltip title='Thêm vào sổ đen'>
                    <Button
                      onClick={() => handleActionChangeProfileStatus(myDetail._id, 'available', 'Hiệu lực')}
                      style={{ fontSize: '18px' }}
                      className='btn-candidate-detail btn-save-cv'
                      icon={<BiBlock />}
                    />
                  </Tooltip>
                </div>
              )}
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
