import { PlusOutlined } from '@ant-design/icons'
import { GiReceiveMoney } from 'react-icons/gi'
import { PiStudentFill } from 'react-icons/pi'
import { TfiCup } from 'react-icons/tfi'
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, InputRef, Modal, Row, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ImLocation } from 'react-icons/im'
import { useState, useRef, useEffect } from 'react'
import { AiTwotoneEdit } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { BsFillAirplaneFill, BsTrashFill } from 'react-icons/bs'
import { FaMoneyBillWave } from 'react-icons/fa'
//data lo
const listLevel = [
  { value: 'Thực tập sinh' },
  { value: 'Thử việc' },
  { value: 'Nhân viên' },
  { value: 'Trưởng nhóm' },
  { value: 'Phó phòng' },
  { value: 'Trưởng phòng' },
  { value: 'Phó giám đốc' },
  { value: 'Giám đốc' },
  { value: 'Tổng giám đốc' }
]
const listTypeJob = [
  { value: 'Bán thời gian' },
  { value: 'Toàn thời gian' },
  { value: 'Thực tập' },
  { value: 'Việc làm Online' },
  { value: 'Nghề tự do' },
  { value: 'Hợp đồng thời vụ' },
  { value: 'Khác' }
]
const listIndustries = [
  { value: 'Bảo hiểm' },
  { value: 'Chứng khoán' },
  { value: 'Kiểm toán' },
  { value: 'Ngân hàng' },
  { value: 'Tài chính/ Đầu tư' },
  { value: 'In ấn/ Xuất bản' },
  { value: 'Internet/ Online Media' },
  { value: 'Bán sỉ/ Bán lẻ' },
  { value: 'Hàng không/ Du lịch' },
  { value: 'Nhà hàng/ Khách sạn' },
  { value: 'Bất động sản' },
  { value: 'IT - Phần mềm' },
  { value: 'IT - Phần cứng/ Mạng' }
]
const maxItem = [{ value: 'Bạn đã chọn tối đa 3 ngành nghề', label: 'Bạn đã chọn tối đa 3 ngành nghề', disabled: true }]
const listFieldCompany = [
  { value: 'Bảo hiểm' },
  { value: 'Chứng khoán' },
  { value: 'Kiểm toán' },
  { value: 'Ngân hàng' },
  { value: 'Tài chính/ Đầu tư' },
  { value: 'In ấn/ Xuất bản' },
  { value: 'Internet/ Online Media' },
  { value: 'Bán sỉ/ Bán lẻ' },
  { value: 'Hàng không/ Du lịch' },
  { value: 'Nhà hàng/ Khách sạn' },
  { value: 'Bất động sản' },
  { value: 'IT - Phần mềm' },
  { value: 'IT - Phần cứng/ Mạng' }
]
const listBenefit = [
  { value: 'Thưởng' },
  { value: 'Nghỉ phép có lương' },
  { value: 'Đào tạo' },
  { value: 'Giải thưởng' },
  { value: 'Cơ hội du lịch' }
]
//
export const IconLabelSalary = (props: any) => {
  const { value } = props
  // console.log('value', value)
  if (value === 'Thưởng') {
    return <GiReceiveMoney />
  }
  if (value === 'Nghỉ phép có lương') {
    return <FaMoneyBillWave />
  }
  if (value === 'Đào tạo') {
    return <PiStudentFill />
  }
  if (value === 'Giải thưởng') {
    return <TfiCup />
  }
  if (value === 'Cơ hội du lịch') {
    return <BsFillAirplaneFill />
  }
}

interface LocationData {
  branchName: string
  address: string
  district: string
  province: string
}
interface SelectionLocationData {
  value: LocationData
  disabled: boolean
}

interface LocationType {
  checked: boolean
  key: number
  selected: string
}

const initLocation: LocationType[] = [{ checked: false, key: 0, selected: '_' }]

const ModalInfoPost = (props: any) => {
  const { idPost, open, handleClose, title } = props
  const [form] = Form.useForm()
  //state data form modal
  const [nameJob, setNameJob] = useState('')
  const [level, setLevel] = useState('')
  const [typeJob, setTypeJob] = useState('')
  const [industries, setIndustries] = useState([])
  const [field, setField] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobRequirement, setJobRequirement] = useState('')
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' })
  const [showSalaryRange, setShowSalaryRange] = useState(true)
  // const [benefits, setBenefits] = useState([{ type: '', value: '' }])
  const [quantityAccept, setQuantityAccept] = useState(1)
  const [emailAcceptCV, setEmailAcceptCV] = useState('')
  // const [locations, setLocations] = useState<Array<LocationData>>([])
  const handleSubmitForm = () => {
    const locations = listLocation
      .map((location) => {
        if (location.disabled) {
          return typeof location.value !== undefined ? location.value : ''
        }
      })
      .filter((location) => !!location)
    const skills = arrSkills
      .map((skill) => {
        if (skill.value !== '') return skill.value
      })
      .filter((skill) => !!skill)
    const benefits = arrBenefits
      .map((benefit) => {
        if (benefit.data.value !== '' && benefit.data.type !== '') return benefit.data
      })
      .filter((benefit) => !!benefit)
    const data = {
      nameJob,
      level,
      typeJob,
      industries,
      field,
      locations,
      jobDescription,
      jobRequirement,
      skills,
      salaryRange,
      showSalaryRange,
      benefits,
      quantityAccept,
      emailAcceptCV
    }

    console.log('form data post', data)
    handleClose()
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  //

  const [listLocation, setListLocation] = useState<Array<SelectionLocationData>>([
    {
      value: {
        branchName: 'Trụ sở chính',
        address: 'FF',
        district: 'Gò Vấp',
        province: 'TP. Hồ Chí Minh'
      },
      disabled: false
    }
  ])

  const [arrLocations, setArrLocations] = useState(initLocation)

  const [dataLocationBranch, setDataLocationBranch] = useState<LocationData>({
    branchName: '',
    address: '',
    district: '',
    province: ''
  })
  const [hiddenPenEditLocation, setHiddenPenEditLocation] = useState(false)

  //modal location
  const [formLocation] = Form.useForm()
  const [openModalLocation, setOpenModalLocation] = useState(false)
  const handleCloseModalLocation = () => {
    setOpenModalLocation(false)
  }
  //submit modal location
  const handleSubmitLocationForm = () => {
    const data = {
      dataLocationBranch
    }
    //check exist location name branch
    let temp = 0
    listLocation.forEach((location) => {
      if (location.value.branchName === data.dataLocationBranch.branchName.toString()) temp++
    })
    if (temp > 0) {
      alert('Đã tồn tại tên trụ sở này')
      return
    }
    setListLocation([...listLocation, { value: dataLocationBranch, disabled: false }])
  }

  //
  const handleAddWorkingLocation = () => {
    if (arrLocations.length <= 2) {
      setArrLocations([
        ...arrLocations,
        { checked: false, key: arrLocations[arrLocations.length - 1].key + 1, selected: '_' }
      ])
    }
  }

  const handleSelectLocation = (value: any, key: number) => {
    const oldSelectedObj = arrLocations.filter((item) => item.key === key)
    const oldSelected = oldSelectedObj[0].selected
    const changeData = listLocation.map((item: SelectionLocationData) => {
      if (item.value.branchName === value) {
        item.disabled = true
        oldSelectedObj[0].selected = value
      }

      if (item.value.branchName === oldSelected) {
        item.disabled = false
      }

      return item
    })
    setArrLocations(arrLocations)
    setListLocation(changeData)
  }
  const handleDeletedRowLocation = (key: number) => {
    if (arrLocations.length > 1) {
      const oldSelectedObj = arrLocations.filter((item) => item.key === key)
      const oldSelected = oldSelectedObj[0].selected
      if (oldSelected !== '_') {
        const changeData = listLocation.map((item: SelectionLocationData) => {
          if (item.value.branchName === oldSelected) {
            item.disabled = false
          }
          return item
        })
        setListLocation(changeData)
      }
      const filterData = arrLocations.filter((item) => item.key !== key)
      setArrLocations(filterData)
      form.resetFields([`location_${key}`])
    }
  }

  const [arrSkills, setArrSkills] = useState([{ key: 0, value: '' }])
  const handleAddRowSkill = () => {
    const newArr = [...arrSkills, { key: arrSkills[arrSkills.length - 1].key + 1, value: '' }]
    setArrSkills(newArr)
  }
  const handleDeletedRowSkill = (key: number) => {
    if (arrSkills.length > 1) {
      const filterArr = arrSkills.filter((item) => item.key !== key)
      form.resetFields([`skill_${key}`])
      setArrSkills(filterArr)
    }
  }

  const handleSetSkill = (skill: string, key: number) => {
    const mapData = arrSkills.map((item) => {
      if (item.key === key) {
        item.value = skill
      }
      return item
    })
    setArrSkills(mapData)
  }
  const [arrBenefits, setArrBenefits] = useState([{ key: 0, data: { type: listBenefit[0].value, value: '' } }])
  const handleAddRowBenefit = () => {
    setArrBenefits([
      ...arrBenefits,
      { key: arrBenefits[arrBenefits.length - 1].key + 1, data: { type: listBenefit[0].value, value: '' } }
    ])
  }
  const handleDeletedRowBenefit = (key: number) => {
    console.log(key)
    if (arrBenefits.length > 1) {
      const arrFilter = arrBenefits.filter((benefit) => benefit.key !== key)
      setArrBenefits(arrFilter)
    }
  }
  const handleSetTypeBenefit = (value: any, key: number) => {
    const dataBenefit = arrBenefits.map((benefit) => {
      if (benefit.key === key) benefit.data.type = value
      return benefit
    })
    setArrBenefits(dataBenefit)
  }
  const handleSetDataBenefit = (value: any, key: number) => {
    const dataBenefit = arrBenefits.map((benefit) => {
      if (benefit.key === key) benefit.data.value = value
      return benefit
    })
    setArrBenefits(dataBenefit)
  }
  const [hiddenDeleteLocation, setHiddenDeleteLocation] = useState(true)
  const [hiddenDeleteSkill, setHiddenDeleteSkill] = useState(true)
  const [hiddenDeleteBenefit, setHiddenDeleteBenefit] = useState(true)
  // set hidden button delete field
  useEffect(() => {
    if (arrLocations.length > 1) {
      setHiddenDeleteLocation(false)
    } else {
      setHiddenDeleteLocation(true)
    }
  }, [arrLocations])
  useEffect(() => {
    if (arrSkills.length > 1) {
      setHiddenDeleteSkill(false)
    } else {
      setHiddenDeleteSkill(true)
    }
  }, [arrSkills])
  useEffect(() => {
    if (arrBenefits.length > 1) {
      setHiddenDeleteBenefit(false)
    } else {
      setHiddenDeleteBenefit(true)
    }
  }, [arrBenefits])
  //
  return (
    <>
      <Modal
        className='modal-container'
        title={<h1>{idPost ? `THÔNG TIN BÀI ĐĂNG ${idPost}` : title}</h1>}
        centered
        open={open}
        onOk={handleClose}
        onCancel={handleClose}
        width={'70%'}
        footer={''}
      >
        <div>
          <hr />
          <Form
            name='form-info-job'
            className='form-info-job'
            initialValues={{ remember: true }}
            onFinish={handleSubmitForm}
            form={form}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <h2>Mô tả công việc</h2>
            <Form.Item
              name='nameJob'
              label={<span style={{ fontWeight: '500' }}>Chức Danh</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống tên công việc' }]}
            >
              <Input
                size='large'
                className='name-job-input'
                placeholder='Eg. Senior UX Designer'
                onChange={(e) => setNameJob(e.target.value)}
              />
            </Form.Item>
            <Row justify={'space-between'}>
              <Col md={11} sm={24} xs={24}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Cấp Bật</span>}
                  name='level'
                  rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                >
                  <Select
                    showSearch
                    placeholder={'Chọn cấp bật'}
                    size='large'
                    options={listLevel}
                    onChange={(value) => setLevel(value)}
                  />
                </Form.Item>
              </Col>
              <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Loại Việc Làm</span>}
                  name='typeJob'
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: (_, value) => {
                        return value ? Promise.resolve() : Promise.reject(new Error('Chọn loại công việc'))
                      }
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={'Chọn loại công việc'}
                    size='large'
                    options={listTypeJob}
                    onChange={(value) => setTypeJob(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col md={11} sm={24} xs={24}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Ngành Nghề (Tối đa 3 ngành nghề)</span>}
                  name='industry'
                  rules={[{ required: true, message: 'Vui lòng chọn ngành nghề' }]}
                >
                  <Select
                    showSearch
                    mode={'multiple'}
                    placeholder={'Chọn ngành nghề'}
                    size='large'
                    options={industries.length === 3 ? maxItem : listIndustries}
                    onChange={(value) => setIndustries(value)}
                    maxTagCount={3}
                    maxTagTextLength={10}
                  />
                </Form.Item>
              </Col>
              <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Lĩnh Vực Công Ty</span>}
                  name='field'
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator: (_, value) => {
                        return value
                          ? Promise.resolve()
                          : Promise.reject(new Error('Vui lòng chọn lĩnh vực của Công ty'))
                      }
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={'Chọn lĩnh vực của công ty'}
                    size='large'
                    options={listFieldCompany}
                    onChange={(value) => setField(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h4 style={{ fontWeight: '500' }}>Địa Điểm Làm Việc</h4>
            {arrLocations.map((lcItem) => {
              return (
                <Row align={'middle'} justify={'space-between'} key={lcItem.key} style={{ marginBottom: '15px' }}>
                  <Col md={22} sm={20} xs={18}>
                    <Form.Item
                      style={{ margin: 0 }}
                      name={`location_${lcItem.key}`}
                      // label={<span style={{ fontWeight: '500' }}>Địa Điểm Làm Việc</span>}
                      rules={[{ required: true, message: 'Vui lòng không để trống địa chỉ trụ sở' }]}
                    >
                      <Select
                        onChange={(value) => handleSelectLocation(value, lcItem.key)}
                        onBlur={() => {
                          setHiddenPenEditLocation(true)
                        }}
                        onSelect={() => {
                          setHiddenPenEditLocation(true)
                        }}
                        onMouseDown={() => {
                          setHiddenPenEditLocation(false)
                        }}
                        size='large'
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space style={{ padding: '0 8px 4px' }}>
                              <Button type='text' icon={<PlusOutlined />} onClick={() => setOpenModalLocation(true)}>
                                Tạo địa điểm làm việc
                              </Button>
                            </Space>
                          </>
                        )}
                        options={listLocation.map((location) => ({
                          label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <ImLocation />
                              {location.value.branchName}
                              <div hidden={hiddenPenEditLocation}>
                                <AiTwotoneEdit />
                              </div>
                            </div>
                          ),
                          value: location.value.branchName,
                          disabled: location.disabled
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    md={2}
                    sm={4}
                    xs={6}
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Button
                      hidden={hiddenDeleteLocation}
                      onClick={() => handleDeletedRowLocation(lcItem.key)}
                      size='large'
                      icon={<BsTrashFill />}
                    />
                  </Col>
                </Row>
              )
            })}

            <Modal
              className='modal-create-location'
              title={<h1>{`TẠO ĐỊA ĐIỂM LÀM VIỆC`}</h1>}
              centered
              open={openModalLocation}
              // onOk={() => console.log('xxxx')}
              onCancel={handleCloseModalLocation}
              width={'50%'}
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
                      setDataLocationBranch({ ...dataLocationBranch, branchName: e.target.value })
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
                      setDataLocationBranch({ ...dataLocationBranch, province: e.target.value })
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
                <Form.Item name='buttonSubmit'>
                  <Button style={{ float: 'right' }} htmlType='submit'>
                    Tạo
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <Button style={{ marginBottom: '20px' }} onClick={handleAddWorkingLocation} icon={<PlusOutlined />}>
              Thêm địa điểm làm việc
            </Button>
            <Form.Item
              name='descriptions'
              label={<span style={{ fontWeight: '500' }}>Mô Tả</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống mô tả công việc' }]}
            >
              <TextArea size='large' onChange={(e) => setJobDescription(e.target.value)} />
            </Form.Item>
            <Form.Item
              name='requirements'
              label={<span style={{ fontWeight: '500' }}>Yêu Cầu Công Việc</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống yêu cầu công việc' }]}
            >
              <TextArea size='large' onChange={(e) => setJobRequirement(e.target.value)} />
            </Form.Item>
            <h4 style={{ fontWeight: '500' }}>Yêu Cầu Kỹ Năng</h4>
            {arrSkills.map((sk) => {
              return (
                <Row align={'middle'} justify={'space-between'} key={sk.key} style={{ marginBottom: '15px' }}>
                  <Col md={22} sm={20} xs={18}>
                    <Form.Item
                      style={{ margin: 0 }}
                      key={sk.key}
                      name={`skill_${sk.key}`}
                      // label={<span style={{ fontWeight: '500' }}>Yêu Cầu Kỹ Năng</span>}
                      rules={[{ required: true, message: 'Vui lòng không để trống yêu cầu kỹ năng công việc' }]}
                    >
                      <Input value={sk.value} size='large' onChange={(e) => handleSetSkill(e.target.value, sk.key)} />
                    </Form.Item>
                  </Col>
                  <Col md={2} sm={4} xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      hidden={hiddenDeleteSkill}
                      size='large'
                      icon={<BsTrashFill />}
                      onClick={() => handleDeletedRowSkill(sk.key)}
                    />
                  </Col>
                </Row>
              )
            })}

            <Button onClick={handleAddRowSkill} style={{ marginBottom: '20px' }} icon={<PlusOutlined />}>
              Thêm kỹ năng
            </Button>
            <h4 style={{ fontWeight: '500' }}>Mức Lương</h4>
            <Row justify={'start'} style={{ gap: '8px' }}>
              <Col md={7} sm={24} xs={24}>
                <Form.Item
                  // label={<span style={{ fontWeight: '500' }}>Mức Lương</span>}
                  name='minSalary'
                  rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu' }]}
                >
                  <Input
                    size='large'
                    placeholder='Tối thiểu'
                    onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col md={7} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  name='maxSalary'
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa' }]}
                >
                  <Input
                    size='large'
                    placeholder='Tối đa'
                    onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <Form.Item valuePropName='checked' name='showSalary' style={{ marginBottom: 0 }}>
                  <Checkbox defaultChecked={showSalaryRange} onClick={() => setShowSalaryRange(!showSalaryRange)}>
                    Hiển Thị Mức Lương
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            {arrBenefits.map((row) => (
              <Row key={row.key} align={'middle'} justify={'space-between'}>
                <Col md={22} sm={20} xs={18}>
                  <Form.Item
                    name={`benefit_${row.key}`}
                    label={<span style={{ fontWeight: '500' }}>Phúc Lợi Từ Công Ty</span>}
                  >
                    <Input
                      onChange={(e) => handleSetDataBenefit(e.target.value, row.key)}
                      addonBefore={
                        <Select
                          onChange={(value) => handleSetTypeBenefit(value, row.key)}
                          popupMatchSelectWidth={200}
                          size='large'
                          defaultValue={listBenefit[0].value}
                          options={listBenefit.map((benefit) => ({
                            label: (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <IconLabelSalary value={benefit.value} />
                                {benefit.value}
                              </div>
                            ),
                            value: benefit.value
                          }))}
                          optionLabelProp='label'
                        />
                      }
                      size='large'
                      placeholder='VD: Lương tháng 13'
                    />
                  </Form.Item>
                </Col>
                <Col md={2} sm={4} xs={6} style={{ paddingTop: '5px', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    hidden={hiddenDeleteBenefit}
                    size='large'
                    icon={<BsTrashFill />}
                    onClick={() => handleDeletedRowBenefit(row.key)}
                  />
                </Col>
              </Row>
            ))}

            <Button onClick={handleAddRowBenefit} style={{ marginBottom: '20px' }} icon={<PlusOutlined />}>
              Thêm phúc lợi
            </Button>
            <Form.Item
              // name='quantityAccept'
              label={<span style={{ fontWeight: '500' }}>Số lượng tuyển</span>}
              // rules={[{ required: true, message: 'Vui lòng không để trống email nhận CV' }]}
            >
              <InputNumber
                min={1}
                defaultValue={1}
                size='large'
                onKeyDown={(event) => {
                  if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                    event.preventDefault()
                  }
                }}
                onChange={(value) => setQuantityAccept(Number(value))}
              />
            </Form.Item>
            <Form.Item
              name='emailApplyCV'
              label={<span style={{ fontWeight: '500' }}>Địa Chỉ Email Nhận Hồ Sơ</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống email nhận CV' }]}
            >
              <Input size='large' placeholder='mail@gmail.com' onChange={(e) => setEmailAcceptCV(e.target.value)} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
              <Button size='large' style={{ width: '100px' }} onClick={handleClose}>
                Thoát
              </Button>
              {idPost ? (
                <Button
                  size='large'
                  htmlType='submit'
                  style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
                >
                  Cập nhật
                </Button>
              ) : (
                <Button
                  size='large'
                  htmlType='submit'
                  style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
                >
                  Tạo
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default ModalInfoPost
