import { Button, Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import './style.scss'
import { LockOutlined } from '@ant-design/icons'

const ModalChangePassword = (props: any) => {
  const { open, handleClose } = props
  const [form] = Form.useForm()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const handleSubmitForm = (value: any) => {
    const data = {
      oldPassword,
      newPassword,
      rePassword
    }
    console.log('form data post', data)
    handleClose()
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
                pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
                message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường và số, độ dài tối thiểu 8 ký tự'
              }
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
