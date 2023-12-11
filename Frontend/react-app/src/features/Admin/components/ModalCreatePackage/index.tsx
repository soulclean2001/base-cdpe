import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload, UploadProps } from 'antd'
import './style.scss'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useState, useEffect } from 'react'
import TextArea from 'antd/es/input/TextArea'
import ImgCrop from 'antd-img-crop'
import { UploadFile } from 'antd/lib'
import { toast } from 'react-toastify'
import { BiUpload } from 'react-icons/bi'
import { RcFile } from 'antd/es/upload'
import apiUpload from '~/api/upload.api'
import apiPackage from '~/api/package.api'
import { CreatePackageReqBody } from '~/api/package.api'
import { NumericFormat } from 'react-number-format'
const listTypeServices = [
  { value: 'POST', label: 'Đăng bài' },
  { value: 'BANNER', label: 'Quảng cáo công ty' }
]
const listTimeUse = [
  { value: 7, label: '7 Ngày' },
  { value: 30, label: '30 Ngày' },
  { value: 60, label: '60 Ngày' },
  { value: 90, label: '90 Ngày' },
  { value: 125, label: '125 Ngày' },
  { value: 365, label: '365 Ngày' }
]
const ModalCreatePackage = (props: any) => {
  const { idPackage, open, handleClose, handleAfterSubmit, roleType } = props
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
  const [statusDetail, setStatusDetail] = useState('')
  let checkImg = false
  useEffect(() => {
    if (open) {
      handleClearForm()
      if (idPackage) handleGetDetailById()
    }
  }, [open])
  const handleClearForm = () => {
    form.resetFields()
    setNamePackage('')
    setTypePackage('')
    setTimeUse(1)
    setTotalPostAccept(1)
    setDescript('')
    setIncludes('')
    setPrice(1000)
    setFileListPicture([])
    setStatusDetail('')
  }
  const handleGetDetailById = async () => {
    await apiPackage.getDetailById(idPackage).then((rs) => {
      console.log('rs', rs)
      setNamePackage(rs.result.title)
      setDescript(rs.result.description)
      setTypePackage(rs.result.type)
      setTimeUse(rs.result.number_of_days_to_expire)
      setTotalPostAccept(rs.result.value)
      setPrice(rs.result.price)
      setIncludes(rs.result.includes)
      setStatusDetail(rs.result.status)
      form.setFieldsValue({
        serviceName: rs.result.title,
        typeService: rs.result.type,
        totalPostAccept: rs.result.value,
        timeUse: rs.result.number_of_days_to_expire,
        price: rs.result.price,
        description: rs.result.description,
        includes: rs.result.includes
      })
      if (rs.result.preview) {
        let tempUrl = rs.result.preview.map((pic: string) => {
          return {
            uid: pic,
            name: 'pciture.png',
            status: 'done',
            url: pic
          }
        })

        setFileListPicture(tempUrl)
      }
    })
  }
  const dummyRequest = ({ file, onSuccess }: any) => {
    console.log('file', file)
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }
  const onChangePicture: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (checkImg) {
      checkImg = false
      return
    }

    setFileListPicture(newFileList)
  }
  const onClickOkConfirmCropImgPicture = (e: any) => {
    const listTemp = fileListPicture.filter((file) => {
      if (file !== e) {
        return file
      }
    })
    if (e.type !== 'image/png' && e.type !== 'image/jpg' && e.type !== 'image/jpeg') {
      setFileListPicture(listTemp)
      toast.error('Vui lòng chọn ảnh có định dạng .png, .jpg, .jpeg')
      checkImg = true
      return
    }
    if (e.size > 307200) {
      toast.error('Kích thước hình ảnh tối đa: 300 kb')
      setFileListPicture(listTemp)
      checkImg = true
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
    let checkErrorUpload = false
    const listPictureOrigin = fileListPicture.map((file) => {
      return file.originFileObj ? file.originFileObj : file
    })
    if (listPictureOrigin && listPictureOrigin.length > 0) {
      const pictureForm = new FormData()
      listPictureOrigin.map((file) => {
        if (file.lastModified) pictureForm.append('image', file as RcFile)
        else listUrlPicture.push(file.uid)
      })
      // console.log('pictureForm', pictureForm.getAll('image'))

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
            checkErrorUpload = true
            toast.error('Lỗi')
            return
          })
      }
    }
    if (checkErrorUpload) return
    let request: CreatePackageReqBody = {
      title: namePackage,
      description: descript,
      includes: includes,
      number_of_days_to_expire: typePackage === 'BANNER' ? timeUse : 1,
      price: price,
      type: typePackage,
      code: typePackage,
      preview: listUrlPicture,
      value: typePackage === 'POST' ? totalPostAccept : 1,
      discount_price: price
    }
    if (!idPackage) {
      await apiPackage.createPackage(request).then((rs) => {
        console.log('create', rs)
        toast.success('Tạo mới gói dịch vụ thành công')
        handleAfterSubmit()
      })
    } else {
      await apiPackage.updatePackage(idPackage, request).then((rs) => {
        console.log('update', rs)
        toast.success(`Cập nhật gói dịch vụ #SV_${idPackage.slice(-5).toUpperCase()} thành công`)
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
      title={
        <h2>{idPackage ? `THÔNG TIN DỊCH VỤ #SV_${idPackage.slice(-5).toUpperCase()}` : 'TẠO MỚI GÓI DỊCH VỤ'}</h2>
      }
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
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung không được bỏ trống'))
              },
              { max: 150, message: 'Đã vượt quá độ dài tối đa' }
            ]}
          >
            <Input
              disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
              size='large'
              placeholder='Đăng bài'
              onChange={(e) => setNamePackage(e.target.value)}
            />
          </Form.Item>

          <Row justify={'space-between'}>
            <Col md={11} sm={24} xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: '500' }}>Loại dịch vụ</span>}
                name='typeService'
                rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
              >
                <Select
                  disabled={idPackage ? true : false}
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
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                  initialValue={1}
                  label={<span style={{ fontWeight: '500' }}>Số lượng bài đăng cho phép</span>}
                  name='totalPostAccept'
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
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
                    disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
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
          <Form.Item
            label={<span style={{ fontWeight: '500' }}>Đơn giá (VNĐ)</span>}
            name='price'
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },

              {
                validator: (_, value) =>
                  value.toString().length > 0 && value.toString().length <= 13
                    ? !value.toString().includes(',')
                      ? Number(value) % 100 === 0
                        ? Promise.resolve()
                        : Promise.reject(new Error('Số phải chia hết cho 100'))
                      : parseInt(value.replace(/,/g, ''), 10) % 100 === 0
                      ? Promise.resolve()
                      : Promise.reject('Số phải chia hết cho 100!')
                    : Promise.reject(new Error('Độ dài tối đa 14 ký tự, giá tối thiểu 500 và tối đa 9.999.999.900'))
              }
            ]}
          >
            <NumericFormat
              size='large'
              value={price}
              thousandSeparator
              customInput={Input}
              style={{ width: '100%' }}
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                  event.preventDefault()
                }
              }}
              placeholder='Đơn giá'
              onChange={(e) => {
                setPrice(
                  !e.target.value.includes(',')
                    ? Number(e.target.value)
                    : parseInt(e.target.value.replace(/,/g, ''), 10)
                )
              }}
            />
          </Form.Item>
          {/* <Form.Item
            name='price'
            rules={[
              { required: true, message: 'Vui lòng nhập mức giá' },
              { type: 'number', min: 10000, message: 'Mức giá tối thiểu là 10000 VND' },
              { type: 'number', max: 10000000000, message: 'Mức giá tối đa là 10.000.000.000 VND' },
              {
                validator: (_, value) => {
                  // Hàm validation kiểm tra số chia hết cho 10000
                  if (value % 500 === 0) {
                    return Promise.resolve()
                  }
                  return Promise.reject('Số phải chia hết cho 500!')
                }
              }
            ]}
            initialValue={1000}
            label={<span style={{ fontWeight: '500' }}>Đơn giá (VNĐ)</span>}
          >
            <InputNumber
              disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
              style={{ width: '100%' }}
              min={10000}
              max={10000000000}
              step={500}
              size='large'
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                  event.preventDefault()
                }
              }}
              onChange={(value) => setPrice(Number(value))}
            />
          </Form.Item> */}
          <Form.Item
            name='description'
            label={<span style={{ fontWeight: '500' }}>Mô Tả</span>}
            rules={[
              {
                validator: () =>
                  descript && descript.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung không được bỏ trống'))
              }
            ]}
          >
            <CKEditor
              disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
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
              onChange={(_, editor) => {
                const data = editor.getData()
                setDescript(data)
              }}
            />
          </Form.Item>
          <Form.Item
            name='includes'
            label={
              <span style={{ fontWeight: '500' }}>
                Bao gồm{' '}
                <span style={{ fontWeight: '300' }}>
                  (Những đặc quyền sẽ nhận được, mỗi Enter xuống dòng sẽ tính là 1 đặc quyền)
                </span>
              </span>
            }
            rules={[
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung không được bỏ trống'))
              }
            ]}
          >
            <TextArea
              disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
              size='large'
              onChange={(e) => setIncludes(e.target.value)}
            />
          </Form.Item>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '10px' }}>Hình ảnh</div>
            <ImgCrop
              modalWidth={800}
              rotationSlider
              modalTitle={'Cập nhật hình ảnh'}
              modalOk={'Lưu'}
              modalCancel={'Hủy'}
              onModalOk={(e) => onClickOkConfirmCropImgPicture(e)}
              showReset
              showGrid
              aspect={9.5 / 10}
            >
              <Upload
                disabled={statusDetail === 'DELETED' || roleType === 'EMPLOYER_TYPE' ? true : false}
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
          <div className='btn-container' style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
            <Button size='large' style={{ width: '100px' }} onClick={handleClose}>
              Thoát
            </Button>

            {idPackage && roleType !== 'EMPLOYER_TYPE' && statusDetail !== 'DELETED' && (
              <Button
                size='large'
                htmlType='submit'
                style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
              >
                Cập nhật
              </Button>
            )}
            {!idPackage && roleType !== 'EMPLOYER_TYPE' && (
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
