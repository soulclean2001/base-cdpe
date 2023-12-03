import { getAllProviencesApi, getOneProvincesApi } from '~/api/provinces.api'
import { useEffect, useState } from 'react'

import {
  BankOutlined,
  CaretRightOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { CSSProperties } from 'react'
import type { CollapseProps, RadioChangeEvent } from 'antd'
import { Button, Checkbox, Col, Collapse, Divider, Form, Input, Modal, Radio, Row, Select, Space } from 'antd'
import './signUpEmployer.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LocationType,
  SelectionLocationData,
  WorkingLocation
} from '../Dashboard/components/ModalInfoPost/ModalInfoPost'
import { ImLocation } from 'react-icons/im'

import { BsTrashFill } from 'react-icons/bs'
import apiAuth, { AuthRequestRegistry } from '~/api/auth.api'
import { decodeToken } from '~/utils/jwt'
import { AppThunkDispatch, useAppDispatch } from '~/app/hook'
import { toast } from 'react-toastify'
import { AuthLogin, setAccountStatus, setStateLogin, setToken } from '~/features/Auth/authSlice'
const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: (
      <span className='title-regulations' style={{ fontSize: '19px', fontWeight: 700, color: 'rgb(255, 125, 85)' }}>
        Quy định
      </span>
    ),
    children: (
      <>
        <p>
          Để đảm bảo chất lượng dịch vụ, HFWork không cho phép một người dùng{' '}
          <span style={{ color: 'red' }}>tạo nhiều tài khoản khác nhau.</span>
        </p>
        <p>
          Nếu phát hiện vi phạm, HFWork sẽ ngừng cung cấp dịch vụ tới tất cả các tài khoản trùng lặp hoặc chặn toàn bộ
          truy cập tới hệ thống website của HFWork. Đối với trường hợp khách hàng đã sử dụng hết 3 tin tuyển dụng miễn
          phí, HFWork hỗ trợ kích hoạt đăng tin tuyển dụng không giới hạn sau khi quý doanh nghiệp cung cấp thông tin
          giấy phép kinh doanh.
        </p>
        <p>Mọi thắc mắc vui lòng liên hệ Hotline CSKH:</p>
        <p style={{ color: 'rgb(255, 125, 85)', fontWeight: 700, fontSize: '18px' }}>
          {' '}
          <PhoneOutlined /> 0365887759
        </p>
      </>
    ),
    style: panelStyle
  }
]
const panelStyle: React.CSSProperties = {
  border: 'none'
}
const radioGenders: {
  data: string
  value: number
}[] = [
  { data: 'Nam', value: 0 },
  { data: 'Nữ', value: 1 }
]
const listPositions = [
  { value: 'Nhân viên' },
  { value: 'Trưởng nhóm' },
  { value: 'Phó phòng' },
  { value: 'Trưởng phòng' },
  { value: 'Phó giám đốc' },
  { value: 'Giám đốc' },
  { value: 'Tổng giám đốc' }
]

interface DataOptionType {
  value: string
  [key: string]: string
}
const initLocation: LocationType[] = [{ checked: false, key: 0, selected: '_' }]
const SignUpEmployer = () => {
  const [form] = Form.useForm()
  // set gender data
  const handleOnChangeSex = (e: RadioChangeEvent) => {
    setSex(e.target.value)
  }

  //form state data
  const [openModalLocation, setOpenModalLocation] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [name, setName] = useState('')
  const [sex, setSex] = useState(0)
  const [phone, setPhone] = useState('')
  const [nameCompany, setNameCompany] = useState('')
  const [position, setPosition] = useState('')
  const [checkAccept, setCheckAccept] = useState(false)

  //work location
  const [formLocation] = Form.useForm()
  const [listLocation, setListLocation] = useState<Array<SelectionLocationData>>([])
  const [hiddenDeleteLocation, setHiddenDeleteLocation] = useState(true)
  const [dataLocationBranch, setDataLocationBranch] = useState<WorkingLocation>({
    lat: 0,
    lon: 0,
    branch_name: '',
    address: '',
    district: '',
    city_name: ''
  })
  const [arrLocations, setArrLocations] = useState(initLocation)
  //provinces data
  const initValue: DataOptionType[] = []

  const [districtsData, setDistrictsData] = useState(initValue)
  const [provincesData, setProvincesData] = useState(initValue)
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    fetchProvinces()
    formLocation.setFieldsValue({ district: '' })
    if (dataLocationBranch.city_name) fetchDistricts()
  }, [dataLocationBranch.city_name])

  const fetchProvinces = async () => {
    const res = await getAllProviencesApi()

    setProvincesData(res)
  }
  const fetchDistricts = async () => {
    const res = await getOneProvincesApi(dataLocationBranch.city_name)
    setDistrictsData(res)
  }
  const decodeUser = async (token: { accessToken: string; refreshToken: string }) => {
    if (token) {
      const dataDecode = await decodeToken(token.accessToken)
      if (dataDecode.role && dataDecode.role === 1) {
        const action: AuthLogin = { isLogin: true, loading: false, error: '' }
        dispatchAsync(setToken(token))
        dispatchAsync(setAccountStatus(dataDecode))
        dispatchAsync(setStateLogin(action))
        navigate('/employer/active-page')
        toast.success('Đăng ký thành công')
      }
    }
  }
  const handleSubmitSignup = async () => {
    const locationsFinal: WorkingLocation[] = []
    listLocation.map((location) => {
      if (location.disabled && location.value !== undefined) {
        locationsFinal.push(location.value)
      }
    })

    const req: AuthRequestRegistry = {
      email: email,
      password: password,
      confirm_password: rePassword,
      name: name,
      company_name: nameCompany,
      position: position,
      gender: sex,
      role: 1,
      phone_number: phone,
      fields: ['_'],
      working_locations: locationsFinal,
      date_of_birth: '2001-01-01'
    }
    await apiAuth
      .register(req)
      .then(async (response) => {
        if (response.result && response.result.access_token && response.result.refresh_token) {
          await decodeUser({ accessToken: response.result.access_token, refreshToken: response.result.refresh_token })
        }
      })
      .catch(() => {
        toast.error('Email đã tồn tại, vui lòng chọn Email khác')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const handleAddWorkingLocation = () => {
    if (arrLocations.length <= 2) {
      setArrLocations([
        ...arrLocations,
        { checked: false, key: arrLocations[arrLocations.length - 1].key + 1, selected: '_' }
      ])
    }
  }
  useEffect(() => {
    if (arrLocations.length > 1) {
      setHiddenDeleteLocation(false)
    } else {
      setHiddenDeleteLocation(true)
    }
  }, [arrLocations])
  const handleSelectLocation = (value: any, key: number) => {
    const oldSelectedObj = arrLocations.filter((item) => item.key === key)
    const oldSelected = oldSelectedObj[0].selected
    const changeData = listLocation.map((item: SelectionLocationData) => {
      if (item.value.branch_name === value) {
        item.disabled = true
        oldSelectedObj[0].selected = value
      }

      if (item.value.branch_name === oldSelected) {
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
          if (item.value.branch_name === oldSelected) {
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
  const handleSubmitLocationForm = async () => {
    const data = {
      dataLocationBranch
    }
    //check exist location name branch
    let temp = 0
    listLocation.forEach((location) => {
      if (location.value.branch_name === data.dataLocationBranch.branch_name.toString()) temp++
    })
    if (temp > 0) {
      alert('Đã tồn tại tên trụ sở này')
      return
    }
    setListLocation([...listLocation, { value: dataLocationBranch, disabled: false }])
    setOpenModalLocation(false)
  }
  return (
    <Row className='page-sign-up-employer-container'>
      <Col md={16} sm={24} xs={24} className='page-sign-up-employer-wapper'>
        <div className='sign-up-employer-content'>
          <div className='title-container'>
            <div className='title' onClick={() => navigate('/employer')}>
              HFWorks
            </div>
            <p>Đăng ký tài khoản Nhà tuyển dụng</p>
            <span>Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm dịch vụ Website của chúng tôi.</span>
          </div>
          <div className='regulations-container'>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ border: '1px solid rgb(255, 125, 85)' }}
              items={getItems(panelStyle)}
            />
            <Form
              name='form-sign-up-employer'
              className='sign-up-form'
              initialValues={{ remember: true }}
              onFinish={handleSubmitSignup}
              form={form}
              onFinishFailed={onFinishFailed}
              layout='vertical'
            >
              <div className='title title-sigup-account'>Tài khoản</div>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  { required: true, message: 'Vui lòng không để trống Email' },
                  { type: 'email', message: 'Vui lòng nhập đúng định dạng Email. Ví dụ: abc@gmail.com' }
                ]}
              >
                <Input
                  size='large'
                  className='email-input'
                  prefix={<MailOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  placeholder='Nhập Email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name={'password'}
                label='Mật khẩu'
                style={{ paddingTop: '10px' }}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  {
                    ///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                    pattern: new RegExp(/^(?=(.*[a-z]){1})(?=(.*[A-Z]){1})(?=(.*\d){1})(?=(.*\W){1}).{6,}$/),
                    message:
                      'Mật khẩu bao gồm chữ in Hoa - chữ in thường, ký tự đặc biệt và số, độ dài tối thiểu 6 ký tự'
                  },
                  { max: 150, message: 'Đã vượt quá độ dài tối đa' }
                ]}
              >
                <Input.Password
                  size='large'
                  prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  type='password'
                  placeholder='Nhập mật khẩu'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name={'rePassword'}
                label='Nhập lại mật khẩu'
                rules={[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Nhập lại mật khẩu không chính xác'))
                    }
                  }),
                  { max: 150, message: 'Đã vượt quá độ dài tối đa' }
                ]}
                style={{ paddingTop: '10px' }}
              >
                <Input.Password
                  size='large'
                  prefix={<LockOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  type='password'
                  placeholder='Nhập lại mật khẩu'
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </Form.Item>
              <div className='title-sigup-account'>Thông tin nhà tuyển dụng</div>
              <Row justify={'space-between'}>
                <Col md={14} sm={24} xs={24}>
                  <Form.Item
                    name={'name'}
                    rules={[
                      { max: 30, message: 'Đã vượt quá độ dài tối đa 30 ký tự' },
                      {
                        validator: (_, value) =>
                          value && value.trim() !== ''
                            ? Promise.resolve()
                            : Promise.reject(new Error('Nội dung không được bỏ trống'))
                      }
                    ]}
                    label='Họ và tên'
                  >
                    <Input
                      size='large'
                      className='name-input'
                      prefix={<UserOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                      placeholder='Nhập họ tên'
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <Form.Item label='Giới tính' style={{ marginBottom: 0 }}>
                    <Radio.Group onChange={handleOnChangeSex} value={sex}>
                      {radioGenders.map((item) => {
                        return (
                          <Radio key={item.value} value={item.value} checked>
                            {item.data}
                          </Radio>
                        )
                      })}
                      {/* <Radio value={0}>Nam</Radio>
                      <Radio value={1}>Nữ</Radio> */}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label='Số điện thoại cá nhân'
                name='phone'
                rules={[
                  { required: true, message: 'Vui lòng không để trống số điện thoại' },
                  {
                    pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                    message:
                      'Vui lòng nhập đúng định dạng số điện thoại: Có những số đầu là 03-05-07-08-09 và có 10 số.  Ví dụ: 0988888888'
                  }
                ]}
              >
                <Input
                  size='large'
                  maxLength={10}
                  prefix={<PhoneOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                  placeholder='Nhập số điện thoại'
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Item>
              <p>Công ty</p>
              <Row justify={'space-between'}>
                <Col md={11} sm={24} xs={24}>
                  <Form.Item
                    label='Tên công ty'
                    name='nameCompany'
                    rules={[
                      { max: 50, message: 'Đã vượt quá độ dài tối đa 50 ký tự' },
                      {
                        validator: (_, value) =>
                          value && value.trim() !== ''
                            ? Promise.resolve()
                            : Promise.reject(new Error('Nội dung không được bỏ trống'))
                      }
                    ]}
                  >
                    <Input
                      size='large'
                      prefix={<BankOutlined style={{ color: 'rgb(255, 125, 85)' }} className='site-form-item-icon' />}
                      placeholder='Nhập tên công ty'
                      onChange={(e) => setNameCompany(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form.Item
                    label='Vị trí công tác'
                    name='position'
                    style={{ marginBottom: 0 }}
                    rules={[
                      {
                        validator: (_, value) => {
                          return value ? Promise.resolve() : Promise.reject(new Error('Chọn ví trí công tác'))
                        }
                      }
                    ]}
                  >
                    <Select size='large' options={listPositions} onChange={(value) => setPosition(value)} />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row justify={'space-between'}>
                <Col md={11} sm={24} xs={24}>
                  <Form.Item
                    label='Địa điểm làm việc'
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
                 
                    <Select showSearch size='large' options={provincesData} onChange={(value) => setProvince(value)} />
                  </Form.Item>
                </Col>
                <Col md={11} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form.Item
                    label='Quận/ huyện'
                    name='district'
                    style={{ marginBottom: 0 }}
                    // rules={[{ required: true, message: 'Vui lòng chọn quận/ huyện' }]}
                    rules={[
                      {
                        validator: (_, value) => {
                          return value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chọn quận/ huyện'))
                        }
                      }
                    ]}
                  >
                  
                    <Select showSearch size='large' options={districtsData} onChange={(value) => setDistrict(value)} />
                  </Form.Item>
                </Col>
              </Row> */}
              <h4 style={{ fontWeight: '500' }}>Địa Điểm Làm Việc</h4>
              {arrLocations.map((lcItem) => {
                return (
                  <Row align={'middle'} justify={'space-between'} key={lcItem.key} style={{ marginBottom: '15px' }}>
                    <Col md={22} sm={21} xs={19}>
                      <Form.Item
                        style={{ margin: 0 }}
                        name={`location_${lcItem.key}`}
                        // label={<span style={{ fontWeight: '500' }}>{lcItem.key}</span>}
                        rules={[{ required: true, message: 'Vui lòng không để trống địa chỉ trụ sở' }]}
                      >
                        <Select
                          onChange={(value) => handleSelectLocation(value, lcItem.key)}
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
                                {location.value.branch_name}

                                {/* <AiTwotoneEdit /> */}
                              </div>
                            ),
                            value: location.value.branch_name,
                            disabled: location.disabled
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      md={2}
                      sm={3}
                      xs={4}
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
                onCancel={() => setOpenModalLocation(false)}
                width={'50%'}
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
                      { max: 150, message: 'Đã vượt quá độ dài tối đa' },
                      {
                        validator: (_, value) =>
                          value && value.trim() !== ''
                            ? Promise.resolve()
                            : Promise.reject(new Error('Nội dung không được bỏ trống'))
                      }
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
                      { max: 150, message: 'Đã vượt quá độ dài tối đa' },
                      {
                        validator: (_, value) =>
                          value && value.trim() !== ''
                            ? Promise.resolve()
                            : Promise.reject(new Error('Nội dung không được bỏ trống'))
                      }
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
                  <Form.Item name='buttonSubmit'>
                    <Button style={{ float: 'right' }} htmlType='submit'>
                      Tạo
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Button style={{ marginBottom: '40px' }} onClick={handleAddWorkingLocation} icon={<PlusOutlined />}>
                Thêm địa điểm làm việc
              </Button>
              <br />
              <Form.Item
                name={'checkAccept'}
                noStyle
                valuePropName='checked'
                rules={[
                  {
                    validator: (_, value) => {
                      return value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Vui lòng chấp nhận các yêu cầu dịch vụ để tiếp tục'))
                    }
                  }
                ]}
              >
                <Checkbox
                  checked={checkAccept}
                  onClick={() => {
                    setCheckAccept(!checkAccept)
                  }}
                >
                  <span style={{ fontWeight: '450', fontFamily: 'sans-serif', paddingLeft: '10px' }}>
                    Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của HFWork
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit' className='sign-up-form-button'>
                  Hoàn tất
                </Button>
              </Form.Item>

              <div className='or-tab-login'>
                <p style={{ textAlign: 'center' }}>
                  <span>Bạn đã có tài khoản?</span>
                  <NavLink to={'/employer-login'}>Đăng nhập ngay</NavLink>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </Col>
      <Col md={8} sm={0} xs={0} className='banner'></Col>
    </Row>
  )
}

export default SignUpEmployer
