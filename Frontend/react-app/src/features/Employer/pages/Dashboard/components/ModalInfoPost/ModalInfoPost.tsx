import { Modal } from 'antd'

const ModalInfoPost = (props: any) => {
  const { idPost, open, handleClose } = props
  return (
    <Modal
      title={`THÔNG TIN BÀI ĐĂNG ${idPost}`}
      centered
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      width={'70%'}
      zIndex={3000}
    >
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>
  )
}

export default ModalInfoPost
