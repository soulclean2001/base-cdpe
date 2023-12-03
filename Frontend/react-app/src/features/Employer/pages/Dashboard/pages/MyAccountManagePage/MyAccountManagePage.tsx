import { Button, Col, Collapse, Form, Input, Row } from 'antd'
import { AiFillEdit, AiOutlineCheck } from 'react-icons/ai'
import { useState } from 'react'
import './style.scss'
import { MdCancel } from 'react-icons/md'
const MyAccountManagePage = () => {
  const [formChangeEmail] = Form.useForm()
  const [nowPassword, setNowPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showInputEditName, setShowInputEditName] = useState(false)
  const [showCollasep, setShowCollasep] = useState('0')
  const handleSubmitSignup = () => {
    const data = {
      nowPassword,
      newPassword,
      confirmNewPassword
    }
    console.log('form data post', data)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div id='my-account-manage-page-container'>
      <div className='title'>Thông Tin Tài Khoản</div>
      <div className='info-containerr'>
        {/* <div className='title'>Thông tin chung</div> */}
        <div className='info-contentt'>
          <Row style={{ paddingBottom: '20px' }}>
            <Col md={4} lg={3} sm={6} xs={24}>
              <span className='label label-email'>Địa chỉ email</span>
            </Col>
            <Col md={20} lg={21} sm={18} xs={24}>
              <span className='my-email'>fontt@gmail</span>
            </Col>
          </Row>
          <Row style={{ paddingBottom: '20px' }}>
            <Col md={4} lg={3} sm={6} xs={24}>
              <span className='label label-my-name'>Họ và tên</span>
            </Col>
            <Col md={20} lg={21} sm={18} xs={24} style={{ display: 'flex', gap: '5px' }}>
              {showInputEditName ? (
                <>
                  <Input style={{ width: '50%' }} />
                  <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
                    <Button
                      shape='circle'
                      size='middle'
                      htmlType='submit'
                      style={{ background: 'none', color: 'green' }}
                      icon={<AiOutlineCheck />}
                    />

                    <Button
                      shape='circle'
                      size='middle'
                      icon={<MdCancel />}
                      style={{ color: 'red' }}
                      onClick={() => setShowInputEditName(false)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <span className='my-name'>Thanh pHong</span>
                  <span className='edit-name' onClick={() => setShowInputEditName(true)}>
                    <AiFillEdit />
                  </span>
                </>
              )}
            </Col>
          </Row>
          <hr />
          <div className='collapse-change-password-container'>
            <Collapse
              className='collapse-change-password'
              size='small'
              ghost
              activeKey={showCollasep}
              onChange={() => setShowCollasep(showCollasep === '0' ? '1' : '0')}
              items={[
                {
                  key: '1',
                  label: 'Thay đổi mật khẩu',
                  children: (
                    <Form
                      name='form-change-email'
                      className='form-change-email'
                      initialValues={{ remember: true }}
                      onFinish={handleSubmitSignup}
                      form={formChangeEmail}
                      onFinishFailed={onFinishFailed}
                      layout='vertical'
                    >
                      <Form.Item
                        name='nowPassword'
                        label={<span style={{ fontWeight: '500' }}>Mật Khẩu Hiện Tại</span>}
                        rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu hiện tại' }]}
                      >
                        <Input
                          size='middle'
                          placeholder='Nhập mật khẩu truy cập hiện tại'
                          onChange={(e) => setNowPassword(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name='newPassword'
                        label={<span style={{ fontWeight: '500' }}>Mật Khẩu Mới</span>}
                        rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu hiện tại' }]}
                      >
                        <Input
                          size='middle'
                          placeholder='Nhập mật khẩu mới'
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name='confirmNewPassword'
                        label={<span style={{ fontWeight: '500' }}>Nhập Lại Mật Khẩu</span>}
                        rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu' }]}
                      >
                        <Input
                          size='middle'
                          placeholder='Nhập lại mật khẩu mới'
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                      </Form.Item>
                      <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
                        <Button
                          size='middle'
                          style={{ width: '100px' }}
                          onClick={() => setShowCollasep(showCollasep === '0' ? '1' : '0')}
                        >
                          Hủy
                        </Button>

                        <Button
                          size='middle'
                          htmlType='submit'
                          style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
                        >
                          Lưu
                        </Button>
                      </div>
                    </Form>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccountManagePage
