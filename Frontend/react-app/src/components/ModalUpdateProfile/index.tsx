import { Button, Input, Modal, Upload } from 'antd'
import { Radio } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'
import { imageDimensions } from '~/utils/image'
import '../ModalProfile/style.scss'
import apiMe, { MeRequestType, MeResponseType } from '~/api/me.api'
import { AiFillCamera } from 'react-icons/ai'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import apiUpload from '~/api/upload.api'
import { toast } from 'react-toastify'
import bannerTemp from '~/assets/banner_temp.jpg'
interface PropsType {
  openModal: boolean
  handleCloseModal: any
  data: MeResponseType
}
const ModalUpdateProfile = (props: PropsType) => {
  const { openModal, handleCloseModal, data }: PropsType = props
  const [myInfo, setMyInfo] = useState<MeResponseType>()
  const [idUser, setIdUser] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState(0)
  const [fileListAvatar, setFileListAvatar] = useState<UploadFile[]>([])
  const [urlImgPreview, setUrlImgPreview] = useState('')
  const [openModalReview, setOpenModalReview] = useState(false)
  const handleChangeDate = (e: any) => {
    let selectDate = e.target.value
    let yearOld = Number(selectDate.slice(0, 4))
    let currentYear = new Date().getFullYear()
    if (currentYear - yearOld < 18) {
      toast.error(`Vui lòng chọn năm sinh từ ${currentYear - 18} trở xuống`)
      return
    }
    setBirthDay(e.target.value)
  }
  const dummyRequest = ({ file, onSuccess }: any) => {
    console.log('file', file)
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  const onClickOkConfirmCropImgLogo = async (e: any) => {
    const dimension = await imageDimensions(e)

    console.log('eee', dimension)
    if (e.type !== 'image/png' && e.type !== 'image/jpg' && e.type !== 'image/jpeg') {
      setFileListAvatar([])
      toast.error('Vui lòng chọn ảnh có định dạng .png, .jpg, .jpeg')
      return
    }
  }
  const onChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileListAvatar(newFileList)
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
  useEffect(() => {
    if (openModal === true) getMyInfo()
  }, [openModal])
  const getMyInfo = async () => {
    setMyInfo(data)
    setIdUser(data._id)
    setName(data.name)
    setPhone(data.phone_number)
    setBirthDay(data.date_of_birth.slice(0, 10))
    setGender(data.gender as number)

    if (data.avatar && data.avatar !== '_') {
      const fileAvatar: UploadFile = {
        uid: `info_${data._id}`,
        name: 'avatar.png',
        status: 'done',
        url: data.avatar
      }
      setFileListAvatar([fileAvatar])
    }
  }
  const handleSubmitUpdate = async () => {
    if (!myInfo) return
    if (!name || name.trim() === '') {
      toast.error('Vui lòng không bỏ trống tên người dùng')
      return
    }
    const phoneRegex = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)

    if (phone && !phoneRegex.test(phone)) {
      toast.error('Vui lòng nhập đúng định dạng số điện thoại, Bắt đầu bằng 03-05-07-08-09 và tối đa 10 số')
      return
    }

    const avatarImage =
      fileListAvatar.length > 0 && fileListAvatar[0].originFileObj ? fileListAvatar[0].originFileObj : undefined
    let urlAvatar = '_'
    if (fileListAvatar.length > 0 && idUser === fileListAvatar[0].uid.slice(5, fileListAvatar[0].uid.length))
      urlAvatar = 'default'
    if (avatarImage) {
      const logoForm = new FormData()
      logoForm.append('image', avatarImage)

      urlAvatar = await apiUpload.uploadImage(logoForm).then(async (rs) => {
        return rs.result[0].url
      })
    }
    const request: MeRequestType = {
      name: myInfo.name !== name ? (name ? name : '_') : '',
      date_of_birth: myInfo.date_of_birth !== birthDay ? birthDay : '',
      phone_number: myInfo.phone_number !== phone ? phone : '',
      gender: myInfo.gender !== gender ? gender : ''
    }
    await apiMe.updateMe(request, urlAvatar).then(() => {
      toast.success('Cập nhật thông tin thành công')
      handleCloseModal()
    })
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
        {/* <img src='https://cover-talk.zadn.vn/default' alt='' /> */}
        <img src={bannerTemp} alt='' />
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
          <div className='info-phone' style={{ paddingBottom: '15px' }}>
            <span>Số điện thoại</span>
            <Input value={phone} size='middle' onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className='info-gender'>
            <span style={{ marginBottom: '5px' }}>Giới tính</span>
            <Radio.Group
              onChange={(e) => {
                setGender(e.target.value)
              }}
              value={gender === 0 ? 0 : 1}
            >
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
      <div onClick={handleSubmitUpdate} className='btn-go-update'>
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
