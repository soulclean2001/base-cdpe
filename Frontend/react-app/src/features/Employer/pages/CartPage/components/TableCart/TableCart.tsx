import { Collapse, InputNumber, Table } from 'antd'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { MdDelete } from 'react-icons/md'
import { useState, useEffect } from 'react'
import apiCart from '~/api/cart.api'
import { toast } from 'react-toastify'
interface DataType {
  id: string
  namePackage: string
  descriptions: string
  totalPayment: number
  quantity: number
  idPackage: string
}
interface ItemType {
  [key: string]: any
}
const TableCart = (props: any) => {
  const { handleSetTotalPay } = props
  const dataSource: DataType[] = [
    {
      id: 'id1',
      idPackage: '1',
      namePackage: 'Đăng Tuyển 30-ngày - M',
      descriptions: `Là sự kết hợp các dịch vụ đăng tuyển cơ bản trên trang web vietnamworks.com và Ứng Dụng Di Động của VietnamWorks, bao gồm:
      Trên trang web: Tin tuyển dụng được đăng tuyển cơ bản
      Trên Ứng Dụng Di Động: Tin tuyển dụng được đính kèm tag "HOT" và được hiển thị ở khu vực ưu tiên hơn so với các tin đăng tuyển cơ bản trong 30 ngày.`,
      totalPayment: 200,
      quantity: 3
    },
    {
      id: 'id2',
      idPackage: '2',
      namePackage: 'Đăng Tuyển 30-ngày - Cơ Bản',
      descriptions: `Tiếp cận gần 5 triệu người truy cập vào website vietnamworks.com mỗi tháng
      Có cơ hội được gửi trực tiếp đến ứng viên qua 300.000 email thông báo việc làm mỗi ngày`,
      totalPayment: 400,
      quantity: 2
    }
  ]
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [listItems, setListItems] = useState<DataType[]>([])
  const [items, setItems] = useState<
    {
      item_id: string
      quantity: number
    }[]
  >([])
  // const [totalPay, setTotalPay] = useState(0)

  useEffect(() => {
    fetchGetListItemsCart()
  }, [])
  useEffect(() => {
    let total = 0
    console.log('items', items)
    listItems.map((itemCart) => {
      items.map((item) => {
        if (item.item_id === itemCart.idPackage) total += itemCart.totalPayment
      })
    })
    handleSetTotalPay(total, items)
    // setTotalPay(total)
  }, [items])
  const fetchGetListItemsCart = async () => {
    await apiCart.getAllByMe().then((rs) => {
      let list: DataType[] = rs.result.map((item: ItemType) => {
        return {
          id: item._id,
          namePackage: 'name package',
          descriptions: 'descrip',
          totalPayment: 100000 * item.item.quantity,
          quantity: item.item.quantity,
          idPackage: item.item.item_id
        }
      })

      setListItems(list)
    })
  }
  const handleChangeQuantity = async (value: number, id: string) => {
    console.log('value', value, id)
    if (!items || !listItems) return
    await apiCart.createOrUpdateItemCart({ item: { item_id: id, quantity: value } }).then((rs) => {
      console.log('updae', rs)
      const listAfter = listItems.map((item) => {
        if (item.id === rs.result._id) {
          item.quantity = value
          item.totalPayment = value * 100000
        }
        return item
      })
      const itemsAfter = items.map((item) => {
        if (item.item_id === id) item.quantity = value
        return item
      })
      setItems(itemsAfter)
      setListItems(listAfter)
    })
    // await fetchGetListItemsCart()
  }
  const handleDeleteItemCart = async (id: string) => {
    if (!listItems || !items) return
    await apiCart.deleteIemCart(id).then((rs) => {
      console.log('rs del', rs)
      const listAfter = listItems.filter((item) => {
        return item.idPackage !== id
      })
      const listItemsAfter = items.filter((item) => {
        return item.item_id !== id
      })
      setItems(listItemsAfter)
      setListItems(listAfter)
      toast.success('Xóa dịch vụ khỏi giỏ hàng thành công')
    })
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    let listChecked: {
      item_id: string
      quantity: number
    }[] = []
    listItems.map((item: DataType) => {
      newSelectedRowKeys.map((key: any) => {
        if (item.idPackage === key) {
          listChecked.push({ item_id: key, quantity: item.quantity })
        }
      })
    })
    setItems(listChecked)
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
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
    {
      ellipsis: true,
      showSorterTooltip: false,
      title: 'Thành tiền',
      dataIndex: 'totalPayment',
      key: 'totalPayment',
      render: (value, record) => <>{value.toLocaleString('vi', { currency: 'VND' })} VND</>
    },
    {
      align: 'center',
      // ellipsis: true,
      width: 100,
      showSorterTooltip: false,
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number, record) => (
        <InputNumber
          className='custom-input-number'
          step={1}
          keyboard={false}
          min={1}
          max={10}
          defaultValue={record.quantity}
          size='middle'
          onKeyDown={(event) => {
            event.preventDefault()
          }}
          onChange={(value) => handleChangeQuantity(value as number, record.idPackage)}
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
      render: (_, record) => (
        <span
          onClick={() => handleDeleteItemCart(record.idPackage)}
          style={{ justifySelf: 'center', fontSize: '22px', cursor: 'pointer' }}
        >
          <MdDelete />
        </span>
      )
    }
  ]
  return (
    <div className='table-cart-container'>
      {/* <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '0 0 7px 0' }}>
        <span style={{ justifySelf: 'center', fontSize: '15px', cursor: 'pointer', color: '#005aff' }}>
          <MdDelete />
        </span>
        <span style={{ fontSize: '12px', color: '#005aff', cursor: 'pointer' }}>Xóa toàn bộ</span>
      </div> */}
      <Table
        rowSelection={rowSelection}
        rowKey={'idPackage'}
        bordered
        scroll={{ x: true }}
        columns={columns}
        dataSource={listItems}
        pagination={false}
      />
    </div>
  )
}

export default TableCart
