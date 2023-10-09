import { AiFillEdit, AiFillPlusCircle } from 'react-icons/ai'
import './style.scss'
import { Space, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { BsFillTrashFill } from 'react-icons/bs'
import ModalWorkLocation from '../../components/ModalWorkLocation'
import { useState } from 'react'

interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}
const data: WorkingLocation[] = [
  {
    lat: 1,
    lon: 1,
    branch_name: 'VP 1',
    address: 'F4',
    district: 'GV',
    city_name: 'HCM'
  },
  {
    lat: 1,
    lon: 1,
    branch_name: 'VP 2',
    address: 'F2',
    district: 'GV2',
    city_name: 'HCM2'
  },
  {
    lat: 1,
    lon: 1,
    branch_name: 'VP 3',
    address: 'F42',
    district: 'GV2',
    city_name: 'HCM2'
  }
]
const WorkLocationPage = () => {
  const [openModalWorkLocation, setOpenModalWorkLocation] = useState(false)
  const columns: ColumnsType<WorkingLocation> = [
    {
      ellipsis: true,
      title: 'Tên văn phòng',
      dataIndex: 'branch_name',
      key: 'branch_name'
    },
    {
      ellipsis: true,
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address'
    },
    {
      ellipsis: true,
      title: 'Quận/ huyện',
      dataIndex: 'district',
      key: 'district'
    },
    {
      ellipsis: true,
      title: 'Tỉnh thành',
      dataIndex: 'city_name',
      key: 'city_name'
    },

    {
      ellipsis: true,
      title: 'Xử lý',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size='middle'>
          <Tooltip title='Chỉnh sửa'>
            <a>
              <AiFillEdit />
            </a>
          </Tooltip>
          <Tooltip title='Xóa'>
            <a>
              <BsFillTrashFill />
            </a>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className='work-location-page-container'>
      <div className='title'>Địa điểm làm việc</div>
      <div className='work-location-content-wapper'>
        <ModalWorkLocation open={openModalWorkLocation} handleClose={() => setOpenModalWorkLocation(false)} />
        <div className='btn-container'>
          <a onClick={() => setOpenModalWorkLocation(true)}>
            <AiFillPlusCircle /> Tạo địa điểm làm việc
          </a>
        </div>
        <Table
          rowKey='branch_name'
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  )
}

export default WorkLocationPage