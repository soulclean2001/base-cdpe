import { Button, Col, Drawer, Form, Input, Pagination, Row, Select } from 'antd'
import { useState } from 'react'
import './style.scss'
import { FiFilter } from 'react-icons/fi'
import CandidateItem from './components/CandidateItem/CandidateItem'
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

const listProvince = [{ value: 'TP. Hồ Chí Minh' }, { value: 'Hà Nội' }, { value: 'Đà Nẳng' }]
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
const listCandidate = [
  {
    id: '1',
    avatar: 'https://demoda.vn/wp-content/uploads/2022/08/hinh-anh-avatar-nu-de-thuong.jpg',
    nameCandidate: 'Phan Thanh Phong',
    jobTitle: 'Intern Web',
    educationLevel: 'Cử nhân',
    expYear: '1 năm',
    provinceWanted: 'Bình Chánh,Hồ Chí Minh - Gò Vấp, Hồ Chí Minh',
    updateDate: '23/8/2023'
  },
  {
    id: '2',
    avatar: 'https://cdn.tgdd.vn//GameApp/1340221//Anhavatardoi51.-800x800.jpg',
    nameCandidate: 'Tran Minh Hiếu',
    jobTitle: 'Fresher Lỏ',
    educationLevel: 'Cử nhân',
    expYear: '1 năm',
    provinceWanted: 'Bình Chánh,Hồ Chí Minh - Gò Vấp, Hồ Chí Minh',
    updateDate: '22/8/2023'
  }
]
const FindCandidatePage = () => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [nameCandidate, setNameCandidate] = useState('')
  const [position, setPosittion] = useState('')
  const [industries, setIndustries] = useState([])
  const [province, setProvince] = useState([])
  const [expYear, setExpYear] = useState({ min: '', max: '' })
  const [level, setLevel] = useState('')
  const [language, setLanguage] = useState('')
  const [levelLanguage, setLevelLanguage] = useState('')
  const [education, setEducation] = useState('')
  const [rangeYearOld, setRangeYearOld] = useState({ min: '', max: '' })
  //page
  const [pageClick, setPageClick] = useState(1)
  const [limitOnPage, setLimitOnPage] = useState(5)
  const [totalItems, setTotalItems] = useState(1)
  //
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  const handleSubmitForm = (value: any) => {
    const data = {
      nameCandidate,
      position,
      industries,
      province,
      expYear,
      level,
      language,
      levelLanguage,
      education,
      rangeYearOld
    }
    console.log('form data post', data)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const validateMinMaxOrder = (_: any, values: any) => {
    if (expYear.min && expYear.max && parseInt(expYear.min) > parseInt(expYear.max)) {
      return Promise.reject('Vui lòng nhập từ thấp đến cao')
    }
    return Promise.resolve()
  }
  const validateMinMaxOrder2 = (_: any, values: any) => {
    if (rangeYearOld.min && rangeYearOld.max && parseInt(rangeYearOld.min) > parseInt(rangeYearOld.max)) {
      return Promise.reject('Vui lòng nhập từ thấp đến cao')
    }
    return Promise.resolve()
  }
  //set value page click
  const handleChangePage = (valuePageClick: any) => {
    setPageClick(valuePageClick)
    console.log('page', valuePageClick)
  }
  //
  return (
    <div className='find-candidate-page-container'>
      <div className='title'>Tìm Kiếm Ứng Viên</div>
      <div className='btn-filter-container'>
        <Button className='btn-filter-collapsed' onClick={showDrawer}>
          <span className='icon'>
            <FiFilter />
          </span>
          Bộ lọc
        </Button>
        <Drawer
          className='drawer-filter-container'
          title='BỘ LỌC'
          placement={'left'}
          closable={false}
          onClose={onClose}
          open={open}
          key={'left'}
        >
          <Form
            name='form-filter-candidate'
            className='form-filter-candidate-container'
            initialValues={{ remember: true }}
            onFinish={handleSubmitForm}
            form={form}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <Form.Item name='nameCandidate' label={<span style={{ fontWeight: '500' }}>Tên ứng viên</span>}>
              <Input size='middle' placeholder='Tên ứng viên' onChange={(e) => setNameCandidate(e.target.value)} />
            </Form.Item>
            <Form.Item name='position' label={<span style={{ fontWeight: '500' }}>Công việc mong muốn</span>}>
              <Input
                size='middle'
                placeholder='Công việc mong muốn của ứng viên'
                onChange={(e) => setPosittion(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Ngành Nghề</span>} name='industry'>
              <Select
                showSearch
                mode={'multiple'}
                placeholder={'Chọn ngành nghề'}
                size='middle'
                options={industries.length === 3 ? maxItem : listIndustries}
                onChange={(value) => setIndustries(value)}
                maxTagCount={3}
                maxTagTextLength={10}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Khu vực mong muốn</span>} name='province'>
              <Select
                showSearch
                mode={'multiple'}
                placeholder={'Chọn khu vực'}
                size='middle'
                options={province.length === 3 ? maxItem : listProvince}
                onChange={(value) => setProvince(value)}
                maxTagCount={3}
                maxTagTextLength={10}
              />
            </Form.Item>
            <h4 style={{ fontWeight: '500' }}>Năm kinh nghiệm</h4>
            <Form.Item name='rangeExpYear' rules={[{ validator: validateMinMaxOrder }]}>
              <Row justify={'space-between'} style={{ gap: '8px' }}>
                <Col md={11} sm={11} xs={11}>
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    size='middle'
                    placeholder='Từ'
                    onChange={(e) => setExpYear({ ...expYear, min: e.target.value })}
                  />
                </Col>
                <Col md={11} sm={11} xs={11} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    size='middle'
                    placeholder='Đến'
                    onChange={(e) => setExpYear({ ...expYear, max: e.target.value })}
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Cấp Bậc</span>} name='level'>
              <Select
                showSearch
                placeholder={'Chọn cấp bậc'}
                size='middle'
                options={listLevel}
                onChange={(value) => setLevel(value)}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Ngoại ngữ</span>} name='language'>
              <Select
                showSearch
                placeholder={'Chọn ngoại ngữ'}
                size='middle'
                options={listLevel}
                onChange={(value) => setLanguage(value)}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Trình độ ngoại ngữ</span>} name='levelLanguage'>
              <Select
                showSearch
                placeholder={'Chọn trình độ ngoại ngữ'}
                size='middle'
                options={listLevel}
                onChange={(value) => setLevelLanguage(value)}
              />
            </Form.Item>
            <Form.Item label={<span style={{ fontWeight: '500' }}>Trình độ học vấn</span>} name='education'>
              <Select
                showSearch
                placeholder={'Chọn trình độ học vấn'}
                size='middle'
                options={listLevel}
                onChange={(value) => setEducation(value)}
              />
            </Form.Item>
            {/* <h4 style={{ fontWeight: '500' }}>Độ tuổi</h4>
            <Form.Item name='rangeYearOld' rules={[{ validator: validateMinMaxOrder2 }]}>
              <Row justify={'space-between'} style={{ gap: '8px' }}>
                <Col md={11} sm={11} xs={11}>
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    size='middle'
                    placeholder='Từ'
                    onChange={(e) => setRangeYearOld({ ...rangeYearOld, min: e.target.value })}
                  />
                </Col>
                <Col md={11} sm={11} xs={11} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    size='middle'
                    placeholder='Đến'
                    onChange={(e) => setRangeYearOld({ ...rangeYearOld, max: e.target.value })}
                  />
                </Col>
              </Row>
            </Form.Item> */}
            <div className='btn-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button htmlType='submit' style={{ width: '49%', color: 'white', background: 'rgb(255, 125, 85)' }}>
                Tìm kiếm
              </Button>
              <Button style={{ width: '49%' }} onClick={() => form.resetFields()}>
                Cài đặt lại
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
      <div className='content-wapper'>
        {listCandidate ? (
          <>
            <div className='total-search'>{`${listCandidate.length} kết quả được tìm thấy`}</div>

            {listCandidate.map((candidate) => (
              <CandidateItem key={candidate.id} data={candidate} />
            ))}

            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
              <Pagination
                onChange={handleChangePage}
                responsive
                defaultCurrent={1}
                pageSize={limitOnPage}
                //   current={totalItems}
                //   showLessItems={false}
                showSizeChanger={false}
                total={totalItems}
              />
            </div>
          </>
        ) : (
          <>
            <div className='total-search'>{`0 kết quả được tìm thấy`}</div>
            <div>Không tìm thấy ứng viên</div>
          </>
        )}
      </div>
    </div>
  )
}

export default FindCandidatePage
