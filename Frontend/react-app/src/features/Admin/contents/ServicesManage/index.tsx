import { Button, Col, Row, Select, Space, Table, Tabs, Tag, Tooltip } from 'antd'

import '../PostReviewManage/style.scss'
import './style.scss'
import '../UsersManage/style.scss'

import { ColumnsType } from 'antd/es/table'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'

import { AiFillLock, AiFillPlusCircle } from 'react-icons/ai'
import { TabsProps } from 'antd/lib'
import { FaTrashRestoreAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ModalCreatePackage from '../../components/ModalCreatePackage'
import apiPackage, { RequestFilterPackageAdminType } from '~/api/package.api'
import { BiWorld } from 'react-icons/bi'
import { toast } from 'react-toastify'
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

const ServicesManage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [listServices, setListServices] = useState<DataType[]>([])
  const [idDetail, setIdDetail] = useState('')
  const [currentPage, setCurentPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [status, setStatus] = useState('all')
  const [typePackage, setTypePackage] = useState('all')
  const limit = 5
  useEffect(() => {
    setCurentPage(1)
    fetchData()
  }, [status, typePackage])
  useEffect(() => {
    if (isSubmit) {
      fetchData()
      setIsSubmit(false)
    }
  }, [isSubmit])
  const fetchData = async (page?: string) => {
    let request: RequestFilterPackageAdminType = {
      limit: limit.toString(),
      page: page ? page : '1',
      sort_by_date: '1',
      status: status === 'all' ? '' : status,
      type: typePackage === 'all' ? '' : typePackage
    }
    await apiPackage.getAllPackageForAdmin(request).then((rs) => {
      setTotal(rs.result.total)
      const listTemp = rs.result.pks.map((service: AnyType) => {
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

      setListServices(listTemp)
    })
  }
  const handleActivePackage = async (id: string) => {
    await apiPackage.activePackage(id).then(async () => {
      toast.success(`Gói dịch vụ #SV_${id.slice(-5).toUpperCase()} đã được kích hoạt`)
      setCurentPage(1)
      await fetchData()
    })
  }
  const handleArchivePackage = async (id: string) => {
    await apiPackage.archivePackage(id).then(async () => {
      toast.success(`Gói dịch vụ #SV_${id.slice(-5).toUpperCase()} đã được ẩn`)
      setCurentPage(1)
      await fetchData()
    })
  }
  const handleDeletePackage = async (id: string) => {
    await apiPackage.deletedPackage(id).then(async () => {
      toast.success(`Gói dịch vụ #SV_${id.slice(-5).toUpperCase()} được xóa thành công`)
      setCurentPage(1)
      await fetchData()
    })
  }
  const handleChangePage = async (page: any) => {
    setCurentPage(page)
    await fetchData(page)
  }
  const handleOpenDetail = (id: string) => {
    setIdDetail(id)
    setIsOpenModal(true)
  }
  const handleOpenModal = () => {
    setIsOpenModal(true)
  }
  const handleAfterSubmit = () => {
    setIsSubmit(true)
    setIsOpenModal(false)
    setIdDetail('')
  }
  const handleCloseModal = () => {
    setIdDetail('')
    setIsSubmit(false)
    setIsOpenModal(false)
  }
  const onChangeTab = (key: string) => {
    setStatus(key)
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
      render: (_, record) => <span>{record.type === 'BANNER' ? `${record.timeUse} ngày` : '_'}</span>
    },
    {
      ellipsis: true,
      title: 'Số bài đăng',
      dataIndex: 'totalPosts',
      key: 'totalPosts',
      render: (_, record) => <span>{record.type === 'POST' ? record.totalPosts : '_'}</span>
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
      align: 'left',
      render: (_, record) => (
        <Space size={'middle'} style={{ textAlign: 'center' }}>
          <Tooltip title='Chi tiết'>
            <a
              onClick={() => handleOpenDetail(record.id)}
              style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
            >
              <BsFillEyeFill />
            </a>
          </Tooltip>

          {record.status === 'ACTIVE' && (
            <>
              <Tooltip title='Ẩn'>
                <a
                  onClick={() => handleArchivePackage(record.id)}
                  style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <AiFillLock />
                </a>
              </Tooltip>
              <Tooltip title='Xóa'>
                <a
                  onClick={() => handleDeletePackage(record.id)}
                  style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <BsFillTrashFill />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === 'ARCHIVE' && (
            <>
              <Tooltip title='Công khai'>
                <a
                  onClick={() => handleActivePackage(record.id)}
                  style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <BiWorld />
                </a>
              </Tooltip>
              <Tooltip title='Xóa'>
                <a
                  onClick={() => handleDeletePackage(record.id)}
                  style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <BsFillTrashFill />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === 'DELETED' && (
            <Tooltip title='Khôi phục'>
              <a
                onClick={() => handleArchivePackage(record.id)}
                style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
              >
                <FaTrashRestoreAlt />
              </a>
            </Tooltip>
          )}
        </Space>
      )
    }
  ]
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: <div className='tab-item'>Tất cả</div>,
      children: <></>
    },
    {
      key: 'ACTIVE',
      label: <div className='tab-item'>Hoạt động</div>,
      children: <></>
    },
    {
      key: 'ARCHIVE',
      label: <div className='tab-item'>Ẩn</div>,
      children: <></>
    },
    {
      key: 'DELETED',
      label: <div className='tab-item'>Đã xóa</div>,
      children: <></>
    }
  ]
  return (
    <div className='services-manage-page-container admin-users-manage-container'>
      <div className='title'>Quản lý gói dịch vụ</div>
      <ModalCreatePackage
        idPackage={idDetail}
        handleAfterSubmit={handleAfterSubmit}
        open={isOpenModal}
        handleClose={handleCloseModal}
      />
      <Button onClick={handleOpenModal} className='btn-add' size='large' icon={<AiFillPlusCircle />}>
        Tạo mới
      </Button>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='tab-all' items={items} />
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          {/* <Col md={8} sm={24} xs={24}>
            <Input  className='input-search-services' size='large' placeholder='ID, tên dịch vụ' prefix={<FiSearch />} />
          </Col> */}
          <Col md={4} sm={7} xs={11}>
            <Select
              onChange={(value) => setTypePackage(value)}
              size='large'
              style={{ width: '100%' }}
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả loại' },
                { value: 'POST', label: 'Đăng bài' },
                { value: 'BANNER', label: 'Quảng cáo' }
              ]}
            />
          </Col>
        </Row>

        <Table
          rowKey={'id'}
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={listServices}
          pagination={{ current: currentPage, total: total, pageSize: limit, onChange: handleChangePage }}
        />
      </div>
    </div>
  )
}

export default ServicesManage
