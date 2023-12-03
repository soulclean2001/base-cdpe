import { Button, Tabs, TabsProps } from 'antd'
import './style.scss'
import { AiFillPlusCircle } from 'react-icons/ai'
import TableCustom from './components/TableCustom/TableCustom'
import { useState } from 'react'
import ModalInfoPost from '../../components/ModalInfoPost/ModalInfoPost'
const PostManagePage = () => {
  const [tabKey, setTabKey] = useState('tab-publish')
  const [openModalAddPost, setOpenModalAddPost] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const onChangeTab = (key: string) => {
    setTabKey(key)
  }
  const handleAfterSubmit = () => {
    setOpenModalAddPost(false)
    setIsSubmit(true)
  }
  const handleCloseModal = () => {
    setIsSubmit(false)
    setOpenModalAddPost(false)
  }
  const items: TabsProps['items'] = [
    {
      key: 'tab-publish',
      label: <div className='tab-item'>Công Khai</div>,
      children: <></>
    },
    {
      key: 'tab-hide',
      label: <div className='tab-item'>Riêng Tư</div>,
      children: <></>
    },
    {
      key: 'tab-over-time-7-day',
      label: <div className='tab-item'>Sắp Hết Hạn Trong 7 Ngày</div>,
      children: <></>
    },
    {
      key: 'tab-over-time',
      label: <div className='tab-item'>Đã Hết Hạn</div>,
      children: <></>
    }
  ]

  return (
    <div className='post-manage-page-container'>
      <div className='title-container'>
        <div className='post-manage-title'>QUẢN LÝ BÀI ĐĂNG</div>
      </div>
      <div className='show-modal-add-post-container'>
        <Button
          size='large'
          icon={<AiFillPlusCircle />}
          onClick={() => {
            setOpenModalAddPost(true)
            setIsSubmit(false)
          }}
        >
          Tạo bài đăng
        </Button>
        <ModalInfoPost
          handleAfterSubmit={handleAfterSubmit}
          open={openModalAddPost}
          handleClose={handleCloseModal}
          title='TẠO BÀI ĐĂNG'
        />
      </div>

      <div className='tabs-post-manage-container'>
        <Tabs className='tabs-post-manage' defaultActiveKey='tab-publish' items={items} onChange={onChangeTab} />
        <TableCustom isSubmit={isSubmit} tabKey={tabKey} />
      </div>
    </div>
  )
}

export default PostManagePage
