import { getAllProviencesApi, getOneProvincesApi } from '~/api/provinces.api'
import { useEffect, useState } from 'react'

import {
  BankOutlined,
  CaretRightOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { CSSProperties } from 'react'
import type { CollapseProps, RadioChangeEvent } from 'antd'
import { Button, Checkbox, Col, Collapse, Form, Input, Radio, Row, Select } from 'antd'
import './signUpEmployer.scss'
import { NavLink } from 'react-router-dom'
const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: (
      <span className='title-regulations' style={{ fontSize: '19px', fontWeight: 700, color: '#00b14f' }}>
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
        <p style={{ color: '#00b14f', fontWeight: 700, fontSize: '18px' }}>
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

const SignUpEmployer = () => {
  const [form] = Form.useForm()
  // set gender data
  const handleOnChangeSex = (e: RadioChangeEvent) => {
    setSex(e.target.value)
  }
  //provinces data
  const initValue: DataOptionType[] = []
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [districtsData, setDistrictsData] = useState(initValue)
  const [provincesData, setProvincesData] = useState(initValue)
  useEffect(() => {
    fetchProvinces()
    form.setFieldsValue({ district: '' })
    if (province) fetchDistricts()
  }, [province])

  const fetchProvinces = async () => {
    const res = await getAllProviencesApi()

    setProvincesData(res)
  }
  const fetchDistricts = async () => {
    const res = await getOneProvincesApi(province)
    setDistrictsData(res)
  }
  //form state data

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [name, setName] = useState('')
  const [sex, setSex] = useState(0)
  const [phone, setPhone] = useState('')
  const [nameCompany, setNameCompany] = useState('')
  const [position, setPosition] = useState('')
  const [checkAccept, setCheckAccept] = useState(false)

  const handleSubmitSignup = () => {
    const data = {
      email,
      password,
      rePassword,
      name,
      sex,
      phone,
      nameCompany,
      position,
      province,
      district,
      checkAccept
    }
    console.log('form data sign up', data)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Row className='page-sign-up-employer-container'>
      <Col md={16} sm={24} xs={24} className='page-sign-up-employer-wapper'>
        <div className='sign-up-employer-content'>
          <div className='title-container'>
            <div className='title'>HFWork</div>
            <p>Đăng ký tài khoản Nhà tuyển dụng</p>
            <span>Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm dịch vụ Website của chúng tôi.</span>
          </div>
          <div className='regulations-container'>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ border: '1px solid #00b14f' }}
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
                  prefix={<MailOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                    pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
                    message: 'Mật khẩu bao gồm chữ in Hoa - chữ in thường và số, độ dài tối thiểu 8 ký tự'
                  }
                ]}
              >
                <Input.Password
                  size='large'
                  prefix={<LockOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                  })
                ]}
                style={{ paddingTop: '10px' }}
              >
                <Input.Password
                  size='large'
                  prefix={<LockOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                    rules={[{ required: true, message: 'Vui lòng không để trống họ tên' }]}
                    label='Họ và tên'
                  >
                    <Input
                      size='large'
                      className='name-input'
                      prefix={<UserOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                  prefix={<PhoneOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                  >
                    <Input
                      size='large'
                      prefix={<BankOutlined style={{ color: '#00b14f' }} className='site-form-item-icon' />}
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
                    {/* <SelectSortCustom
                      listOptions={listPositions}
                      placeholderValue={'Chọn ví trí công tác'}
                      pickData={position}
                      setData={setPosition}
                    /> */}

                    <Select size='large' options={listPositions} onChange={(value) => setPosition(value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={'space-between'}>
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
                    {/* <SelectSortCustom
                      listOptions={provincesData}
                      pickData={province}
                      setData={setProvince}
                      placeholderValue={'Chọn tỉnh/thành phố'}
                    /> */}

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
                    {/* <SelectSortCustom
                      pickData={district}
                      setData={setDistrict}
                      listOptions={districtsData}
                      placeholderValue={'Chọn quận/huyện'}
                    /> */}

                    <Select showSearch size='large' options={districtsData} onChange={(value) => setDistrict(value)} />
                  </Form.Item>
                </Col>
              </Row>
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
