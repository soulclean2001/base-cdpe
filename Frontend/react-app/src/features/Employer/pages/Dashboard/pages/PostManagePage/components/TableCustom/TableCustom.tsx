import { Button, Col, Input, Row, Select, Space, Table } from 'antd'
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import './style.scss'
import { BsFillEyeFill, BsPencilSquare, BsSearch } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import ModalInfoPost from '../../../../components/ModalInfoPost/ModalInfoPost'
import { DatePicker } from 'antd'
import { BiWorld } from 'react-icons/bi'
import { AiFillLock } from 'react-icons/ai'
// import viVN from 'antd/es/locale/vi_VN'

const { RangePicker } = DatePicker
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
  lastedTimeApply: string
  acceptedStatus: string
  publicStatus: string
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
    lastedTimeApply: '30/08/2023 20:51:23',
    acceptedStatus: 'approved',
    publicStatus: 'publish',
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
    lastedTimeApply: '29/08/2023 20:51:23',
    acceptedStatus: 'pending',
    publicStatus: 'publish',
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
    lastedTimeApply: '31/08/2023 20:51:23',
    acceptedStatus: 'rejected',
    publicStatus: 'hidden',
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
    lastedTimeApply: '1/09/2023 20:51:23',
    acceptedStatus: 'unApproved',
    publicStatus: 'hidden',
    quantityCVApply: 120
  }
]

const TableCustom = (props: any) => {
  const { tabKey } = props
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({})

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('log data', pagination, filters, sorter)
    setSortedInfo(sorter as SorterResult<DataType>)
  }

  // const clearAll = () => {
  //   setSortedInfo({})
  // }

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
      title: 'Hạn nộp CV',
      dataIndex: 'lastedTimeApply',
      key: 'lastedTimeApply',
      sorter: (a, b) => a.lastedTimeApply.localeCompare(b.lastedTimeApply),
      sortOrder: sortedInfo.columnKey === 'lastedTimeApply' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    // {
    //   title: 'Hồ sơ ứng tuyển',
    //   dataIndex: 'quantityCVApply',
    //   key: 'quantityCVApply',
    //   sorter: (a, b) => a.quantityCVApply - b.quantityCVApply,
    //   sortOrder: sortedInfo.columnKey === 'quantityCVApply' ? sortedInfo.order : null,
    //   ellipsis: true,
    //   showSorterTooltip: false
    // },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <a onClick={() => setOpenModalInfo(true)}>
            <BsFillEyeFill />
          </a>
          {/* <a>
            <BsPencilSquare />
          </a> */}
          <a>
            <MdDelete />
          </a>
          {/* {tabKey === 'tab-publish' && (
            <a>
              <AiFillLock />
            </a>
          )}
          {tabKey === 'tab-hide' && (
            <a>
              <BiWorld />
            </a>
          )} */}

          {item.publicStatus === 'publish' && (
            <a>
              <AiFillLock />
            </a>
          )}
          {item.publicStatus === 'hidden' && (
            <a>
              <BiWorld />
            </a>
          )}
        </div>
      ),
      showSorterTooltip: false
    }
  ]
  const hiddenColumn: ColumnsType<DataType> = [
    {
      title: 'Kiểm duyệt',
      dataIndex: 'acceptedStatus',
      key: 'acceptedStatus',
      sorter: (a, b) => a.acceptedStatus.localeCompare(b.acceptedStatus),
      sortOrder: sortedInfo.columnKey === 'acceptedStatus' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    }
  ]
  const anotherColumns: ColumnsType<DataType> = [
    {
      title: 'Hiển thị',
      dataIndex: 'publicStatus',
      key: 'publicStatus',
      sorter: (a, b) => a.publicStatus.localeCompare(b.publicStatus),
      sortOrder: sortedInfo.columnKey === 'publicStatus' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    }
  ]
  // const [columnsState, setColumnState] = useState<ColumnsType<DataType>>(columns)
  const [openModalInfo, setOpenModalInfo] = useState(false)
  const [dataRowSelected, setDataRowSelected] = useState<DataType>()
  const [idPost, setIdPost] = useState<string>()
  useEffect(() => {
    console.log('data row selected', dataRowSelected)
  }, [dataRowSelected])
  // useEffect(() => {
  //   handleSetColumnTable()
  // }, [tabKey])
  const handleSetColumnTable = () => {
    if (tabKey === 'tab-publish') {
      return columns
    }
    if (tabKey === 'tab-hide') {
      const hideTemp: ColumnsType<DataType> = [
        ...columns.slice(0, columns.length - 1),
        hiddenColumn[0],
        ...columns.slice(columns.length - 1, columns.length)
      ]

      // setColumnState(hideTemp)
      return hideTemp
    }
    if (tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') {
      const anotherTemp: ColumnsType<DataType> = [
        ...columns.slice(0, columns.length - 1),
        hiddenColumn[0],
        anotherColumns[0],
        ...columns.slice(columns.length - 1, columns.length)
      ]
      // setColumnState(anotherTemp)
      return anotherTemp
    }
  }
  const handleCloseModalInfo = () => {
    setOpenModalInfo(false)
  }
  return (
    <>
      <ModalInfoPost idPost={idPost} open={openModalInfo} handleClose={handleCloseModalInfo} />

      <Row style={{ width: '100%', marginBottom: '16px', gap: '10px' }}>
        <Col md={6} sm={11} xs={24}>
          <Input style={{ width: '95%' }} size='large' placeholder='Tìm theo tên, id bài đăng' prefix={<BsSearch />} />
        </Col>
        <Col md={6} sm={11} xs={24}>
          <RangePicker
            style={{ width: '95%' }}
            size='large'
            placeholder={['Từ ngày', 'Đến ngày']}
            format='DD-MM-YYYY'
            // locale={viVN}
          />
        </Col>
        {tabKey !== 'tab-publish' && (
          <Col md={5} sm={11} xs={24}>
            <Select
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái kiểm duyệt' },
                { value: 0, label: 'Chờ duyệt' },
                { value: 1, label: 'Chấp nhận' },
                { value: 2, label: 'Từ chối' }
              ]}
            />
          </Col>
        )}
        {(tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') && (
          <Col md={5} sm={11} xs={24}>
            <Select
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái hiển thị' },
                { value: 0, label: 'Công khai' },
                { value: 1, label: 'Riêng tư' }
              ]}
            />
          </Col>
        )}
      </Row>

      <Table
        className='table-custom'
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => {
            setIdPost(record.id)
            setDataRowSelected(record)
          }
        })}
        columns={handleSetColumnTable()}
        dataSource={data}
        onChange={handleChange}
        pagination={{ pageSize: 2 }}
      />
    </>
  )
}

export default TableCustom
