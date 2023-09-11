import { Button, Dropdown, Menu, MenuProps, Space, Table, Tooltip } from 'antd'
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { AiFillEdit, AiFillPrinter } from 'react-icons/ai'
import { BiBlock, BiCommentError, BiSolidUserX } from 'react-icons/bi'
// import './style.scss'
import {
  BsClipboard2XFill,
  BsClipboardCheckFill,
  BsFillCheckCircleFill,
  BsFillEyeFill,
  BsPencilSquare
} from 'react-icons/bs'
import { FaUserCheck } from 'react-icons/fa'
import { FaClipboardQuestion, FaUserXmark } from 'react-icons/fa6'
import { FiMoreVertical } from 'react-icons/fi'
import { ImUserCheck } from 'react-icons/im'
import { IoMdMail } from 'react-icons/io'
import { MdCancel, MdConnectWithoutContact, MdDelete, MdWifiTetheringError } from 'react-icons/md'

interface DataType {
  id: string
  key: string
  nameJobSeeker: string
  email: string
  phoneNumber: string
  jobPosition: string
  addressOffice: string
  createdTime: string
  reviewTime: string | undefined
  status: string
}

const data: DataType[] = [
  {
    id: 'id1',
    key: '1',
    nameJobSeeker: 'Phan Thanh Phong Lỏ',
    email: 'fontt@gmail.com',
    phoneNumber: '0365887759',
    jobPosition: '#JOB01 - Intern Web',
    addressOffice: 'F4/2A Gò Vấp TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '28/08/2023 12:55:23',
    status: 'pending'
  },
  {
    id: 'id2',
    key: '2',
    nameJobSeeker: 'Trần Hiếu Minh Lỏ',
    email: 'hirosaki@gmail.com',
    phoneNumber: '0988888888',
    jobPosition: '#JOB02 - Fresher NodeJs',
    addressOffice: 'F4/2A Gò Vấp TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '',
    status: 'approved'
  },
  {
    id: 'id3',
    key: '3',
    nameJobSeeker: 'Trần Hiếu Lỏ',
    email: 'Zirosaki@gmail.com',
    phoneNumber: '0977777777',
    jobPosition: '#JOB02 Fresher NodeJs',
    addressOffice: 'F4/2A Gò Vấp TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '28/08/2023 20:51:23',
    status: 'reject'
  },
  {
    id: 'id4',
    key: '4',
    nameJobSeeker: 'Phong Phong',
    email: 'FFF@gmail.com',
    phoneNumber: '0966666666',
    jobPosition: '#JOB03 - Junior Java',
    addressOffice: 'F4/2A Gò Vấp TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '29/08/2023 20:51:23',
    status: 'potential'
  },
  {
    id: 'id5',
    key: '5',
    nameJobSeeker: 'Phong Thanhbb',
    email: 'bbbvv@gmail.com',
    phoneNumber: '0955555555',
    jobPosition: '#JOB03 - Senior HTML',
    addressOffice: 'F4/2A Bình Chánh TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '30/08/2023 20:51:23',
    status: 'interview'
  },
  {
    id: 'id6',
    key: '6',
    nameJobSeeker: 'Phong Thanhxx',
    email: 'bbbzx@gmail.com',
    phoneNumber: '0955555555',
    jobPosition: '#JOB03 - Senior HTML',
    addressOffice: 'F4/2A Bình Chánh TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '30/08/2023 20:51:23',
    status: 'hired'
  },
  {
    id: 'id7',
    key: '7',
    nameJobSeeker: 'Phong Thanhzz',
    email: 'bbbzz@gmail.com',
    phoneNumber: '0955555555',
    jobPosition: '#JOB03 - Senior HTML',
    addressOffice: 'F4/2A Bình Chánh TP. Hồ Chí Minh',
    createdTime: '27/08/2023 20:51:23',
    reviewTime: '30/08/2023 20:51:23',
    status: 'notcontactable'
  }
]

const TableApplied = () => {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({})

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('log data', pagination, filters, sorter)
    setSortedInfo(sorter as SorterResult<DataType>)
  }

  const clearAll = () => {
    setSortedInfo({})
  }
  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title='Gửi Mail'>
          <a style={{ color: '#1677ff' }}>
            <IoMdMail />
          </a>
        </Tooltip>
      ),
      key: '0'
    },
    {
      label: (
        <Tooltip title='In CV'>
          <a style={{ color: '#1677ff' }}>
            <AiFillPrinter />
          </a>
        </Tooltip>
      ),
      key: '1'
    },
    {
      label: (
        <Tooltip title='Hủy bỏ'>
          <a style={{ color: '#1677ff' }}>
            <MdDelete />
          </a>
        </Tooltip>
      ),
      key: '2'
    },
    {
      label: (
        <Tooltip title='Thêm vào sổ đen'>
          <a style={{ color: '#1677ff' }}>
            <BiBlock />
          </a>
        </Tooltip>
      ),
      key: '3'
    }
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên ứng viên',
      dataIndex: 'nameJobSeeker',
      key: 'nameJobSeeker',
      sorter: (a, b) => a.nameJobSeeker.localeCompare(b.nameJobSeeker),
      sortOrder: sortedInfo.columnKey === 'nameJobSeeker' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
      sortOrder: sortedInfo.columnKey === 'phoneNumber' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Vị trí ứng tuyển',
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      sorter: (a, b) => a.jobPosition.localeCompare(b.jobPosition),
      sortOrder: sortedInfo.columnKey === 'jobPosition' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Địa chỉ văn phòng',
      dataIndex: 'addressOffice',
      key: 'addressOffice',
      sorter: (a, b) => a.addressOffice.localeCompare(b.addressOffice),
      sortOrder: sortedInfo.columnKey === 'addressOffice' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Thời gian nộp CV',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      sortOrder: sortedInfo.columnKey === 'createdTime' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Thời gian xem xét',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      //   sorter: (a, b) => a.reviewTime - b.reviewTime,
      sortOrder: sortedInfo.columnKey === 'reviewTime' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Tooltip title='Xem CV'>
            <a onClick={() => setOpenModalInfo(true)}>
              <BsFillEyeFill />
            </a>
          </Tooltip>

          {record.status === 'pending' && (
            <>
              <Tooltip title='Chấp nhận CV'>
                <a>
                  <ImUserCheck />
                </a>
              </Tooltip>
              <Tooltip title='Từ chối CV'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === 'approved' && (
            <>
              <Tooltip title='Interview'>
                <a style={{ fontSize: '19px' }}>
                  <MdConnectWithoutContact />
                </a>
              </Tooltip>
              <a>
                <Tooltip title='Không thể liên hệ'>
                  <BiCommentError />
                </Tooltip>
              </a>
            </>
          )}
          {record.status === 'potential' && (
            <>
              <Tooltip title='Chấp nhận CV'>
                <a>
                  <ImUserCheck />
                </a>
              </Tooltip>
              <Tooltip title='Từ chối CV'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === 'interview' && (
            <>
              <a>
                <Tooltip title='Nhận việc'>
                  <FaUserCheck />
                </Tooltip>
              </a>
              <Tooltip title='Từ chối'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === 'notcontactable' && (
            <>
              <Tooltip title='Interview'>
                <a style={{ fontSize: '19px' }}>
                  <MdConnectWithoutContact />
                </a>
              </Tooltip>
            </>
          )}
          {record.status !== 'reject' && record.status !== 'hired' ? (
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <FiMoreVertical />
              </a>
            </Dropdown>
          ) : (
            <>
              <Tooltip title='In CV'>
                <a>
                  <AiFillPrinter />
                </a>
              </Tooltip>

              <Tooltip title='Hủy bỏ'>
                <a>
                  <MdDelete />
                </a>
              </Tooltip>

              <Tooltip title='Thêm vào sổ đen'>
                <a>
                  <BiBlock />
                </a>
              </Tooltip>
            </>
          )}
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
      {/* <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Xóa bộ lọc</Button>
      </Space> */}
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

export default TableApplied
