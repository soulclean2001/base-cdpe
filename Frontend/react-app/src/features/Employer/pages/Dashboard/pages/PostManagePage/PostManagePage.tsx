import { Button, Tabs, TabsProps } from 'antd'
import './style.scss'
import { AiFillPlusCircle } from 'react-icons/ai'
import TableCustom from './components/TableCustom/TableCustom'
import { useState } from 'react'
import ModalInfoPost from '../../components/ModalInfoPost/ModalInfoPost'
const PostManagePage = () => {
  // const [tabKey, setTabKey] = useState('tab-publish')
  const onChangeTab = (key: string) => {
    console.log('tab key', key)
    // setTabKey(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'tab-publish',
      label: <div className='tab-item'>Công Khai</div>,
      children: <TableCustom tabKey={'tab-publish'} />
    },
    // {
    //   key: 'tab-wait-accept',
    //   label: <div className='tab-item'>Kiểm Duyệt</div>,
    //   children: 'Content of Tab Pane 2'
    // },
    {
      key: 'tab-hide',
      label: <div className='tab-item'>Riêng Tư</div>,
      children: <TableCustom tabKey={'tab-hide'} />
    },
    {
      key: 'tab-over-time-7-day',
      label: <div className='tab-item'>Sắp Hết Hạn Trong 7 Ngày</div>,
      children: <TableCustom tabKey={'tab-over-time-7-day'} />
    },
    {
      key: 'tab-over-time',
      label: <div className='tab-item'>Đã Hết Hạn</div>,
      children: <TableCustom tabKey={'tab-over-time'} />
    }
  ]
  const [openModalAddPost, setOpenModalAddPost] = useState(false)
  const handleCloseModal = () => {
    setOpenModalAddPost(false)
  }
  return (
    <div className='post-manage-page-container'>
      <div className='title-container'>
        <div className='post-manage-title'>QUẢN LÝ BÀI ĐĂNG</div>
      </div>
      <div className='show-modal-add-post-container'>
        <Button size='large' icon={<AiFillPlusCircle />} onClick={() => setOpenModalAddPost(true)}>
          Tạo bài đăng
        </Button>
        <ModalInfoPost open={openModalAddPost} handleClose={handleCloseModal} title='TẠO BÀI ĐĂNG' />
      </div>

      <div className='tabs-post-manage-container'>
        <Tabs className='tabs-post-manage' defaultActiveKey='tab-publish' items={items} onChange={onChangeTab} />
      </div>
    </div>
  )
}

export default PostManagePage
