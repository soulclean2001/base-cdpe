import { Button, Col, Row, Tabs, TabsProps } from 'antd'
import './style.scss'
import { AiFillPlusCircle } from 'react-icons/ai'
import TableCustom from '../../components/TableCustom/TableCustom'
const PostManagePage = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'tab-publish',
      label: <div className='tab-item'>Đang Hiển Thị</div>,
      children: <TableCustom />
    },
    {
      key: 'tab-wait-accept',
      label: <div className='tab-item'>Đang Chờ Duyệt</div>,
      children: 'Content of Tab Pane 2'
    },
    {
      key: 'tab-hide',
      label: <div className='tab-item'>Đang Ẩn</div>,
      children: 'Content of Tab Pane 2'
    },
    {
      key: 'tab-over-time-7-day',
      label: <div className='tab-item'>Sắp Hết Hạn Trong 7 Ngày</div>,
      children: 'Content of Tab Pane 3'
    },
    {
      key: 'tab-over-time',
      label: <div className='tab-item'>Đã Hết Hạn</div>,
      children: 'Content of Tab Pane 3'
    }
  ]
  return (
    <div className='post-manage-page-container'>
      <div className='title-container'>
        <div className='post-manage-title'>QUẢN LÝ BÀI ĐĂNG</div>
      </div>
      <div className='show-modal-add-post-container'>
        <Button size='large' icon={<AiFillPlusCircle />}>
          Tạo bài đăng
        </Button>
      </div>

      <div className='tabs-post-manage-container'>
        <Tabs className='tabs-post-manage' defaultActiveKey='1' items={items} onChange={onChange} />
      </div>
    </div>
  )
}

export default PostManagePage
