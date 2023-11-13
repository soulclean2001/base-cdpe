import { Button, Form, Input, Modal } from 'antd'
import { useState } from 'react'
import './style.scss'
import { LockOutlined } from '@ant-design/icons'
import apiAuth from '~/api/auth.api'
import { toast } from 'react-toastify'
import { logout } from '~/features/Auth/authSlice'
import { useDispatch } from 'react-redux'

const ModalChangePassword = (props: any) => {
  const { open, handleClose } = props
  const [form] = Form.useForm()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const distPatch = useDispatch()

  const handleSubmitForm = async () => {
    const request: {
      old_password: string
      password: string
      confirm_new_password: string
    } = {
      old_password: oldPassword,
      password: newPassword,
      confirm_new_password: rePassword
    }

    await apiAuth
      .changePassword(request)
      .then((rs) => {
        console.log('Rs', rs)
        toast.success('Mật khẩu của bạn đã được cập nhật thành công')
        handleClose()
        distPatch(logout())
        window.location.reload()
      })
      .catch(() => {
        toast.error('Mật khẩu hiện tại không đúng, vui lòng nhập chính xác mật khẩu hiện tại')
        return
      })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Modal
      className='modal-change-password'
      title={<div className='title'>Thay đổi mật khẩu</div>}
      open={open}
      // onOk={handleOk}
      onCancel={handleClose}
      footer={''}
    >
      <Form
        name='form-change-password'
        className='form-change-password'
        initialValues={{ remember: true }}
        onFinish={handleSubmitForm}
        form={form}
        onFinishFailed={onFinishFailed}
        layout='vertical'
      >
        <div className='form-change-password-content-wapper'>
          <Form.Item
            name={'oldPassword'}
            label={<h4>Mật khẩu hiện tại</h4>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' }
              //   {
              //     pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
              //     message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường và số, độ dài tối thiểu 8 ký tự'
              //   }
            ]}
          >
            <Input.Password
              size='large'
              prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
              type='password'
              placeholder='Nhập mật khẩu'
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name={'newPassword'}
            label={<h4>Mật khẩu mới</h4>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              {
                pattern: new RegExp(/^(?=(.*[a-z]){1})(?=(.*[A-Z]){1})(?=(.*\d){1})(?=(.*\W){1}).{6,}$/),
                message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường, ký tự đặc biệt và số, độ dài tối thiểu 6 ký tự'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu mới phải khác mật khẩu hiện tại'))
                }
              })
            ]}
          >
            <Input.Password
              size='large'
              prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
              type='password'
              placeholder='Nhập mật khẩu'
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name={'rePassword'}
            label={<h4>Nhập lại mật khẩu</h4>}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Nhập lại mật khẩu không chính xác'))
                }
              })
            ]}
          >
            <Input.Password
              size='large'
              prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
              type='password'
              placeholder='Nhập lại mật khẩu'
              onChange={(e) => setRePassword(e.target.value)}
            />
          </Form.Item>

          <div className='btn-container'>
            <Button size='large' onClick={handleClose}>
              Thoát
            </Button>

            <Button size='large' htmlType='submit' style={{ background: 'rgb(255, 125, 85)', color: 'white' }}>
              Thay đổi
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalChangePassword
