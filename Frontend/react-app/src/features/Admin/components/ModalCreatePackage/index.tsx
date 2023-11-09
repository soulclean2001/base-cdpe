import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload, UploadProps } from 'antd'
import './style.scss'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useState, useRef, useEffect } from 'react'
import TextArea from 'antd/es/input/TextArea'
import ImgCrop from 'antd-img-crop'
import { UploadFile } from 'antd/lib'
import { toast } from 'react-toastify'
import { BiUpload } from 'react-icons/bi'
import { RcFile } from 'antd/es/upload'
import apiUpload from '~/api/upload.api'
import apiPackage from '~/api/package.api'
import { CreatePackageReqBody } from '~/api/package.api'
import { type } from 'os'
const listTypeServices = [
  { value: 'POST', label: 'Đăng bài' },
  { value: 'BANNER', label: 'Quảng cáo công ty' }
]
const listTimeUse = [
  { value: 7, label: '7 Ngày' },
  { value: 30, label: '30 Ngày' },
  { value: 60, label: '30 Ngày' },
  { value: 90, label: '90 Ngày' },
  { value: 125, label: '125 Ngày' },
  { value: 365, label: '365 Ngày' }
]
const ModalCreatePackage = (props: any) => {
  const { idPackage, open, handleClose, handleAfterSubmit } = props
  const [form] = Form.useForm()
  const [namePackage, setNamePackage] = useState('')
  const [typePackage, setTypePackage] = useState('')
  const [timeUse, setTimeUse] = useState<number>(1)
  const [totalPostAccept, setTotalPostAccept] = useState<number>(1)
  const [descript, setDescript] = useState('')
  const [includes, setIncludes] = useState('')
  const [price, setPrice] = useState(1000)
  const [fileListPicture, setFileListPicture] = useState<UploadFile[]>([])
  const [urlImgPreview, setUrlImgPreview] = useState('')
  const [openModalReview, setOpenModalReview] = useState(false)

  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  const onChangePicture: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileListPicture(newFileList)
    console.log('newFileList', newFileList)
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
    if (e.size > 3072000) {
      toast.error('Kích thước hình ảnh tối đa: 3070 kb')
      setFileListPicture(listTemp)
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
  const handleSubmitForm = async () => {
    const data = { namePackage, typePackage, timeUse, totalPostAccept, descript, includes, price }
    console.log('data', data)
    let listUrlPicture: string[] = []

    const listPictureOrigin = fileListPicture.map((file) => {
      return file.originFileObj ? file.originFileObj : file
    })
    if (listPictureOrigin && listPictureOrigin.length > 0) {
      const pictureForm = new FormData()
      listPictureOrigin.map((file) => {
        console.log('file', file)
        if (file.lastModified) pictureForm.append('image', file as RcFile)
        else listUrlPicture.push(file.uid)
      })
      console.log('pictureForm', pictureForm.getAll('image'))
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
            toast.error('Lỗi')
            return
          })
      }
    }
    let request: CreatePackageReqBody = {
      title: namePackage,
      description: descript,
      includes: includes,
      number_of_days_to_expire: typePackage === 'BANNER' ? timeUse : 1,
      price: price,
      type: typePackage,
      code: typePackage,
      preview: listUrlPicture,
      value: typePackage === 'POST' ? totalPostAccept : 1
    }
    if (!idPackage) {
      await apiPackage.createPackage(request).then((rs) => {
        console.log('create', rs)
        handleAfterSubmit()
      })
    } else {
      await apiPackage.updatePackage(idPackage, request).then((rs) => {
        console.log('update', rs)
        handleAfterSubmit()
      })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Modal
      className='modal-post-detail-container'
      title={<h2>{idPackage ? `THÔNG TIN DỊCH VỤ ${idPackage}` : 'TẠO MỚI GÓI DỊCH VỤ'}</h2>}
      centered
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      width={800}
      footer={''}
    >
      <div>
        <hr />
        <Form
          name='form-info-jobb'
          className='form-info-job'
          initialValues={{ remember: true }}
          onFinish={handleSubmitForm}
          form={form}
          onFinishFailed={onFinishFailed}
          layout='vertical'
        >
          <h2>Mô tả gói dịch vụ</h2>

          <Form.Item
            name='serviceName'
            label={<span style={{ fontWeight: '500' }}>Tên dịch vụ</span>}
            rules={[
              { required: true, message: 'Vui lòng không để trống tên dịch vụ' },
              { max: 150, message: 'Đã vượt quá độ dài tối đa' }
            ]}
          >
            <Input size='large' placeholder='Đăng bài' onChange={(e) => setNamePackage(e.target.value)} />
          </Form.Item>

          <Row justify={'space-between'}>
            <Col md={11} sm={24} xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Loại dịch vụ</span>}
                name='typeService'
                rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
              >
                <Select
                  showSearch
                  placeholder={'Chọn loại dịch vụ'}
                  size='large'
                  options={listTypeServices}
                  onChange={(value) => setTypePackage(value)}
                />
              </Form.Item>
            </Col>
            {typePackage === 'POST' && (
              <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  initialValue={1}
                  label={<span style={{ fontWeight: '500' }}>Số lượng bài đăng cho phép</span>}
                  name='totalPostAccept'
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    min={1}
                    max={99999}
                    size='large'
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    onChange={(value) => setTotalPostAccept(Number(value))}
                  />
                </Form.Item>
              </Col>
            )}
            {typePackage === 'BANNER' && (
              <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Thời gian sử dụng</span>}
                  name='timeUse'
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: (_, value) => {
                        return value ? Promise.resolve() : Promise.reject(new Error('Chọn thời gian sử dụng'))
                      }
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={'Chọn thời gian sử dụng'}
                    size='large'
                    options={listTimeUse}
                    onChange={(value) => setTimeUse(Number(value))}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Form.Item name='price' initialValue={1} label={<span style={{ fontWeight: '500' }}>Đơn giá</span>}>
            <InputNumber
              style={{ width: '100%' }}
              min={1000}
              max={999999999}
              size='large'
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                  event.preventDefault()
                }
              }}
              onChange={(value) => setPrice(Number(value))}
            />
          </Form.Item>
          <Form.Item
            name='descriptions'
            label={<span style={{ fontWeight: '500' }}>Mô Tả</span>}
            rules={[{ required: true, message: 'Vui lòng không để trống mô tả gói dịch vụ' }]}
          >
            <CKEditor
              data={descript}
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
              onChange={(event, editor) => {
                const data = editor.getData()
                setDescript(data)
              }}
            />
          </Form.Item>
          <Form.Item
            name='requirements'
            label={
              <span style={{ fontWeight: '500' }}>
                Bao gồm{' '}
                <span style={{ fontWeight: '300' }}>
                  (Những đặc quyền sẽ nhận được, mỗi Enter xuống dòng sẽ tính là 1 đặc quyền)
                </span>
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng không để trống' }]}
          >
            <TextArea size='large' onChange={(e) => setIncludes(e.target.value)} />
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
                {fileListPicture.length < 6 && (
                  <>
                    <BiUpload />
                  </>
                )}
              </Upload>
            </ImgCrop>
          </div>
          <div className='btn-container' style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
            <Button size='large' style={{ width: '100px' }} onClick={handleClose}>
              Thoát
            </Button>

            {idPackage ? (
              <Button
                size='large'
                htmlType='submit'
                style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
              >
                Cập nhật
              </Button>
            ) : (
              <Button
                size='large'
                htmlType='submit'
                style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
              >
                Tạo
              </Button>
            )}
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
    </Modal>
  )
}

export default ModalCreatePackage
