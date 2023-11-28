import { Button, Form, Modal } from 'antd'
import './style.scss'
import apiAdmin from '~/api/admin.api'
import apiJobAppli from '~/api/jobsApplication.api'
import { toast } from 'react-toastify'
const ModalConfirm = (props: any) => {
  const { open, handleCancel, selectedAccountId, isBanned, handleAfterSubmit, type } = props
  const [form] = Form.useForm()

  const handleSubmitForm = async () => {
    if (!selectedAccountId) return
    if (type === 'BANNED_ACCOUNT') {
      await apiAdmin
        .postBlockOrUnLockUser(selectedAccountId)
        .then((rs) => {
          if (rs.result) {
            if (isBanned) toast.success(`Bạn đã bỏ khóa #USER_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
            if (!isBanned) toast.success(`Bạn đã khóa #USER_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại')
        })
      handleAfterSubmit()
      return
    }
    if (type !== 'BANNED_ACCOUNT' && isBanned) {
      await apiJobAppli
        .updateProfileStatus(selectedAccountId, 'available')
        .then(() => {
          toast.success(`Bạn đã hoàn tác #CV_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          handleAfterSubmit('available')
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại')
          handleAfterSubmit()
        })

      return
    }
    if (type === 'BLOCKED_CV' && !isBanned) {
      await apiJobAppli
        .updateProfileStatus(selectedAccountId, 'blacklist')
        .then(() => {
          toast.success(`Bạn đã chặn #CV_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          handleAfterSubmit('blacklist')
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại')
          handleAfterSubmit()
        })
      return
    }
    if (type === 'DELETED_CV' && !isBanned) {
      await apiJobAppli
        .updateProfileStatus(selectedAccountId, 'deleted')
        .then(() => {
          toast.success(`Bạn đã xóa #CV_${selectedAccountId.slice(-5).toUpperCase()} thành công`)
          handleAfterSubmit('deleted')
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại')
          handleAfterSubmit()
        })

      return
    }
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Modal
      footer=''
      className='modal-block-account'
      // width={'60%'}
      title={
        <h4 className='header-container'>
          {type === 'BANNED_ACCOUNT'
            ? `Tài khoản #USER_${selectedAccountId?.slice(-5).toUpperCase()}`
            : `Hồ sơ #CV_${selectedAccountId?.slice(-5).toUpperCase()}`}
        </h4>
      }
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
          {type === 'BANNED_ACCOUNT' && (
            <div>
              Bạn có chắc muốn {isBanned ? 'bỏ khóa' : 'khóa'} tài khoản #USER_
              {selectedAccountId.slice(-5).toUpperCase()}?
            </div>
          )}
          {type === 'BLOCKED_CV' && (
            <div>
              Bạn có chắc muốn {isBanned ? 'bỏ chặn' : 'chặn'} hồ sơ #CV_{selectedAccountId.slice(-5).toUpperCase()}?
            </div>
          )}
          {type === 'DELETED_CV' && (
            <div>
              Bạn có chắc muốn {isBanned ? 'khôi phục' : 'xóa'} hồ sơ #CV_{selectedAccountId.slice(-5).toUpperCase()}?
            </div>
          )}

          <div
            className='btn-container'
            style={{ marginTop: '20px', gap: '5px', display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button onClick={handleCancel} size='middle'>
              Thoát
            </Button>

            <Button size='middle' htmlType='submit' className='btn-submit-block-account'>
              {type === 'BANNED_ACCOUNT' && <>{isBanned ? 'Bỏ khóa' : 'Khóa'}</>}
              {type === 'BLOCKED_CV' && <>{isBanned ? 'Bỏ chặn' : 'Chặn'}</>}
              {type === 'DELETED_CV' && <>{isBanned ? 'Khôi phục' : 'Xóa'}</>}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ModalConfirm
