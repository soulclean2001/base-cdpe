import { Button, Form, Modal, Select } from 'antd'
import './style.scss'

const ModalBlockAccount = (props: any) => {
  const { open, handleCancel, selectedAccountId } = props
  const [form] = Form.useForm()

  const handleSubmitForm = () => {
    console.log('form data post')
    handleCancel()
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      footer=''
      className='modal-block-account'
      // width={'60%'}
      title={<h4 className='header-container'>Tài khoản {selectedAccountId}</h4>}
      open={open}
      onCancel={handleCancel}
    >
      <div className='modal-content-wapper'>
        <Form
          name='form-block-account'
          className='form-block-account'
          initialValues={{ remember: true }}
          onFinish={handleSubmitForm}
          form={form}
          onFinishFailed={onFinishFailed}
          layout='vertical'
        >
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Thời gian khóa</span>}
            style={{ marginBottom: '10px' }}
            name={'timeBlock'}
            rules={[{ required: true, message: 'Vui lòng chọn thời gian khóa.' }]}
          >
            <Select
              options={[
                { value: '7 ngày', label: '7 ngày' },
                { value: '30 ngày', label: '30 ngày' },
                { value: '90 ngày', label: '90 ngày' },
                { value: '1 năm', label: '1 năm' }
              ]}
            />
          </Form.Item>

          <div
            className='btn-container'
            style={{ marginTop: '20px', gap: '5px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button onClick={handleCancel} size='middle'>
              Thoát
            </Button>

            <Button size='middle' htmlType='submit' className='btn-submit-block-account'>
              Khóa
            </Button>
          </div>
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
        </Form>
      </div>
    </Modal>
  )
}

export default ModalBlockAccount
