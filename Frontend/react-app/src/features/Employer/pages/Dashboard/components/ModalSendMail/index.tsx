import { Button, Form, Input, Modal } from 'antd'
import './style.scss'
import { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import apiCompany from '~/api/company.api'

// import { useSelector } from 'react-redux'
// import { RootState } from '~/app/store'
// import { InfoMeState } from '~/features/Account/meSlice'
import { toast } from 'react-toastify'
const ModalSendMail = (props: any) => {
  const { open, handleCancel, email } = props
  const [form] = Form.useForm()
  const [titleMail, setTitleMail] = useState('')
  const [descriptions, setDescriptions] = useState('')
  //   const me: InfoMeState = useSelector((state: RootState) => state.me)
  const handleSubmitForm = async () => {
    const request: {
      from_address?: string
      to_address: string
      data: string
      subject: string
    } = {
      //   from_address: 'fonttt0169@gmail.com',
      to_address: email,
      data: descriptions,
      subject: titleMail
    }
    if (!request.to_address || !request.data || !request.subject) {
      toast.error('Gửi mail thất bại, vui lòng thử lại!!')
      return
    }
    await apiCompany
      .sendMail(request)
      .then((rs) => {
        console.log('Rs', rs)
        toast.success(`Gửi mail thành công đến ${email}`)
        handleCancel()
      })
      .catch(() => {
        toast.error('Gửi mail thất bại, vui lòng thử lại!!')
      })

    console.log(titleMail, descriptions)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Modal
      footer=''
      className='modal-send-mail'
      title={<h4 className='header-container'>Gửi đến {email}</h4>}
      open={open}
      onCancel={handleCancel}
      width={700}
    >
      <div className='modal-content-wapper'>
        <Form
          name='form-send-mail'
          className='form-send-mail'
          onFinish={handleSubmitForm}
          form={form}
          onFinishFailed={onFinishFailed}
          layout='vertical'
        >
          <Form.Item
            name='titleMail'
            label={<span style={{ fontWeight: '500' }}>Tiêu đề</span>}
            rules={[
              { min: 10, message: 'Độ dài tối thiểu 10 ký tự' },
              { max: 50, message: 'Đã vượt quá độ dài tối đa 50 ký tự' },
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung không được bỏ trống'))
              }
            ]}
          >
            <Input
              size='large'
              className='name-job-input'
              placeholder='Thông báo trúng tuyển vào công việc ...'
              onChange={(e) => setTitleMail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name='descriptions'
            label={<span style={{ fontWeight: '500' }}>Nội dung</span>}
            rules={[
              {
                validator: () =>
                  descriptions.length >= 100 && descriptions.length <= 2000
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung tối thiểu 100 ký tự và tối đa 2000 ký tự'))
              },
              {
                validator: () =>
                  descriptions && descriptions.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Nội dung không được bỏ trống'))
              }
            ]}
          >
            <CKEditor
              data={descriptions}
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
                setDescriptions(data)
              }}
            />
          </Form.Item>

          <div
            className='btn-container'
            style={{ marginTop: '20px', gap: '5px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button onClick={handleCancel} size='middle'>
              Thoát
            </Button>

            <Button size='middle' htmlType='submit' className='btn-submit-send-mail'>
              Gửi
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ModalSendMail
