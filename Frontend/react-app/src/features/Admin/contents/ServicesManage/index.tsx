import { Button, Col, Input, Row, Select, Space, Table, Tabs, Tag } from 'antd'

import '../PostReviewManage/style.scss'
import './style.scss'
import '../UsersManage/style.scss'
import { FiSearch } from 'react-icons/fi'
import { ColumnsType } from 'antd/es/table'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'

import { AiFillEdit, AiFillLock, AiFillPlusCircle } from 'react-icons/ai'
import { TabsProps } from 'antd/lib'
import { FaTrashRestoreAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ModalCreatePackage from '../../components/ModalCreatePackage'
import apiPackage from '~/api/package.api'
import { BiWorld } from 'react-icons/bi'
interface DataType {
  id: string
  nameService: string
  timeUse?: number
  totalPosts?: number
  type: string
  price: string | number
  updateDate: string
  status: string
}
interface AnyType {
  [key: string]: any
}
// const data: DataType[] = [
//   {
//     id: '1',
//     nameService: 'Đăng Tuyển 30 ngày',
//     validityPeriod: '30 ngày',
//     price: 400000,
//     updateDate: '26/09/2023',
//     status: 'Hoạt động'
//   },
//   {
//     id: '2',
//     nameService: 'Công ty hàng đầu',
//     validityPeriod: '1 năm',
//     price: 440000,
//     updateDate: '26/09/2023',
//     status: 'Hoạt động'
//   },
//   {
//     id: '3',
//     nameService: 'Xem thông tin liên hệ',
//     validityPeriod: '30 ngày',
//     price: 500000,
//     updateDate: '26/09/2023',
//     status: 'Đã xóa'
//   }
// ]

const ServicesManage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [listServices, setListServices] = useState<DataType[]>([])
  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    if (isSubmit) {
      fetchData()
      setIsSubmit(false)
    }
  }, [isSubmit])
  const fetchData = async (page?: string) => {
    await apiPackage.getAllPackageForAdmin().then((rs) => {
      console.log('rs', rs)
      const listTemp = rs.result.map((service: AnyType) => {
        if (service.type === 'POST')
          return {
            id: service._id,
            nameService: service.title,
            totalPosts: service.value,
            updateDate: service.updated_at,
            price: service.price,
            type: service.type,
            status: service.status
          }
        return {
          id: service._id,
          nameService: service.title,
          timeUse: service.number_of_days_to_expire,
          updateDate: service.updated_at,
          price: service.price,
          type: service.type,
          status: service.status
        }
      })
      console.log('listTemp', listTemp)
      setListServices(listTemp)
    })
  }
  const handleActivePackage = async (id: string) => {
    await apiPackage.activePackage(id).then(async (rs) => {
      console.log('rs active', rs)
      await fetchData()
    })
  }
  const handleOpenModal = () => {
    setIsOpenModal(true)
  }
  const handleAfterSubmit = () => {
    setIsSubmit(true)
    setIsOpenModal(false)
  }
  const handleCloseModal = () => {
    setIsSubmit(false)
    setIsOpenModal(false)
  }
  const onChangeTab = (key: string) => {
    console.log(key)
  }
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value, _) => <span key={value}>{`#SV_${value.slice(-5).toUpperCase()}`}</span>
    },
    {
      ellipsis: true,
      title: 'Tên dịch vụ',
      dataIndex: 'nameService',
      key: 'nameService'
    },
    // {
    //   ellipsis: true,
    //   title: 'Loại dịch vụ',
    //   dataIndex: 'type',
    //   key: 'type'
    // },
    {
      ellipsis: true,
      title: 'Hiệu lực',
      dataIndex: 'timeUse',
      key: 'timeUse',
      render: (_, record) => <span>{record.type === 'BANNER' ? `${record.timeUse} ngày` : ''}</span>
    },
    {
      ellipsis: true,
      title: 'Số bài đăng',
      dataIndex: 'totalPosts',
      key: 'totalPosts',
      render: (_, record) => <span>{record.type === 'POST' ? record.totalPosts : ''}</span>
    },
    {
      ellipsis: true,
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (value, _) => <span key={value}>{value.toLocaleString('vi', { currency: 'VND' })}</span>
    },
    {
      ellipsis: true,
      title: 'Cập nhật gần nhất',
      key: 'updateDate',
      dataIndex: 'updateDate',
      render: (value, _) => <span key={value}>{value.slice(0, 10)}</span>
    },

    {
      ellipsis: true,
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, { status }) => (
        <>
          {status === 'ACTIVE' && <Tag color={'green'}>Hoạt động</Tag>}
          {status === 'ARCHIVE' && <Tag color={'grey'}>Ẩn</Tag>}
          {status === 'DELETED' && <Tag color={'red'}>Đã xóa</Tag>}
        </>
      )
    },
    {
      ellipsis: true,
      title: 'Xử lý',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size={'middle'} style={{ textAlign: 'center' }}>
          <a style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <BsFillEyeFill />
          </a>

          {record.status === 'ACTIVE' && (
            <>
              <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <AiFillLock />
              </a>
              <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <BsFillTrashFill />
              </a>
            </>
          )}
          {record.status === 'ARCHIVE' && (
            <>
              <a
                onClick={() => handleActivePackage(record.id)}
                style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
              >
                <BiWorld />
              </a>
              <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <BsFillTrashFill />
              </a>
            </>
          )}
          {record.status === 'DELETED' && (
            <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <FaTrashRestoreAlt />
            </a>
          )}
        </Space>
      )
    }
  ]
  const items: TabsProps['items'] = [
    {
      key: 'tab-active',
      label: <div className='tab-item'>Hoạt động</div>,
      children: <></>
    },
    {
      key: 'tab-archive',
      label: <div className='tab-item'>Ẩn</div>,
      children: <></>
    },
    {
      key: 'tab-deleted',
      label: <div className='tab-item'>Đã xóa</div>,
      children: <></>
    }
  ]
  return (
    <div className='services-manage-page-container admin-users-manage-container'>
      <div className='title'>Quản lý gói dịch vụ</div>
      <ModalCreatePackage handleAfterSubmit={handleAfterSubmit} open={isOpenModal} handleClose={handleCloseModal} />
      <Button onClick={handleOpenModal} className='btn-add' size='large' icon={<AiFillPlusCircle />}>
        Thêm mới
      </Button>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='1' items={items} />
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={24} xs={24}>
            <Input className='input-search-services' size='large' placeholder='ID, tên dịch vụ' prefix={<FiSearch />} />
          </Col>
          {/* <Col md={4} sm={7} xs={11}>
            <Select
              size='large'
              style={{ width: '100%' }}
              defaultValue='Thời gian hiệu lực'
              options={[{ value: 'Tất cả thời gian' }, { value: '30 ngày' }, { value: '90 ngày' }, { value: '1 năm' }]}
            />
          </Col> */}
        </Row>

        <Table
          rowKey={'id'}
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={listServices}
        />
      </div>
    </div>
  )
}

export default ServicesManage
