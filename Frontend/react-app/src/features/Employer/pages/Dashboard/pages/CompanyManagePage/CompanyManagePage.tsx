import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useState } from 'react'

import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import './style.scss'
import { BiUpload } from 'react-icons/bi'
import TextArea from 'antd/es/input/TextArea'
import { imageDimensions } from '~/utils/image'
import { toast, ToastContainer } from 'react-toastify'
const listQuantityEmployers = [
  { value: 'Ít hơn 10' },
  { value: '10-24' },
  { value: '25-99' },
  { value: '100-499' },
  { value: '500-999' },
  { value: '1000-4999' }
]
const listFieldCompany = [
  { value: 'Bảo hiểm' },
  { value: 'Chứng khoán' },
  { value: 'Kiểm toán' },
  { value: 'Ngân hàng' },
  { value: 'Tài chính/ Đầu tư' },
  { value: 'In ấn/ Xuất bản' },
  { value: 'Internet/ Online Media' },
  { value: 'Bán sỉ/ Bán lẻ' },
  { value: 'Hàng không/ Du lịch' },
  { value: 'Nhà hàng/ Khách sạn' },
  { value: 'Bất động sản' },
  { value: 'IT - Phần mềm' },
  { value: 'IT - Phần cứng/ Mạng' }
]
const CompanyManagePage = () => {
  const [formCompanyGeneral] = Form.useForm()
  const [nameCompany, setNameCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantityEmployee, setQuantityEmployee] = useState('')
  const [employerContact, setEmployerContact] = useState('')
  const [fieldCompany, setFieldCompany] = useState('')
  const [description, setDescription] = useState('')
  //   const [urlLogo, setUrlLogo] = useState('')
  //   const [urlBanner, setUrlBanner] = useState('')
  const [fileListLogo, setFileListLogo] = useState<UploadFile[]>([])
  const [fileListBanner, setFileListBanner] = useState<UploadFile[]>([])
  const [urlImgPreview, setUrlImgPreview] = useState('')
  const [openModalReview, setOpenModalReview] = useState(false)
  const handleSubmitForm = () => {
    const logoImage =
      fileListLogo.length > 0 && fileListLogo[0].originFileObj ? fileListLogo[0].originFileObj : undefined
    const bannerImage =
      fileListBanner.length > 0 && fileListBanner[0].originFileObj ? fileListBanner[0].originFileObj : undefined
    const data = {
      nameCompany,
      phone,
      fieldCompany,
      address,
      quantityEmployee,
      employerContact,
      description,
      logoImage,
      bannerImage
    }

    console.log('form data post', data)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  //img
  const onChangeLogo: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('xxx', newFileList)
    setFileListLogo(newFileList)
  }
  const onChangeBanner: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
    console.log(file)
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
    const list = newFileList.map((file) => {
      file.status = 'done'
      file.thumbUrl = src
      return file
    })
    setFileListBanner(list)
  }
  const onClickOkConfirmCropImgLogo = async (e: any) => {
    const dimension = await imageDimensions(e)
    console.log('eee', dimension)
  }
  const onClickOkConfirmCropImgBanner = async (e: any) => {
    const { width, height } = await imageDimensions(e)
    console.log('w-h', width, height)
    if (width < 1920 && height < 510) {
      const listErro: UploadFile[] = []
      setFileListBanner(listErro)
      console.log('img', fileListBanner)
      toast.error('Hình ảnh không đúng kích thước')
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
                name='logo'
                style={{ width: 'auto' }}
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
              quality={1}
              modalWidth={720}
              rotationSlider
              modalTitle={'Cập nhật Banner'}
              modalOk={'Lưu'}
              modalCancel={'Hủy'}
              onModalOk={onClickOkConfirmCropImgBanner}
              showReset
              showGrid
              aspect={2 / 1}
            >
              <Upload
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
          <ToastContainer
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
          />
          <Row justify={'space-between'}>
            <Col md={16} sm={24} xs={24}>
              <Form.Item
                name='nameCompany'
                label={<span style={{ fontWeight: '500' }}>Tên Công Ty</span>}
                rules={[{ required: true, message: 'Vui lòng không để trống tên công ty' }]}
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
                name='phone'
                label={<span style={{ fontWeight: '500' }}>Điện Thoại</span>}
                rules={[{ required: true, message: 'Vui lòng không để trống số điện thoại' }]}
              >
                <Input
                  size='large'
                  placeholder='Nhập số điện thoại'
                  onChange={(e) => {
                    setPhone(e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col md={16} sm={24} xs={24}>
              <Form.Item
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
              </Form.Item>
            </Col>
            <Col md={7} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Item
                name='quantityEmployee'
                label={<span style={{ fontWeight: '500' }}>Quy Mô Công Ty</span>}
                rules={[{ required: true, message: 'Vui lòng chọn quy mô công ty' }]}
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
          <Form.Item
            name='employerContact'
            label={<span style={{ fontWeight: '500' }}>Người Liên Hệ</span>}
            rules={[{ required: true, message: 'Vui lòng không để trống người liên hệ' }]}
          >
            <Input
              size='large'
              placeholder='Ví dụ: Nguyễn Văn B'
              onChange={(e) => {
                setEmployerContact(e.target.value)
              }}
            />
          </Form.Item>
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
              placeholder={'Chọn lĩnh vực của công ty'}
              size='large'
              options={listFieldCompany}
              onChange={(value) => setFieldCompany(value)}
            />
          </Form.Item>
          <Form.Item
            name='description'
            label={<span style={{ fontWeight: '500' }}>Sơ lượt về công ty</span>}
            rules={[{ required: true, message: 'Vui lòng không để trống sơ lượt về công ty' }]}
          >
            <TextArea
              style={{ height: 210, maxHeight: 210 }}
              size='large'
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
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
