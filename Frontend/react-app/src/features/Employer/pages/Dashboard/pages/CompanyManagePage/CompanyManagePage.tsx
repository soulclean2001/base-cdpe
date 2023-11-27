import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import './style.scss'
import { BiUpload } from 'react-icons/bi'

import { imageDimensions } from '~/utils/image'
import { toast } from 'react-toastify'
import apiCompany, { UpdateCompanyType } from '~/api/company.api'
import apiMe from '~/api/me.api'
import apiUpload from '~/api/upload.api'
import { getAllFiles } from '~/api/industries.api'
export interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}
export interface MemberType {
  user_id: string
  position: string
}
export interface CompanyType {
  _id?: string
  company_name: string
  company_info?: string
  logo?: string
  users: MemberType[]
  background?: string
  company_size?: string
  working_locations: WorkingLocation[]
  fields?: string[]
  pictures?: string[]
  videos?: string[]
}
const listQuantityEmployers = [
  { value: 'Ít hơn 10' },
  { value: '10-24' },
  { value: '25-99' },
  { value: '100-499' },
  { value: '500-999' },
  { value: '1000-4999' },
  { value: 'Trên 5000' }
]
const maxItem = [{ value: 'Bạn đã chọn tối đa 3 lĩnh vực', label: 'Bạn đã chọn tối đa 3 lĩnh vực', disabled: true }]

const CompanyManagePage = () => {
  const [formCompanyGeneral] = Form.useForm()
  const [myCompany, setMyCompany] = useState<CompanyType>()
  const [nameCompany, setNameCompany] = useState('')

  const [quantityEmployee, setQuantityEmployee] = useState('')

  const [fieldCompany, setFieldCompany] = useState<Array<string>>([])
  const [description, setDescription] = useState('')
  const [linkYoutube, setLinkYoutube] = useState('')
  const [fileListLogo, setFileListLogo] = useState<UploadFile[]>([])
  const [fileListBanner, setFileListBanner] = useState<UploadFile[]>([])
  const [fileListPicture, setFileListPicture] = useState<UploadFile[]>([])
  const [urlImgPreview, setUrlImgPreview] = useState('')
  const [openModalReview, setOpenModalReview] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(false)

  const handleSubmitForm = async () => {
    setBtnDisabled(true)
    const logoImage =
      fileListLogo.length > 0 && fileListLogo[0].originFileObj ? fileListLogo[0].originFileObj : undefined
    const bannerImage =
      fileListBanner.length > 0 && fileListBanner[0].originFileObj ? fileListBanner[0].originFileObj : undefined
    const listUrlBefore: string[] = []
    const listPictureOrigin = fileListPicture.map((file) => {
      if (file.url) listUrlBefore.push(file.url)
      return file.originFileObj ? file.originFileObj : file
    })

    if (!myCompany || !myCompany._id) {
      return
    }
    let errorUpload = false
    let urlLogo = ''
    let urlBanner = ''
    let checkListPicture = ''
    let listUrlPicture: string[] = []
    if (myCompany.logo && fileListLogo[0] && myCompany._id === fileListLogo[0].uid) urlLogo = 'default'
    if (myCompany.background && fileListBanner[0] && myCompany._id === fileListBanner[0].uid) urlBanner = 'default'
    // if (JSON.stringify(myCompany.pictures) === JSON.stringify(listUrlBefore)) checkListPicture = 'default'
    if (logoImage) {
      const logoForm = new FormData()
      logoForm.append('image', logoImage)
      urlLogo = await apiUpload
        .uploadImage(logoForm)
        .then(async (rs) => {
          return rs.result[0].url
        })
        .catch(() => {
          toast.error('Lỗi upload')
          setBtnDisabled(false)
          errorUpload = true
          return
        })
    }
    if (bannerImage) {
      const bannerForm = new FormData()
      bannerForm.append('image', bannerImage)
      urlBanner = await apiUpload
        .uploadImage(bannerForm)
        .then(async (rs) => {
          if (rs.result) return rs.result[0].url
        })
        .catch(() => {
          toast.error('Lỗi upload')
          setBtnDisabled(false)
          errorUpload = true
          return
        })
    }
    if (listPictureOrigin && listPictureOrigin.length > 0) {
      const pictureForm = new FormData()
      listPictureOrigin.map((file) => {
        if (file.lastModified) pictureForm.append('image', file as RcFile)
        else listUrlPicture.push(file.uid)
      })

      if (pictureForm.getAll('image').length > 0) {
        await apiUpload
          .uploadImage(pictureForm)
          .then(async (rs) => {
            if (rs.result) {
              rs.result.map((item: { type: number; url: string }) => {
                listUrlPicture.push(item.url)
              })
            }
          })
          .catch(() => {
            toast.error('Lỗi upload')
            setBtnDisabled(false)
            errorUpload = true
            return
          })
      }
    }
    if (errorUpload) return
    const request: UpdateCompanyType = {
      company_name: myCompany.company_name !== nameCompany ? nameCompany : '',
      company_info: description,
      company_size: myCompany.company_size !== quantityEmployee ? quantityEmployee : '',
      fields: JSON.stringify(myCompany.fields) !== JSON.stringify(fieldCompany) ? fieldCompany : '',
      videos: linkYoutube ? [linkYoutube] : ''
    }

    await apiCompany
      .updateCompanyById(myCompany._id, urlLogo, urlBanner, request, checkListPicture, listUrlPicture)
      .then(() => {
        setBtnDisabled(false)
        toast.success('Cập nhật thông tin công ty thành công')
      })
      .catch(() => {
        setBtnDisabled(false)
        toast.error('Lỗi cập nhật')
        return
      })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const dummyRequest = ({ file, onSuccess }: any) => {
    console.log(file)
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  //img
  const onChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileListLogo(newFileList)
  }
  const onChangePicture: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileListPicture(newFileList)
    console.log('newFileList', newFileList)
  }
  const onChangeBanner: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
    let src = file.url as string
    // if (!src) {
    //   src = await new Promise((resolve) => {
    //     const reader = new FileReader()
    //     reader.readAsDataURL(file.originFileObj as RcFile)
    //     reader.onload = () => resolve(reader.result as string)
    //   })
    // }
    const image = new Image()
    image.src = src
    const list = newFileList.map((file) => {
      file.status = 'done'
      file.thumbUrl = src
      return file
    })
    setFileListBanner(list)
  }
  const onClickOkConfirmCropImgLogo = async (e: any) => {
    const listErro: UploadFile[] = []
    // const dimension = await imageDimensions(e)
    console.log('eee', e.type)
    if (e.type !== 'image/png' && e.type !== 'image/jpg' && e.type !== 'image/jpeg') {
      setFileListLogo(listErro)
      toast.error('Vui lòng chọn ảnh có định dạng .png, .jpg, .jpeg')
      return
    }
    if (e.size > 307200) {
      toast.error('Kích thước hình ảnh tối đa: 3070 kb')
      setFileListBanner(listErro)
      return
    }
  }
  const onClickOkConfirmCropImgPicture = async (e: any) => {
    console.log('e', e)
    // const dimension = await imageDimensions(e)
    const listTemp = fileListPicture.filter((file) => {
      if (file !== e) {
        return file
      }
    })
    if (e.type !== 'image/png' && e.type !== 'image/jpg' && e.type !== 'image/jpeg') {
      setFileListPicture(listTemp)
      toast.error('Vui lòng chọn ảnh có định dạng .png, .jpg, .jpeg')
      return
    }
    if (e.size > 307200) {
      toast.error('Kích thước hình ảnh tối đa: 3070 kb')
      setFileListPicture(listTemp)
      return
    }
  }
  const onClickOkConfirmCropImgBanner = async (e: any) => {
    const { width, height } = await imageDimensions(e)
    console.log('w-h', width, height)
    const listErro: UploadFile[] = []
    if (e.type !== 'image/png' && e.type !== 'image/jpg' && e.type !== 'image/jpeg') {
      setFileListBanner(listErro)
      toast.error('Vui lòng chọn ảnh có định dạng .png, .jpg, .jpeg')
      return
    }
    if (e.size > 307200) {
      toast.error('Kích thước hình ảnh tối đa: 3070 kb')
      setFileListBanner(listErro)
      return
    }
    if (width < 1920 && height < 510) {
      setFileListBanner(listErro)
      console.log('img', fileListBanner)
      toast.error('Kích thước tối thiểu: 1920px x 510px')
      return
    }
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
  // get my company
  useEffect(() => {
    fetchGetMyCompany()
  }, [])
  const fetchGetMyCompany = async () => {
    const me = await apiMe.getMe().then((rs: any) => {
      return rs.result
    })
    await apiCompany.getMyCompany().then((rs: any) => {
      setMyCompany(rs.result)
      setNameCompany(rs.result.company_name)

      setDescription(rs.result.company_info)
      setQuantityEmployee(rs.result.company_size)
      setFieldCompany(rs.result.fields[0] && rs.result.fields[0] !== '_' ? rs.result.fields : [])
      setLinkYoutube(rs.result.videos && rs.result.videos[0] ? rs.result.videos[0] : '')
      if (rs.result.logo) {
        const fileLogo: UploadFile = {
          uid: rs.result._id,
          name: 'logo.png',
          status: 'done',
          url: rs.result.logo
        }
        setFileListLogo([fileLogo])
      }
      if (rs.result.background) {
        const fileBanner: UploadFile = {
          uid: rs.result._id,
          name: 'banner.png',
          status: 'done',
          url: rs.result.background
        }
        setFileListBanner([fileBanner])
      }
      if (rs.result.pictures) {
        let tempUrl = rs.result.pictures.map((pic: string) => {
          return {
            uid: pic,
            name: 'pciture.png',
            status: 'done',
            url: pic
          }
        })

        setFileListPicture(tempUrl)
      }

      formCompanyGeneral.setFieldsValue({
        nameCompany: rs.result.company_name,
        employerContact: me.name,
        description: rs.result.company_info,
        phone: me.phone_number,
        quantityEmployee: rs.result.company_size,
        fieldCompany: rs.result.fields[0] && rs.result.fields[0] !== '_' ? rs.result.fields : [],
        linkVideo: rs.result.videos && rs.result.videos[0] ? rs.result.videos[0] : ''
      })
    })
  }
  //
  return (
    <div className='company-general-container'>
      <div className='title'>Thông Tin Công Ty</div>
      <div className='company-general-content'>
        <Form
          name='form-company-general'
          className='form-company-general'
          initialValues={{ remember: true }}
          onFinish={handleSubmitForm}
          form={formCompanyGeneral}
          onFinishFailed={onFinishFailed}
          layout='vertical'
        >
          <Form.Item name='logo' label={<span style={{ fontWeight: '500' }}>Logo Công Ty</span>}>
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
                // name='logo'
                // style={{ width: 'auto' }}
                customRequest={dummyRequest}
                listType='picture-card'
                fileList={fileListLogo}
                onChange={onChangeLogo}
                onPreview={onPreview}
              >
                {fileListLogo.length < 1 && (
                  <>
                    <BiUpload />
                  </>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            className='form-item-banner'
            name='banner'
            label={<span style={{ fontWeight: '500' }}>Banner Công Ty</span>}
          >
            <ImgCrop
              // quality={1}
              modalWidth={720}
              rotationSlider
              modalTitle={'Cập nhật Banner'}
              modalOk={'Lưu'}
              modalCancel={'Hủy'}
              onModalOk={(e) => onClickOkConfirmCropImgBanner(e)}
              showReset
              showGrid
              aspect={2 / 1}
            >
              <Upload
                className='upload-banner-container'
                name='banner'
                customRequest={dummyRequest}
                listType='picture-card'
                fileList={fileListBanner}
                onChange={onChangeBanner}
                onPreview={onPreview}
              >
                {fileListBanner.length < 1 && (
                  <>
                    <BiUpload /> Tải ảnh lên
                  </>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          {/* <ToastContainer
            position='top-right'
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          /> */}
          <Row justify={'space-between'}>
            <Col md={16} sm={24} xs={24}>
              <Form.Item
                name='nameCompany'
                label={<span style={{ fontWeight: '500' }}>Tên Công Ty</span>}
                rules={[
                  {
                    validator: (_, value) =>
                      value && value.trim() !== ''
                        ? Promise.resolve()
                        : Promise.reject(new Error('Nội dung không được bỏ trống'))
                  },
                  { max: 50, message: 'Đã vượt quá độ dài tối đa 50 ký tự' }
                ]}
              >
                <Input
                  size='large'
                  placeholder='Nhập tên công ty'
                  onChange={(e) => {
                    setNameCompany(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
            <Col md={7} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Item
                name='quantityEmployee'
                label={<span style={{ fontWeight: '500' }}>Quy Mô Công Ty</span>}
                // rules={[{ required: true, message: 'Vui lòng chọn quy mô công ty' }]}
              >
                <Select
                  showSearch
                  placeholder={'Chọn quy mô'}
                  size='large'
                  options={listQuantityEmployers}
                  onChange={(value) => setQuantityEmployee(value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col md={16} sm={24} xs={24}>
              {/* <Form.Item
                name='address'
                label={<span style={{ fontWeight: '500' }}>Địa Chỉ Công Ty</span>}
                rules={[{ required: true, message: 'Vui lòng không để trống địa chỉ công ty' }]}
              >
                <Input
                  size='large'
                  placeholder='Ví dụ: F3/2 Gò Vấp, TP. Hồ Chí Minh'
                  onChange={(e) => {
                    setAddress(e.target.value)
                  }}
                />
              </Form.Item> */}
              <Form.Item
                name='employerContact'
                label={<span style={{ fontWeight: '500' }}>Người Liên Hệ</span>}
                rules={[{ required: true, message: 'Vui lòng không để trống người liên hệ' }]}
              >
                <Input readOnly size='large' placeholder='Ví dụ: Nguyễn Văn B' />
              </Form.Item>
            </Col>
            <Col md={7} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Item
                name='phone'
                label={<span style={{ fontWeight: '500' }}>Điện Thoại</span>}
                rules={[{ required: true, message: 'Vui lòng không để trống số điện thoại' }]}
              >
                <Input readOnly size='large' placeholder='Nhập số điện thoại' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: '500' }}>Lĩnh Vực Công Ty</span>}
            name='fieldCompany'
            rules={[
              {
                validator: (_, value) => {
                  return value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chọn lĩnh vực của Công ty'))
                }
              }
            ]}
          >
            <Select
              showSearch
              mode={'multiple'}
              placeholder={'Chọn lĩnh vực'}
              size='large'
              options={fieldCompany && fieldCompany.length > 2 ? maxItem : getAllFiles}
              onChange={(value) => setFieldCompany(value)}
              maxTagCount={3}
            />
          </Form.Item>
          <Form.Item
            name='description'
            label={<span style={{ fontWeight: '500' }}>Sơ lượt về công ty</span>}
            // rules={[{ required: true, message: 'Vui lòng không để trống sơ lượt về công ty' }]}
          >
            {/* <TextArea
              style={{ height: 210, maxHeight: 210 }}
              size='large'
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            <CKEditor
              data={description ? description : '_'}
              config={{
                toolbar: [
                  'undo',
                  'redo',
                  '|',
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  'outdent',
                  'indent'
                ]
              }}
              editor={ClassicEditor}
              onChange={(_, editor) => {
                const data = editor.getData()
                setDescription(data)
              }}
            />
          </Form.Item>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '10px' }}>Hình ảnh</div>
            <ImgCrop
              rotationSlider
              modalTitle={'Cập nhật hình ảnh'}
              modalOk={'Lưu'}
              modalCancel={'Hủy'}
              onModalOk={(e) => onClickOkConfirmCropImgPicture(e)}
              showReset
              showGrid
              aspect={2 / 1.5}
            >
              <Upload
                // name='logo'
                style={{ width: 'auto' }}
                customRequest={dummyRequest}
                listType='picture-card'
                fileList={fileListPicture}
                onChange={onChangePicture}
                onPreview={onPreview}
              >
                {fileListPicture.length < 4 && (
                  <>
                    <BiUpload />
                  </>
                )}
              </Upload>
            </ImgCrop>
          </div>
          <Form.Item
            name='linkVideo'
            label={<span style={{ fontWeight: '500' }}>Link Video Youtube</span>}
            rules={[
              {
                pattern: new RegExp(
                  /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                ),
                message: 'Vui lòng nhập đúng định dạng link youtube'
              },
              { max: 150, message: 'Đã vượt quá độ dài tối đa 150 ký tự' }
            ]}
          >
            <Input
              size='large'
              placeholder='Nhập link youtube'
              onChange={(e) => {
                setLinkYoutube(e.target.value)
              }}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              disabled={btnDisabled}
              size='large'
              htmlType='submit'
              style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
            >
              Lưu
            </Button>
          </div>
        </Form>

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
      </div>
    </div>
  )
}

export default CompanyManagePage
