import { Select, Space } from 'antd'

const { Option } = Select
import './selectSortCustom.scss'

const SelectSortCustom = (props: any) => {
  const { listOptions, setData, pickData, placeholderValue } = props

  return (
    <Select
      className='select-custom-container'
      // mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholderValue}
      defaultValue={pickData ? pickData : undefined}
      value={pickData ? pickData : undefined}
      optionLabelProp='children'
      size='large'
      showSearch
      onChange={setData}
    >
      {listOptions &&
        listOptions.map((option: any) => (
          <Option key={option} value={option} label={option}>
            <Space>{option}</Space>
          </Option>
        ))}
    </Select>
  )
}

export default SelectSortCustom
