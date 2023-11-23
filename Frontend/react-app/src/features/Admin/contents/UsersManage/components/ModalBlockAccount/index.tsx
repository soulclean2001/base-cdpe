import { Button, Form, Modal } from 'antd'
import './style.scss'
import apiAdmin from '~/api/admin.api'

import { toast } from 'react-toastify'
const ModalBlockAccount = (props: any) => {
  const { open, handleCancel, selectedAccountId, isBanned, handleAfterSubmit } = props
  const [form] = Form.useForm()

  const handleSubmitForm = async () => {
    if (!selectedAccountId) return
    await apiAdmin
      .postBlockOrUnLockUser(selectedAccountId)
      .then((rs) => {
        if (rs.result) {
          if (isBanned) toast.success(`Bạn đã bỏ chặn #USER_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          if (!isBanned) toast.success(`Bạn đã chặn #USER_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          handleAfterSubmit()
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      footer=''
      className='modal-block-account'
      // width={'60%'}
      title={<h4 className='header-container'>Tài khoản #USER_{selectedAccountId.slice(-5).toUpperCase()}</h4>}
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
          <div>
            Bạn có chắc muốn {isBanned ? 'bỏ khóa' : 'khóa'} tài khoản #USER_{selectedAccountId.slice(-5).toUpperCase()}
            ?
          </div>
          {/* <Form.Item
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
          </Form.Item> */}

          <div
            className='btn-container'
            style={{ marginTop: '20px', gap: '5px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button onClick={handleCancel} size='middle'>
              Thoát
            </Button>

            <Button size='middle' htmlType='submit' className='btn-submit-block-account'>
              {isBanned ? 'Bỏ khóa' : 'Khóa'}
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
