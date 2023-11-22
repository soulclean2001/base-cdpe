import { Col, Input, Row, Select, Space, Table, Tabs, Tag, Tooltip } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import { ColumnsType } from 'antd/es/table'
import { BiBlock } from 'react-icons/bi'

import { CgUnblock } from 'react-icons/cg'

import { FiSearch } from 'react-icons/fi'
// import { FaHistory } from 'react-icons/fa'
import ModalBlockAccount from './components/ModalBlockAccount'
import { useState, useEffect } from 'react'
import apiAdmin, { SearchUserFilter } from '~/api/admin.api'
import { UserVerifyStatus } from '~/types/user.type'

interface DataType {
  id: string
  name: string
  email: string
  signUpDate: string
  updateDate: string
  status: string | number
  verify: number
}
interface UserType {
  [key: string]: any
}
const UsersManage = () => {
  const [openModalBlockAccount, setOpenModalBlockAccount] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [isBanned, setIsBanned] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [listUsers, setListUsers] = useState<DataType[]>([])
  const [role, setRole] = useState('employer')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [verify, setVerify] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(1)
  const limit = 5
  useEffect(() => {
    setCurrentPage(1)
    fetchGetUsers()
  }, [role, content, status, verify])
  useEffect(() => {
    if (isSubmit) {
      fetchGetUsers(currentPage.toString())
      setIsSubmit(false)
    }
  }, [isSubmit])
  const fetchGetUsers = async (page?: string) => {
    let request: SearchUserFilter = {
      limit: limit.toString(),
      page: page ? page : '1',
      content: content,
      status: status,
      verify: verify,
      type: role
    }
    await apiAdmin.getUsersByAdmin(request).then((rs) => {
      setTotal(rs.result.total)
      let listTemp = rs.result.employers.map((user: UserType) => {
        return {
          id: user._id,
          name: user.role === 2 ? user.name : user.role === 1 ? user.name : '_',
          email: user.email,
          signUpDate: user.created_at.slice(0, 10),
          updateDate: user.updated_at.slice(0, 10),
          status: user.status !== 1 ? Object.values(UserVerifyStatus)[user.verify] : 'Đã khóa',
          verify: user.verify
        }
      })
      setListUsers(listTemp)
    })
  }
  const handleChangeStatus = (status: string) => {
    if (status === 'all') {
      setStatus('')
      setVerify('')
    }
    if (status === '2') {
      setStatus('')
      setVerify('2')
    }
    if (status === '1') {
      setStatus('0')
      setVerify('1')
    }
    if (status === '0') {
      setStatus('0')
      setVerify('0')
    }
  }
  const handleChangePage = async (page: any) => {
    setCurrentPage(page)
    await fetchGetUsers(page.toString())
  }
  const handleOpenModalBlockAccount = (id: string, verify: number) => {
    if (verify === 2) setIsBanned(true)
    else setIsBanned(false)
    setSelectedAccountId(id)
    setOpenModalBlockAccount(true)
  }
  const handleAfterSubmit = () => {
    setIsSubmit(true)
    setOpenModalBlockAccount(false)
  }
  const onChangeTab = (key: string) => {
    setRole(key)
  }
  const items: TabsProps['items'] = [
    {
      key: 'employer',
      label: <div className='tab-item'>Nhà tuyển dụng</div>,
      children: <></>
    },
    {
      key: 'candidate',
      label: <div className='tab-item'>Người tìm việc</div>,
      children: <></>
    }
  ]
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value, _) => <span key={value}>{`#USER_${value.slice(-5).toUpperCase()}`}</span>
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
      title: 'Cập nhật gần đây',
      key: 'updateDate',
      dataIndex: 'updateDate'
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
          {status === 'Đã kích hoạt' && <Tag color={'green'}>{status}</Tag>}
          {status === 'Chưa kích hoạt' && <Tag color={'gray'}>{status}</Tag>}
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
          {record.verify > 0 && (
            <>
              {record.status !== 'Đã khóa' ? (
                <Tooltip title='Khóa tài khoản'>
                  <a onClick={() => handleOpenModalBlockAccount(record.id, record.verify)}>
                    <BiBlock />
                  </a>
                </Tooltip>
              ) : (
                <Tooltip title='Bỏ khóa tài khoản'>
                  <a onClick={() => handleOpenModalBlockAccount(record.id, record.verify)}>
                    <CgUnblock />
                  </a>
                </Tooltip>
              )}
              {/* <Tooltip title='Lịch sử hoạt động'>
            <a>
              <FaHistory />
            </a>
          </Tooltip> */}
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className='admin-users-manage-container'>
      <div className='title'>Quản lý tài khoản</div>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='1' items={items} />
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={16} xs={24}>
            <Input
              allowClear
              onChange={(e) => setContent(e.target.value)}
              className='input-search-user'
              size='large'
              placeholder='Email, tên'
              prefix={<FiSearch />}
            />
          </Col>
          <Col md={4} sm={7} xs={24}>
            <Tooltip title='Trạng thái'>
              <Select
                onChange={(value) => handleChangeStatus(value)}
                size='large'
                style={{ width: '100%' }}
                defaultValue='Tất cả'
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: '2', label: 'Đã khóa' },
                  { value: '1', label: 'Đã kích hoạt' },
                  { value: '0', label: 'Chưa kích hoạt' }
                ]}
              />
            </Tooltip>
          </Col>
        </Row>

        <Table
          rowKey={'id'}
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={listUsers}
          pagination={{ current: currentPage, total: total, pageSize: limit, onChange: handleChangePage }}
        />
        <ModalBlockAccount
          handleAfterSubmit={handleAfterSubmit}
          selectedAccountId={selectedAccountId}
          open={openModalBlockAccount}
          isBanned={isBanned}
          handleCancel={() => setOpenModalBlockAccount(false)}
        />
      </div>
    </div>
  )
}

export default UsersManage
