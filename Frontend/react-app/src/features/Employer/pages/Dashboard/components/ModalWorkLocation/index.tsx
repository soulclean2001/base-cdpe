import { Button, Form, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import apiCompany, { UpdateCompanyType } from '~/api/company.api'
import './style.scss'
import { toast } from 'react-toastify'
import { getAllProviencesApi, getOneProvincesApi } from '~/api/provinces.api'
interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}
export interface DataOptionType {
  value: string
  [key: string]: string
}
const initDataLocation = {
  lat: 0,
  lon: 0,
  branch_name: '',
  address: '',
  district: '',
  city_name: ''
}
const ModalWorkLocation = (props: any) => {
  const { open, handleClose, list, idCompany, dataUpdate } = props
  // console.log('dataUpdate', dataUpdate)
  //modal location
  const initValue: DataOptionType[] = []
  const [districtsData, setDistrictsData] = useState(initValue)
  const [provincesData, setProvincesData] = useState(initValue)
  const [dataLocationBranch, setDataLocationBranch] = useState<WorkingLocation>(initDataLocation)
  const [formLocation] = Form.useForm()

  useEffect(() => {
    if (!dataLocationBranch.city_name) return
    formLocation.setFieldsValue({ district: '' })
    setDataLocationBranch({ ...dataLocationBranch, district: '' })
    if (dataLocationBranch.city_name) fetchDistricts()
    if (dataUpdate && dataUpdate.city_name === dataLocationBranch.city_name) {
      formLocation.setFieldsValue({ district: dataUpdate.district })
      setDataLocationBranch({ ...dataLocationBranch, district: dataUpdate.district })
    }
  }, [dataLocationBranch.city_name])
  useEffect(() => {
    if (open === true) fetchProvinces()
  }, [open])
  const fetchProvinces = async () => {
    const res = await getAllProviencesApi()

    setProvincesData(res)
  }
  const fetchDistricts = async () => {
    const res = await getOneProvincesApi(dataLocationBranch.city_name)
    setDistrictsData(res)
  }
  //submit modal location
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  useEffect(() => {
    if (dataUpdate) handleSetCurrentData()
  }, [dataUpdate])
  const handleSetCurrentData = () => {
    setDataLocationBranch(dataUpdate)
    formLocation.setFieldsValue({
      province: dataUpdate.city_name,
      district: dataUpdate.district,
      branchName: dataUpdate.branch_name,
      address: dataUpdate.address
    })
  }
  const handleSubmitLocationForm = async () => {
    if (!idCompany) return
    const data = {
      dataLocationBranch
    }

    //check exist location name branch
    let checkBranchName = false
    let listAffter: WorkingLocation[] = []
    let listFilter: WorkingLocation[] = []
    if (list) {
      if (dataUpdate) {
        listFilter = list.filter((location: WorkingLocation) => {
          if (location.branch_name && location.branch_name !== dataUpdate.branch_name) return location
        })
        listFilter.forEach((location: WorkingLocation) => {
          if (location.branch_name === dataLocationBranch.branch_name.toString()) {
            checkBranchName = true
            toast.error('Đã tồn tại tên trụ sở này')
            return
          }
        })

        listAffter = [...listFilter, dataLocationBranch]
      } else {
        list.forEach((location: WorkingLocation) => {
          if (location.branch_name === data.dataLocationBranch.branch_name.toString()) {
            checkBranchName = true
            toast.error('Đã tồn tại tên trụ sở này')
            return
          }
        })

        listAffter = [...list, dataLocationBranch]
      }
    } else listAffter = [dataLocationBranch]

    if (checkBranchName) return
    const request: UpdateCompanyType = { working_locations: listAffter }
    await apiCompany
      .updateCompanyById(idCompany, 'default', 'default', request)
      .then(() => {
        toast.success(dataUpdate ? 'Cập nhật địa điểm làm việc thành công' : 'Tạo mới địa điểm làm việc thành công')
      })
      .then(() => {
        setDataLocationBranch(initDataLocation)
        formLocation.setFieldsValue({
          province: '',
          district: '',
          branchName: '',
          address: ''
        })
        handleClose()
      })
  }
  return (
    <Modal
      className='modal-create-location'
      title={dataUpdate ? <h2>{`CẬP NHẬT ĐỊA ĐIỂM`}</h2> : <h2>{`TẠO ĐỊA ĐIỂM LÀM VIỆC`}</h2>}
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
          rules={[
            {
              validator: (_, value) =>
                value && value.trim() !== ''
                  ? Promise.resolve()
                  : Promise.reject(new Error('Nội dung không được bỏ trống'))
            },
            { max: 150, message: 'Đã vượt quá độ dài tối đa' }
          ]}
        >
          <Input
            size='large'
            placeholder='Trụ sở chính'
            onChange={(e) => {
              setDataLocationBranch({ ...dataLocationBranch, branch_name: e.target.value })
            }}
          />
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}
        <Form.Item
          label={<span style={{ fontWeight: '500' }}>Tỉnh/ Thành phố</span>}
          name='province'
          // rules={[{ required: true, message: 'Vui lòng chọn tỉnh/ thành phố' }]}
          rules={[
            {
              validator: (_, value) => {
                return value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chọn tỉnh/ thành phố'))
              }
            }
          ]}
        >
          <Select
            showSearch
            size='large'
            options={provincesData}
            onChange={(value) => setDataLocationBranch({ ...dataLocationBranch, city_name: value })}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: '500' }}>Quận/ huyện</span>}
          name='district'
          // rules={[{ required: true, message: 'Vui lòng chọn quận/ huyện' }]}
          rules={[
            {
              validator: (_, value) => {
                return value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chọn quận/ huyện'))
              }
            }
          ]}
        >
          <Select
            showSearch
            size='large'
            options={districtsData}
            onChange={(value) => setDataLocationBranch({ ...dataLocationBranch, district: value })}
          />
        </Form.Item>
        <Form.Item
          name='address'
          label={<span style={{ fontWeight: '500' }}>Địa chỉ</span>}
          rules={[
            {
              validator: (_, value) =>
                value && value.trim() !== ''
                  ? Promise.resolve()
                  : Promise.reject(new Error('Nội dung không được bỏ trống'))
            },
            { max: 150, message: 'Đã vượt quá độ dài tối đa' }
          ]}
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
            {dataUpdate ? 'Sửa' : 'Tạo'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalWorkLocation
