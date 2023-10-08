import { Col, Input, Row, Select, Space, Table, Tabs, Tag, Tooltip } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import { ColumnsType } from 'antd/es/table'
import { BiBlock } from 'react-icons/bi'
import { BsFillEyeFill } from 'react-icons/bs'
import { CgUnblock } from 'react-icons/cg'

import { FiSearch } from 'react-icons/fi'
import { FaHistory } from 'react-icons/fa'
import ModalBlockAccount from './components/ModalBlockAccount'
import { useState } from 'react'
interface DataType {
  key: string
  name: string
  email: string
  signUpDate: string
  signInRecent: string
  status: string | number
}
const UsersManage = () => {
  const [openModalBlockAccount, setOpenModalBlockAccount] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const onChangeTab = (key: string) => {
    console.log(key)
  }

  const handleOpenModalBlockAccount = (id: string) => {
    setSelectedAccountId(id)
    setOpenModalBlockAccount(true)
  }
  const items: TabsProps['items'] = [
    {
      key: 'tab-employer-manage',
      label: <div className='tab-item'>Nhà tuyển dụng</div>,
      children: <></>
    },
    {
      key: 'tab-candidate-manage',
      label: <div className='tab-item'>Người tìm việc</div>,
      children: <></>
    }
  ]
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      render: (value, _) => <span key={value}>{`USER_${value}`}</span>
    },
    {
      ellipsis: true,
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      ellipsis: true,
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      ellipsis: true,
      title: 'Ngày đăng ký',
      dataIndex: 'signUpDate',
      key: 'signUpDate'
    },
    {
      ellipsis: true,
      title: 'Đăng nhập gần đây',
      key: 'signInRecent',
      dataIndex: 'signInRecent'
    },
    {
      ellipsis: true,
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, { status }) => (
        <>
          {status === 'Đã khóa' && <Tag color={'red'}>{status}</Tag>}
          {status === 'Online' && <Tag color={'green'}>{status}</Tag>}
          {status === 'Offline' && <Tag color={'gray'}>{status}</Tag>}
        </>
      )
    },
    {
      ellipsis: true,
      title: 'Xử lý',
      key: 'action',
      fixed: 'right',
      align: 'left',
      render: (_, record) => (
        <Space size='middle'>
          {/* <Tooltip title='Chi tiết'>
            <a>
              <BsFillEyeFill />
            </a>
          </Tooltip> */}

          {record.status !== 'Đã khóa' ? (
            <Tooltip title='Khóa tài khoản'>
              <a onClick={() => handleOpenModalBlockAccount(record.key)}>
                <BiBlock />
              </a>
            </Tooltip>
          ) : (
            <Tooltip title='Bỏ khóa tài khoản'>
              <a>
                <CgUnblock />
              </a>
            </Tooltip>
          )}
          <Tooltip title='Lịch sử hoạt động'>
            <a>
              <FaHistory />
            </a>
          </Tooltip>
        </Space>
      )
    }
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      email: 'font@gmail.com',
      signUpDate: '26/09/2023',
      signInRecent: '26/09/2023',
      status: 'Đã khóa'
    },
    {
      key: '2',
      name: 'Jim Green',
      email: 'font1@gmail.com',
      signUpDate: '26/09/2023',
      signInRecent: '26/09/2023',
      status: 'Online'
    },
    {
      key: '3',
      name: 'Joe Black',
      email: 'font2@gmail.com',
      signUpDate: '26/09/2023',
      signInRecent: '26/09/2023',
      status: 'Offline'
    }
  ]

  return (
    <div className='admin-users-manage-container'>
      <div className='title'>Quản lý tài khoản</div>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='1' items={items} />
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={16} xs={24}>
            <Input className='input-search-user' size='large' placeholder='Email, id' prefix={<FiSearch />} />
          </Col>
          <Col md={4} sm={7} xs={24}>
            <Select
              size='large'
              style={{ width: '100%' }}
              defaultValue='Tất cả'
              options={[{ value: 'Tất cả' }, { value: 'Đã khóa' }, { value: 'Online' }, { value: 'Offline' }]}
            />
          </Col>
        </Row>

        <Table className='table-custom users-table' scroll={{ x: true }} columns={columns} dataSource={data} />
        <ModalBlockAccount
          selectedAccountId={selectedAccountId}
          open={openModalBlockAccount}
          handleCancel={() => setOpenModalBlockAccount(false)}
        />
      </div>
    </div>
  )
}

export default UsersManage