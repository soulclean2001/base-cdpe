import { Button, Space, Table } from 'antd'
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import './style.scss'
import { BsFillEyeFill, BsPencilSquare } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import ModalInfoPost from '../ModalInfoPost/ModalInfoPost'
interface DataType {
  id: string
  key: string
  nameJob: string
  level: string
  typeJob: string
  career: string
  salary: string
  province: string
  createdTime: string
  author: string
  quantityCVApply: number
}

const data: DataType[] = [
  {
    id: 'id1',
    key: '1',
    nameJob: 'UX UI Designer',
    level: 'intern lỏ',
    typeJob: 'Toàn thời gian',
    career: 'Thiết kế website',
    salary: '100$-500$',
    province: 'TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    author: 'fontt0169@gmail.com',
    quantityCVApply: 90
  },
  {
    id: 'id2',
    key: '2',
    nameJob: 'Fresher Java Backend',
    level: 'Thử việc',
    typeJob: 'Toàn thời gian',
    career: 'Lập trình website',
    salary: '300$-700$',
    province: 'TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    author: 'fontt0169@gmail.com',
    quantityCVApply: 44
  },
  {
    id: 'id3',
    key: '3',
    nameJob: 'Senior FE',
    level: 'Nhân viên',
    typeJob: 'Toàn thời gian',
    career: 'Lập trình website',
    salary: '1000$-3000$',
    province: 'Hà Nội',
    createdTime: '27/08/2023 20:51:23',
    author: 'fontt0169@gmail.com',
    quantityCVApply: 90
  },
  {
    id: 'id4',
    key: '4',
    nameJob: 'Phục vụ quán cafe',
    level: 'nhân viên',
    typeJob: 'Toàn thời gian / Bán thời gian',
    career: 'Dịch vụ ăn uống',
    salary: '20k/1h',
    province: 'TP. Đà Nẵng',
    createdTime: '27/08/2023 20:51:23',
    author: 'fontt0169@gmail.com',
    quantityCVApply: 120
  }
]

const TableCustom = () => {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({})

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('log data', pagination, filters, sorter)
    setSortedInfo(sorter as SorterResult<DataType>)
  }

  const clearAll = () => {
    setSortedInfo({})
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Chức danh',
      dataIndex: 'nameJob',
      key: 'nameJob',
      sorter: (a, b) => a.nameJob.localeCompare(b.nameJob),
      sortOrder: sortedInfo.columnKey === 'nameJob' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'level',
      key: 'level',
      sorter: (a, b) => a.level.localeCompare(b.level),
      sortOrder: sortedInfo.columnKey === 'level' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Loại việc làm',
      dataIndex: 'typeJob',
      key: 'typeJob',
      sorter: (a, b) => a.typeJob.localeCompare(b.typeJob),
      sortOrder: sortedInfo.columnKey === 'typeJob' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Ngành nghề',
      dataIndex: 'career',
      key: 'career',
      sorter: (a, b) => a.career.localeCompare(b.career),
      sortOrder: sortedInfo.columnKey === 'career' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Mức lương',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary.localeCompare(b.salary),
      sortOrder: sortedInfo.columnKey === 'salary' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Khu vực',
      dataIndex: 'province',
      key: 'province',
      sorter: (a, b) => a.province.localeCompare(b.province),
      sortOrder: sortedInfo.columnKey === 'province' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      sortOrder: sortedInfo.columnKey === 'createdTime' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Người đăng',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
      sortOrder: sortedInfo.columnKey === 'author' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Hồ sơ ứng tuyển',
      dataIndex: 'quantityCVApply',
      key: 'quantityCVApply',
      sorter: (a, b) => a.quantityCVApply - b.quantityCVApply,
      sortOrder: sortedInfo.columnKey === 'quantityCVApply' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: () => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <a onClick={() => setOpenModalInfo(true)}>
            <BsFillEyeFill />
          </a>
          <a>
            <BsPencilSquare />
          </a>
          <a>
            <MdDelete />
          </a>
        </div>
      ),
      showSorterTooltip: false
    }
  ]
  const [openModalInfo, setOpenModalInfo] = useState(false)
  const [dataRowSelected, setDataRowSelected] = useState<DataType>()
  const [idPost, setIdPost] = useState<string>()
  useEffect(() => {
    console.log('data row selected', dataRowSelected)
  }, [dataRowSelected])
  const handleCloseModalInfo = () => {
    setOpenModalInfo(false)
  }
  return (
    <>
      <ModalInfoPost idPost={idPost} open={openModalInfo} handleClose={handleCloseModalInfo} />
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear sorters</Button>
      </Space>
      <Table
        className='table-custom'
        // style={{ maxWidth: '70vw', overflow: 'auto' }}
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => {
            setIdPost(record.id)
            setDataRowSelected(record)
          }
        })}
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        pagination={{ pageSize: 2 }}
      />
    </>
  )
}

export default TableCustom
