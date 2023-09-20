import { Button, Form, Modal, Radio, Select } from 'antd'
import './style.scss'
import { useState } from 'react'
const listCareers = [{ value: 'IT phần mềm' }, { value: 'Công nghệ thông tin' }, { value: 'Bất động sản' }]
const maxItem = [{ value: 'Bạn đã chọn tối đa 3 mục', label: 'Bạn đã chọn tối đa 3 mục', disabled: true }]
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
const listProvince = [{ value: 'TP. Hồ Chí Minh' }, { value: 'Hà Nội' }, { value: 'Đà Nẳng' }]
const listExpYears = [
  { value: 0.9, label: 'Dưới 1 năm' },
  { value: 1, label: '1 năm' },
  { value: 2, label: '2 năm' },
  { value: 3, label: '3 năm' },
  { value: 4, label: '4 năm' },
  { value: 5, label: '5 năm' },
  { value: 6, label: 'Trên 5 năm' }
]
const CVSettings = (props: any) => {
  const { open, handleClose, handleTurnOnFindCV, isTurnOn } = props
  const [form] = Form.useForm()
  const [carrers, setCarrers] = useState([])
  const [provinces, setProvinces] = useState([])
  const [expYears, setExpYears] = useState()
  const [levelDesire, setLevelDesire] = useState('')

  const handleSubmitForm = (value: any) => {
    const data = {
      carrers,
      provinces,
      expYears,
      levelDesire
    }
    console.log('form data post', data)
    handleClose()
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      className='modal-setting-cv'
      title={<div className='title'>Thiết Lập Hồ Sơ</div>}
      open={open}
      // onOk={handleOk}
      onCancel={handleClose}
      footer={''}
    >
      <Form
        name='form-settings-cv'
        className='form-settings-cv'
        initialValues={{ remember: true }}
        onFinish={handleSubmitForm}
        form={form}
        onFinishFailed={onFinishFailed}
        layout='vertical'
      >
        <div className='cv-setting-page-container'>
          <div className='cv-settings-content-wapper'>
            <div className='left-content'>
              <Form.Item
                style={{ marginBottom: '15px' }}
                label={<span style={{ fontWeight: '500' }}>Chọn ngành nghề bạn quan tâm</span>}
                name='careers'
                rules={[{ required: true, message: 'Vui lòng ngành nghề' }]}
              >
                <Select
                  // maxTagCount={2}
                  // maxTagTextLength={8}
                  mode={'multiple'}
                  className='select-custom'
                  showSearch
                  placeholder={'Chọn ngành nghề'}
                  size='large'
                  options={carrers.length === 3 ? maxItem : listCareers}
                  onChange={(value) => setCarrers(value)}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '15px' }}
                label={<span style={{ fontWeight: '500' }}>Chọn cấp bậc công việc</span>}
                name='levelDesire'
                rules={[{ required: true, message: 'Vui lòng chọn cấp bật' }]}
              >
                <Select
                  className='select-custom'
                  showSearch
                  placeholder={'Chọn cấp bậc'}
                  size='large'
                  options={listLevel}
                  onChange={(value) => setLevelDesire(value)}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '15px' }}
                label={<span style={{ fontWeight: '500' }}>Chọn địa điểm làm việc</span>}
                name='provinces'
                rules={[{ required: true, message: 'Vui lòng chọn địa điểm làm việc' }]}
              >
                <Select
                  mode={'multiple'}
                  className='select-custom'
                  showSearch
                  placeholder={'Chọn địa diểm'}
                  size='large'
                  options={provinces.length === 3 ? maxItem : listProvince}
                  onChange={(value) => setProvinces(value)}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '15px' }}
                label={<span style={{ fontWeight: '500' }}>Số năm kinh nghiệm</span>}
                name='expYears'
                rules={[{ required: true, message: 'Vui lòng chọn năm kinh nghiệm' }]}
              >
                <Select
                  className='select-custom'
                  showSearch
                  placeholder={'Chọn địa diểm'}
                  size='large'
                  options={listExpYears}
                  onChange={(value) => setExpYears(value)}
                />
              </Form.Item>
            </div>
            {/* <div className='right-content'>
                
              </div> */}
          </div>
          <div className='btn-container'>
            <Button size='large' onClick={handleClose}>
              Thoát
            </Button>
            {!isTurnOn ? (
              <Button
                onClick={() => handleTurnOnFindCV(true)}
                size='large'
                htmlType='submit'
                style={{ background: 'rgb(255, 125, 85)', color: 'white' }}
              >
                Bật tìm việc
              </Button>
            ) : (
              <Button
                onClick={() => handleTurnOnFindCV(false)}
                size='large'
                htmlType='submit'
                style={{ background: 'rgb(255, 125, 85)', color: 'white' }}
              >
                Tắt tìm việc
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default CVSettings
