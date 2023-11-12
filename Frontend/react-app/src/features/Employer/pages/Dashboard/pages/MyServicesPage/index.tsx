import { Col, Input, Row, Select, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { MdPayments } from 'react-icons/md'
import { useEffect, useState } from 'react'
import apiPackage, { RequestFilterPackageOwnByMe } from '~/api/package.api'
import './style.scss'
import ModalCreatePackage from '~/features/Admin/components/ModalCreatePackage'
interface DataType {
  id: string
  nameService: string
  validityPeriod: string
  price: string | number
  activeDate: string
  expiryDate: string
  status: string
  idPackage: string
  stt: number
}
interface MyServiceType {
  [key: string]: any
}
const MyServicesPage = () => {
  const [listMyServices, setListMyServices] = useState<DataType[]>([])
  const limit = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [titlePackage, setTitlePackage] = useState('')
  const [status, setStatus] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [idPackage, setIdPackage] = useState('')

  const handleOpenModal = (id: string) => {
    setIdPackage(id)
    setIsOpenModal(true)
  }
  const handleCloseModal = () => {
    setIdPackage('')
    setIsOpenModal(false)
  }
  const handleChangePage = async (page: any) => {
    setCurrentPage(page)
    fetchGetMyServices(page)
  }
  useEffect(() => {
    setCurrentPage(1)
    fetchGetMyServices()
  }, [titlePackage, status])
  const fetchGetMyServices = async (page?: string) => {
    let request: RequestFilterPackageOwnByMe = {
      limit: limit.toString(),
      page: page ? page : '1',
      status: status,
      title: titlePackage
    }
    await apiPackage.getAllPackageByMe(request).then((rs) => {
      setTotal(rs.result.total)
      if (rs.result.packages) {
        let listTemp = rs.result.packages.map((pkg: MyServiceType, index: number) => {
          return {
            stt: index + 1,
            id: pkg._id,
            idPackage: pkg.package._id,
            nameService: `${pkg.package.title} x${pkg.quantity}`,
            validityPeriod:
              pkg.package.type === 'POST' ? 'Không giới hạn' : `${pkg.package.number_of_days_to_expire} ngày`,
            price: pkg.unit_price * pkg.quantity,
            activeDate: pkg.status.toString() === '0' ? pkg.updated_at.slice(0, 10) : '_',
            expiryDate: pkg.package.type === 'POST' ? 'Không giới hạn' : pkg.expired_at.slice(0, 10),
            status: pkg.package.type === 'BANNER' && new Date(pkg.expired_at) < new Date() ? '3' : pkg.status.toString()
          }
        })
        setListMyServices(listTemp)
      }

      console.log('rs', rs)
    })
  }

  const columns: ColumnsType<DataType> = [
    // {
    //   ellipsis: true,
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (value, _) => <span key={value}>{`#SV_${value.slice(-5).toUpperCase()}`}</span>
    // },
    {
      ellipsis: true,
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt'
    },
    {
      ellipsis: true,
      title: 'Tên dịch vụ',
      dataIndex: 'nameService',
      key: 'nameService'
    },
    // {
    //   ellipsis: true,
    //   title: 'Thời gian hiệu lực',
    //   dataIndex: 'validityPeriod',
    //   key: 'validityPeriod'
    // },
    {
      ellipsis: true,
      title: 'Thành tiền',
      dataIndex: 'price',
      key: 'price',
      render: (value, _) => <span key={value}>{value.toLocaleString('vi', { currency: 'VND' })}</span>
    },
    {
      ellipsis: true,
      title: 'Ngày kích hoạt',
      key: 'activeDate',
      dataIndex: 'activeDate'
    },
    {
      ellipsis: true,
      title: 'Ngày hết hạn',
      key: 'expiryDate',
      dataIndex: 'expiryDate'
    },

    {
      ellipsis: true,
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => (
        <>
          {record.status.toString() === '0' && <Tag color={'green'}>Đã kích hoạt</Tag>}
          {record.status.toString() === '1' && <Tag color={'orange'}>Chờ kích hoạt</Tag>}
          {record.status.toString() === '2' && <Tag color={'red'}>Đã hủy</Tag>}
          {record.status.toString() === '3' && <Tag color={'red'}>Hết hạn</Tag>}
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
          <a
            onClick={() => handleOpenModal(record.idPackage)}
            style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
          >
            <BsFillEyeFill />
          </a>

          {record.status === 'Hết hạn' && (
            <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <MdPayments />
            </a>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className='my-services-page-container'>
      <div className='admin-users-manage-container'>
        <div className='title'>Dịch vụ của tôi</div>
        <ModalCreatePackage
          idPackage={idPackage}
          open={isOpenModal}
          handleClose={handleCloseModal}
          roleType={'EMPLOYER_TYPE'}
        />
        <div className='content-wapper'>
          <Row style={{ gap: '10px', marginBottom: '20px' }}>
            <Col md={8} sm={11} xs={24}>
              <Input
                allowClear
                className='input-search-services'
                size='large'
                placeholder='Tên dịch vụ'
                prefix={<FiSearch />}
                onChange={(e) => setTitlePackage(e.target.value)}
              />
            </Col>
            <Col md={4} sm={11} xs={24}>
              <Select
                // allowClear
                defaultValue='all'
                size='large'
                style={{ width: '100%' }}
                showSearch
                onChange={(value) => setStatus(value === 'all' ? '' : value)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: '0', label: 'Đã kích hoạt' },
                  { value: '1', label: 'Chờ kích hoạt' },
                  { value: '2', label: 'Đã hủy' }
                ]}
              />
            </Col>
          </Row>

          <Table
            rowKey={'id'}
            className='table-custom users-table'
            scroll={{ x: true }}
            columns={columns}
            dataSource={listMyServices}
            pagination={{ current: currentPage, total: total, onChange: handleChangePage, pageSize: limit }}
          />
        </div>
      </div>
    </div>
  )
}

export default MyServicesPage
