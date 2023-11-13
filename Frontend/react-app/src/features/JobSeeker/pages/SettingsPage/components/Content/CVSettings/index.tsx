import { Button, Checkbox, Form, Modal, Select } from 'antd'
import './style.scss'
import { useEffect, useState } from 'react'
import { getAllIndustries } from '~/api/industries.api'
import { getAllProviencesApi } from '~/api/provinces.api'
import apiCandidate, { RequestTurnOnFindingJobs } from '~/api/candidate.api'

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

const listExpYears = [
  { value: 0, label: 'Dưới 1 năm' },
  { value: 1, label: '1 năm' },
  { value: 2, label: '2 năm' },
  { value: 3, label: '3 năm' },
  { value: 4, label: '4 năm' },
  { value: 5, label: '5 năm' },
  { value: 6, label: '6 năm' },
  { value: 7, label: '7 năm' },
  { value: 8, label: '8 năm' },
  { value: 9, label: '9 năm' },
  { value: 10, label: '10 năm' },
  { value: 11, label: 'Trên 10 năm' }
]
const listEducationLevel = [
  {
    value: 'Trung học',
    label: 'Trung học'
  },
  {
    value: 'Trung cấp',
    label: 'Trung cấp'
  },
  {
    value: 'Cao đẳng',
    label: 'Cao đẳng'
  },
  {
    value: 'Cử nhân',
    label: 'Cử nhân'
  },
  {
    value: 'Thạc sĩ',
    label: 'Thạc sĩ'
  },
  {
    value: 'Tiến sĩ',
    label: 'Tiến sĩ'
  },
  {
    value: 'Khác',
    label: 'Khác'
  }
]
interface DataOptionType {
  value: string
  [key: string]: any
}
interface CandidateType {
  [key: string]: any
}
const CVSettings = (props: any) => {
  const { open, handleClose, handleTurnOnFindCV, idCV } = props
  const [form] = Form.useForm()
  const [carrers, setCarrers] = useState([])
  const [provinces, setProvinces] = useState([])
  const [expYears, setExpYears] = useState(0)
  const [levelDesire, setLevelDesire] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [publishCV, setPublishCV] = useState(false)
  const [provincesData, setProvincesData] = useState<Array<DataOptionType>>([])
  const [myCanidate, setMyCanidate] = useState<CandidateType>()

  useEffect(() => {
    if (open) {
      fetchProvinces()
      fetchMyCandidate()
    }
  }, [open])
  const fetchProvinces = async () => {
    await getAllProviencesApi().then((rs) => {
      setProvincesData([...provincesData, ...rs])
    })
    // setProvincesData(res)
  }
  const fetchMyCandidate = async () => {
    await apiCandidate.getMyCandidate().then((rs) => {
      if (rs.result) {
        setMyCanidate(rs.result)
        setCarrers(rs.result.industry)
        setProvinces(rs.result.work_location)
        setExpYears(rs.result.experience)
        setEducationLevel(rs.result.education_level)
        setPublishCV(rs.result.cv_public)
        setLevelDesire(rs.result.level)
        form.setFieldsValue({
          careers: rs.result.industry,
          provinces: rs.result.work_location,
          expYears: rs.result.experience,
          educationLevel: rs.result.education_level,
          checkPublish: rs.result.cv_public,
          levelDesire: rs.result.level
        })
      }
    })
  }
  const handleSubmitForm = async () => {
    let request: RequestTurnOnFindingJobs = {
      cv_id: idCV,
      cv_public: publishCV,
      education_level: educationLevel,
      experience: expYears,
      industry: carrers,
      work_location: provinces,
      level: levelDesire
    }

    if (myCanidate) {
      await apiCandidate.updateTurnOnFindingJobs(request).catch(() => {
        return
      })
    } else {
      await apiCandidate.createTurnOnFindingJobs(request).catch(() => {
        return
      })
    }
    handleTurnOnFindCV(publishCV)

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
                  options={carrers.length === 3 ? maxItem : getAllIndustries}
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
                  options={provinces.length === 3 ? maxItem : provincesData}
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
              <Form.Item
                style={{ marginBottom: '15px' }}
                label={<span style={{ fontWeight: '500' }}>Trình độ học vấn</span>}
                name='educationLevel'
                rules={[{ required: true, message: 'Vui lòng chọn trình độ học vấn' }]}
              >
                <Select
                  allowClear
                  className='select-custom'
                  showSearch
                  placeholder={'Chọn trình độ học vấn'}
                  size='large'
                  options={listEducationLevel}
                  onChange={(value) => setEducationLevel(value)}
                />
              </Form.Item>
              <Form.Item
                name={'checkPublish'}
                // noStyle
                valuePropName='checked'
              >
                <Checkbox
                  checked={publishCV}
                  onClick={() => {
                    setPublishCV(!publishCV)
                  }}
                >
                  <span style={{ fontWeight: '450', fontFamily: 'sans-serif', paddingLeft: '10px' }}>Bật tìm kiếm</span>
                </Checkbox>
              </Form.Item>
            </div>
            {/* <div className='right-content'>
                
              </div> */}
          </div>
          <div className='btn-container'>
            <Button size='large' onClick={handleClose}>
              Thoát
            </Button>

            <Button size='large' htmlType='submit' style={{ background: 'rgb(255, 125, 85)', color: 'white' }}>
              Cập nhật
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default CVSettings
