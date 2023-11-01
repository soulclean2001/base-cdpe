import { useState, useEffect } from 'react'
import './style.scss'
import { Button, Form, Input, Modal, Radio, Space, Upload, UploadFile, UploadProps, message } from 'antd'
import { FaFileUpload } from 'react-icons/fa'
import { RadioChangeEvent } from 'antd/lib'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import apiResume from '~/api/resume.api'
import { AuthState } from '~/features/Auth/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import logoTemp from '~/assets/HF_logo.jpg'
import apiUpload from '~/api/upload.api'
interface HeaderModalApplyCVType {
  id: string
  logo: string
  nameJob: string
  nameCompany: string
  salary: string
  level: string
  address: WorkingLocation[]
}
interface PropsType {
  headerModalData: HeaderModalApplyCVType
  open: boolean
  handleCancel: any
}
const ModalApplyCV = (props: any) => {
  const { headerModalData, open, handleCancel }: PropsType = props
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [typeCV, setTypeCV] = useState<number>(1)
  const [fileCV, setFileCV] = useState<UploadFile>()
  const [idCV, setIdCV] = useState('')
  const [isDisabledSelected, setIsDisabledSelected] = useState(false)

  useEffect(() => {
    if (open) {
      if (!auth.isLogin && auth.verify !== 1) {
        navigate('/candidate-login')
        return
      }
      getIDCV()
    }
  }, [open])
  const getIDCV = async () => {
    await apiResume.getAllByMe().then((rs) => {
      console.log('me', rs)
      if (!rs.result[0]) setIsDisabledSelected(true)
      else {
        setIsDisabledSelected(false)
        setIdCV(rs.result[0]._id)
      }
    })
  }
  const handleSubmitForm = async () => {
    const data = {
      idJob: headerModalData?.id,
      fullName,
      email,
      phone,
      typeCV,
      fileCV: typeCV === 0 ? undefined : fileCV,
      applicationDate: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
      }),
      cvId: typeCV === 0 ? idCV : '',
      cvLink: 'upload link'
    }

    if (typeCV === 1 && !fileCV) {
      toast.error('Hồ sơ của bạn chưa được tải lên')
      return
    }
    // if (data.fileCV && data.fileCV.originFileObj) {
    //   const cvForm = new FormData()
    //   cvForm.append('file', data.fileCV.originFileObj)
    //   await apiUpload.uploadPDF(cvForm).then((rs) => {
    //     console.log(rs)
    //   })
    // }

    console.log('form data post', data)

    handleCancel()
    form.resetFields()
    // handleClose()
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const onChangeTypeCV = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    setTypeCV(e.target.value)
  }
  const beforeUpload: UploadProps = {
    multiple: false,
    beforeUpload: (file) => {
      console.log('file', file)
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        toast.error(`${file.name} không phải định dạng PDF`)
        return Upload.LIST_IGNORE
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} vượt quá kích thước 10MB`)
        return Upload.LIST_IGNORE
      }
      return isPDF
    },
    onChange: (info) => {
      // console.log(info.fileList)
      console.log('info.file', info.file)
      setFileCV(info.file)
    }
  }
  const dummyRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  return (
    <Modal
      footer=''
      className='modal-apply-cv-container'
      // width={'60%'}
      title={
        <div className='header-container'>
          <img className='logo' src={headerModalData?.logo || logoTemp} />
          <div className='header-info-wapper'>
            <div className='name-job'>{headerModalData?.nameJob || 'Name job'}</div>
            <div className='address'>{headerModalData.nameCompany}</div>
            <div className='salary-level-wapper'>
              <span className='salary'>{headerModalData?.salary || 'salary_ex:Thương lượng'}</span>
              <span className='bulkhead-salary-level'>|</span>
              <span className='level'>{headerModalData?.level || 'level _ ex: Trưởng phòng'}</span>
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={handleCancel}
    >
      <h2 style={{ margin: '20px 0 15px 0', textAlign: 'center' }}>Thông tin ứng tuyển</h2>
      <div className='modal-content-apply-cv'>
        {/* <div className='avatar-wapper'>
          <Avatar
            shape='circle'
            className='my-avatar'
            src={
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjUomfa_RnsH46_KyLLymV02F2Ae8c9mSGqgsK0TPSjI-tbJCAUezBbSf1ZMDcpaaaXI&usqp=CAU'
            }
          />
        </div> */}

        <div className='form-info-apply-cv-wapper'>
          {/* <div className='user-full-name'>Thanh Phong</div> */}

          <Form
            name='form-info-apply-cv'
            className='form-info-apply-cv'
            initialValues={{ remember: true }}
            onFinish={handleSubmitForm}
            form={form}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Họ & tên</span>}
              style={{ marginBottom: '10px' }}
              name={'name'}
              rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
            >
              <Input onChange={(e) => setFullName(e.target.value)} size='large' placeholder='Nhập họ & tên' />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Email</span>}
              style={{ marginBottom: '10px' }}
              name={'email'}
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin.' },
                { type: 'email', message: 'Vui lòng nhập đúng định dạng Email' }
              ]}
            >
              <Input onChange={(e) => setEmail(e.target.value)} size='large' placeholder='Nhập email' />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}
              style={{ marginBottom: '10px' }}
              name={'phone'}
              rules={[
                { required: true, message: 'Vui lòng không để trống số điện thoại' },
                {
                  pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                  message:
                    'Vui lòng nhập đúng định dạng số điện thoại: Có những số đầu là 03-05-07-08-09 và có 10 số.  Ví dụ: 0988888888'
                }
              ]}
            >
              <Input onChange={(e) => setPhone(e.target.value)} size='large' placeholder='Nhập số điện thoại' />
            </Form.Item>
            <div className='choose-type-cv-wapper'>
              <div className='select-type-cv'>
                <Radio.Group onChange={onChangeTypeCV} value={typeCV}>
                  <Space direction='vertical'>
                    <Radio disabled={isDisabledSelected} value={0} style={{ fontWeight: typeCV === 0 ? '500' : '400' }}>
                      CV Online ( <Link to={'/CV'}>Xem hồ sơ</Link> )
                    </Radio>
                    <Radio value={1} style={{ fontWeight: typeCV === 1 ? '500' : '400' }}>
                      Tải lên CV
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              {typeCV && typeCV === 1 ? (
                <Upload customRequest={dummyRequest} {...beforeUpload} className='upload-cv-wapper'>
                  {fileCV ? (
                    <div className='upload-file-pdf-container'>
                      <div className='choose-file-wapper'>Hồ sơ đã được tải lên</div>
                    </div>
                  ) : (
                    <div className='upload-file-pdf-container'>
                      <div className='choose-file-wapper'>
                        <FaFileUpload />
                        Chọn hồ sơ từ máy của bạn
                      </div>
                      <div className='info-support-type-file'>Hỗ trợ định dạng .pdf có kích thước dưới 10MB</div>
                    </div>
                  )}
                </Upload>
              ) : (
                <></>
              )}
            </div>
            <div className='btn-container'>
              <Button onClick={handleCancel} size='large'>
                Thoát
              </Button>
              <Button size='large' htmlType='submit' className='btn-submit-apply-cv'>
                Nộp đơn
              </Button>
            </div>
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
          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default ModalApplyCV
