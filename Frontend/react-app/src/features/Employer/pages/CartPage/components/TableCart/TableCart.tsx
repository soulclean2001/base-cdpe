import { Button, Collapse, InputNumber, Table } from 'antd'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { MdDelete } from 'react-icons/md'
import { useState } from 'react'
interface DataType {
  id: string
  key: string
  namePackage: string
  descriptions: string
  totalPayment: string
  quantity: number
}
const TableCart = () => {
  const dataSource: DataType[] = [
    {
      id: 'id1',
      key: '1',
      namePackage: 'Đăng Tuyển 30-ngày - M',
      descriptions: `Là sự kết hợp các dịch vụ đăng tuyển cơ bản trên trang web vietnamworks.com và Ứng Dụng Di Động của VietnamWorks, bao gồm:
      Trên trang web: Tin tuyển dụng được đăng tuyển cơ bản
      Trên Ứng Dụng Di Động: Tin tuyển dụng được đính kèm tag "HOT" và được hiển thị ở khu vực ưu tiên hơn so với các tin đăng tuyển cơ bản trong 30 ngày.`,
      totalPayment: `2.000.000 VND`,
      quantity: 3
    },
    {
      id: 'id2',
      key: '2',
      namePackage: 'Đăng Tuyển 30-ngày - Cơ Bản',
      descriptions: `Tiếp cận gần 5 triệu người truy cập vào website vietnamworks.com mỗi tháng
      Có cơ hội được gửi trực tiếp đến ứng viên qua 300.000 email thông báo việc làm mỗi ngày`,
      totalPayment: `2.100.000 VND`,
      quantity: 2
    }
  ]

  const columns: ColumnsType<DataType> = [
    {
      // ellipsis: true,
      // width: 'auto',
      showSorterTooltip: false,
      title: 'Sản phẩm',
      dataIndex: 'namePackage',
      key: 'namePackage',
      render: (text, record) => (
        <div style={{ minWidth: '200px' }}>
          <span>{text}</span>
          <Collapse
            className='collapse-descriptions-package'
            size='small'
            ghost
            items={[
              {
                key: '1',
                label: (
                  <span
                    style={{
                      color: '#005aff',
                      transition: 'all .5s',
                      fontSize: '12px'
                    }}
                  >
                    Xem miêu tả
                  </span>
                ),
                children: <span>{record.descriptions}</span>,
                showArrow: false
              }
            ]}
          />
        </div>
      )
    },
    { ellipsis: true, showSorterTooltip: false, title: 'Thành tiền', dataIndex: 'totalPayment', key: 'age' },
    {
      align: 'center',
      // ellipsis: true,
      width: 100,
      showSorterTooltip: false,
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => (
        <InputNumber
          className='custom-input-number'
          step={1}
          keyboard={false}
          min={1}
          max={10}
          defaultValue={text}
          size='middle'
          onKeyDown={(event) => {
            event.preventDefault()
          }}
        />
      )
    },
    {
      // ellipsis: true,
      align: 'center',
      width: 90,
      showSorterTooltip: false,
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: () => (
        <span style={{ justifySelf: 'center', fontSize: '22px', cursor: 'pointer' }}>
          <MdDelete />
        </span>
      )
    }
  ]
  return (
    <div className='table-cart-container'>
      <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '0 0 7px 0' }}>
        <span style={{ justifySelf: 'center', fontSize: '15px', cursor: 'pointer', color: '#005aff' }}>
          <MdDelete />
        </span>
        <span style={{ fontSize: '12px', color: '#005aff', cursor: 'pointer' }}>Xóa toàn bộ</span>
      </div>
      <Table bordered scroll={{ x: true }} columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  )
}

export default TableCart
