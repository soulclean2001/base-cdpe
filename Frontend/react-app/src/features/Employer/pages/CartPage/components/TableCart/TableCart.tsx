import { Collapse, InputNumber, Table } from 'antd'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { MdDelete } from 'react-icons/md'
import { useState, useEffect } from 'react'
import apiCart from '~/api/cart.api'
import { toast } from 'react-toastify'
import ReactHtmlParser from 'html-react-parser'
import { useDispatch } from 'react-redux'
import { minusTotalItemCart } from '~/features/Employer/employerSlice'
interface DataType {
  id: string
  namePackage: string
  descriptions: string
  totalPayment: number
  quantity: number
  idPackage: string
  price: number
  type: string
  valuePost: number
  totalDate: number
  statusPackage: string
}
interface ItemType {
  [key: string]: any
}
const TableCart = (props: any) => {
  const { handleSetTotalPay } = props
  const [disableInput, setDisableInput] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [listItems, setListItems] = useState<DataType[]>([])
  const [items, setItems] = useState<
    {
      item_id: string
      quantity: number
    }[]
  >([])
  const [hideDescript, setHideDescript] = useState(true)
  const disPath = useDispatch()
  useEffect(() => {
    fetchGetListItemsCart()
  }, [])
  useEffect(() => {
    let total = 0

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
          namePackage: item.package.title,
          descriptions: item.package.description,
          totalPayment: item.package.price * item.item.quantity,
          quantity: item.item.quantity,
          idPackage: item.item.item_id,
          price: item.package.price,
          type: item.package.type,
          valuePost: item.package.value,
          totalDate: item.package.number_of_days_to_expire,
          statusPackage: item.package.status
        }
      })

      setListItems(list)
    })
  }
  const handleChangeQuantity = async (value: number, id: string) => {
    setDisableInput(true)
    if (!items || !listItems) return
    await apiCart.createOrUpdateItemCart({ item: { item_id: id, quantity: value } }).then((rs) => {
      const listAfter = listItems.map((item) => {
        if (item.id === rs.result._id) {
          item.quantity = value
          item.totalPayment = value * item.price
        }
        return item
      })
      const itemsAfter = items.map((item) => {
        if (item.item_id === id) item.quantity = value
        return item
      })
      setItems(itemsAfter)
      setListItems(listAfter)

      setDisableInput(false)
    })
    // await fetchGetListItemsCart()
  }
  const handleDeleteItemCart = async (id: string) => {
    if (!listItems || !items) return
    await apiCart.deleteIemCart(id).then(() => {
      const listAfter = listItems.filter((item) => {
        return item.idPackage !== id
      })
      const listItemsAfter = items.filter((item) => {
        return item.item_id !== id
      })
      setItems(listItemsAfter)
      setListItems(listAfter)
      disPath(minusTotalItemCart())
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

    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: DataType) => ({
      disabled: record.statusPackage !== 'ACTIVE' // Column configuration not to be checked
    })
  }
  const columns: ColumnsType<DataType> = [
    {
      // ellipsis: true,
      // width: 'auto',

      showSorterTooltip: false,
      title: 'Gói dịch vụ',
      dataIndex: 'namePackage',
      key: 'namePackage',
      render: (_, record) => (
        <div style={{ minWidth: '200px' }}>
          <span>
            {record.namePackage}
            {' - '}
            {record.type === 'BANNER' ? `${record.totalDate} ngày` : `${record.valuePost} bài đăng`}
            {record.statusPackage !== 'ACTIVE' && (
              <span style={{ fontSize: '12px', color: 'red' }}> (Ngừng hoạt động)</span>
            )}
          </span>
          <Collapse
            onChange={() => setHideDescript(!hideDescript)}
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
                    {hideDescript ? 'Xem miêu tả' : 'Ẩn miêu tả'}
                  </span>
                ),
                children: (
                  <div
                    className='preview__info'
                    style={{ color: '#333333', maxWidth: '100%', wordBreak: 'break-word' }}
                  >
                    {record.descriptions ? ReactHtmlParser(record.descriptions) : ''}
                  </div>
                ),
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
      render: (value, _) => <>{value.toLocaleString('vi', { currency: 'VND' })} VND</>
    },
    {
      align: 'center',
      // ellipsis: true,
      width: 100,
      showSorterTooltip: false,
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          disabled={disableInput}
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
