import { Avatar, Button, Input, Modal, Upload } from 'antd'
import { Radio } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { imageDimensions } from '~/utils/image'
import '../ModalProfile/style.scss'

import { AiFillCamera } from 'react-icons/ai'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
const ModalUpdateProfile = (props: any) => {
  const { openModal, handleCloseModal } = props
  const disPatch = useDispatch()

  const [birthDay, setBirthDay] = useState()
  const [birthDayStr, setBirthDayStr] = useState('')

  const [name, setName] = useState('')
  const [gender, setGender] = useState(0)
  const [fileListAvatar, setFileListLogo] = useState<UploadFile[]>([])
  const [urlImgPreview, setUrlImgPreview] = useState('')
  const [openModalReview, setOpenModalReview] = useState(false)
  const handleChangeDate = (e: any) => {
    setBirthDay(e.target.value)
  }

  const [checkUpdate, setCheck] = useState(false)
  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  const onClickOkConfirmCropImgLogo = async (e: any) => {
    const dimension = await imageDimensions(e)
    console.log('eee', dimension)
  }
  const onChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('xxx', newFileList)
    setFileListLogo(newFileList)
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    setUrlImgPreview(src)
    setOpenModalReview(true)
  }
  return (
    <Modal
      centered
      className='modal-profile'
      open={openModal}
      onCancel={handleCloseModal}
      footer=''
      width={350}
      title={<h4 style={{ padding: '15px 20px', margin: '0' }}>{`Cập nhật tài khoản`}</h4>}
    >
      <div className='profile-cover'>
        <img src='https://cover-talk.zadn.vn/default' alt='' />
      </div>
      <div className='profile-avatar' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ImgCrop
          rotationSlider
          modalTitle={'Cập nhật Logo'}
          modalOk={'Lưu'}
          modalCancel={'Hủy'}
          onModalOk={(e) => onClickOkConfirmCropImgLogo(e)}
          showReset
          showGrid
        >
          <Upload
            name='logo'
            className='upload-profile'
            customRequest={dummyRequest}
            multiple={false}
            listType='picture-circle'
            fileList={fileListAvatar}
            onChange={onChangeLogo}
            onPreview={onPreview}
          >
            {fileListAvatar.length < 1 && (
              <>
                <AiFillCamera />
              </>
            )}
          </Upload>
        </ImgCrop>
      </div>
      <div className='profile-info-bao'>
        <p>Tên hiển thị</p>
        <Input value={name} size='middle' onChange={(e) => setName(e.target.value)} />

        <h3 style={{ marginTop: '10px' }}>Thông tin cá nhân</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className='info-gender'>
            <span style={{ marginBottom: '5px' }}>Giới tính</span>
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value={0}>Nam</Radio>
              <Radio value={1}>Nữ</Radio>
            </Radio.Group>
          </div>

          <div className='info-birth-day'>
            <span>Ngày sinh</span>
            <Input id='date' type='date' onChange={handleChangeDate} value={birthDay} />
          </div>
        </div>
      </div>
      <div onClick={props.closeUpdate} className='btn-go-update'>
        <Button className='btn-update' style={{ backgroundColor: '#E5E7EB' }}>
          Cập nhật thông tin
        </Button>
      </div>
      <Modal
        className='modal-container'
        centered
        open={openModalReview}
        onOk={() => setOpenModalReview(false)}
        onCancel={() => {
          setOpenModalReview(false), setUrlImgPreview('')
        }}
        width={'auto'}
        style={{ height: 'auto', maxWidth: '50%' }}
        footer={''}
      >
        <img
          src={urlImgPreview}
          alt=''
          style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
        />
      </Modal>
    </Modal>
  )
}
export default ModalUpdateProfile
