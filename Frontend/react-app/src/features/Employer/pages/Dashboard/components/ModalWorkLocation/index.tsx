import { Button, Form, Input, Modal } from 'antd'
import { useEffect, useState } from 'react'
import apiCompany from '~/api/company.api'
import './style.scss'
interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}
const ModalWorkLocation = (props: any) => {
  const { open, handleClose } = props
  //modal location

  const [dataLocationBranch, setDataLocationBranch] = useState<WorkingLocation>({
    lat: 0,
    lon: 0,
    branch_name: '',
    address: '',
    district: '',
    city_name: ''
  })
  const [formLocation] = Form.useForm()
  const [listLocation, setListLocation] = useState<Array<WorkingLocation>>([])
  useEffect(() => {
    getDataWorkLocation()
  }, [])
  const getDataWorkLocation = async () => {
    const listTemp = await apiCompany.getWorkLocations()

    setListLocation(
      listTemp.result.map((workLocation: WorkingLocation) => {
        return workLocation
      })
    )
  }
  //submit modal location
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const handleSubmitLocationForm = async () => {
    const data = {
      dataLocationBranch
    }
    console.log('data location', dataLocationBranch)
    //check exist location name branch

    listLocation.forEach((location) => {
      if (location.branch_name === data.dataLocationBranch.branch_name.toString()) {
        alert('Đã tồn tại tên trụ sở này')
        return
      }
    })
    await apiCompany.addWorkLocation(dataLocationBranch).then((_) => {
      handleClose()
    })
  }
  return (
    <Modal
      className='modal-create-location'
      title={<h2>{`TẠO ĐỊA ĐIỂM LÀM VIỆC`}</h2>}
      centered
      open={open}
      // onOk={() => console.log('xxxx')}
      onCancel={handleClose}
      footer=''
    >
      <Form
        name='form-branch-location-job'
        className='form-branch-location-job'
        initialValues={{ remember: true }}
        onFinish={handleSubmitLocationForm}
        form={formLocation}
        onFinishFailed={onFinishFailed}
        layout='vertical'
      >
        <Form.Item
          name='branchName'
          label={<span style={{ fontWeight: '500' }}>Tên Trụ Sở</span>}
          rules={[{ required: true, message: 'Vui lòng không để trống tên trụ sở' }]}
        >
          <Input
            size='large'
            placeholder='Trụ sở chính'
            onChange={(e) => {
              setDataLocationBranch({ ...dataLocationBranch, branch_name: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item
          name='province'
          label={<span style={{ fontWeight: '500' }}>Tỉnh/ Thành phố</span>}
          rules={[{ required: true, message: 'Vui lòng không để trống tỉnh thành phố' }]}
        >
          <Input
            size='large'
            placeholder='TP. Hồ Chí Minh'
            onChange={(e) => {
              setDataLocationBranch({ ...dataLocationBranch, city_name: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item
          name='district'
          label={<span style={{ fontWeight: '500' }}>Quận/ huyện</span>}
          rules={[{ required: true, message: 'Vui lòng không để trống quận/ huyện' }]}
        >
          <Input
            size='large'
            placeholder='Gò Vấp'
            onChange={(e) => {
              setDataLocationBranch({ ...dataLocationBranch, district: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item
          name='address'
          label={<span style={{ fontWeight: '500' }}>Địa chỉ</span>}
          rules={[{ required: true, message: 'Vui lòng không để trống tên công việc' }]}
        >
          <Input
            size='large'
            placeholder='FF/4B'
            onChange={(e) => {
              setDataLocationBranch({ ...dataLocationBranch, address: e.target.value })
            }}
          />
        </Form.Item>
        <div className='btn-container'>
          <Button onClick={handleClose} size='large' className='btn-cancel' htmlType='submit'>
            Thoát
          </Button>
          <Button size='large' className='btn-submit' htmlType='submit'>
            Tạo
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalWorkLocation
