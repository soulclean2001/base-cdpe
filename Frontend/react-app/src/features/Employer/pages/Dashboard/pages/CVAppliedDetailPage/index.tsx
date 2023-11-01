import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import './style.scss'
import { Avatar, Button } from 'antd'

import axios from 'axios'
import { useState, useEffect } from 'react'
import { BiSolidUserX } from 'react-icons/bi'
import { FaUserPlus } from 'react-icons/fa'

const CVAppliedDetailPage = () => {
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
    const response = await axios.get(
      'https://tuyen-dung-bucket.s3.ap-southeast-1.amazonaws.com/images/2f402330a2346629137c1f500.pdf',
      {
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        responseType: 'blob' // Important
      }
    )

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const blobUrl: string = URL.createObjectURL(blob)

    setDocs([{ uri: blobUrl, fileType: 'pdf', fileName: 'cv.pdf' }])
  }

  return (
    <div className='doc-view-container'>
      <div className='info-candidate'>
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
              {/* <div className='wanted-level small-text-header-candidate-detail'>{`Trưởng phòng`}</div> */}
              <div className='wanted-area small-text-header-candidate-detail'>Email: font@gmail.com</div>
              <div className='birth-date small-text-header-candidate-detail'>Số điện thoại: 0365887759</div>
              <div className='lasted-update-date small-text-header-candidate-detail'>{`Ngày nộp: 20/09/2023`}</div>
            </div>
          </div>
          <div className='right-btn-container'>
            <div className='btn-top-container'>
              <Button style={{ fontSize: '18px' }} className='btn-candidate-detail btn-save-cv' icon={<FaUserPlus />} />

              <Button
                style={{ fontSize: '22px' }}
                className='btn-candidate-detail btn-save-cv'
                icon={<BiSolidUserX />}
              />

              {/* <Button className='btn-candidate-detail btn-show-contact'>Xem thông tin liên hệ</Button> */}
            </div>
          </div>
        </div>
      </div>

      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
    </div>
  )
}

export default CVAppliedDetailPage
