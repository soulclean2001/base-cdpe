import React, { useState } from 'react'
import iconStatic from '~/utils/icons'
import locale from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import './cv.scss'
import InputCustom from './components/InputCustom'
import InputAutoResize from './components/InputAutoResize'
import InputEditAutoResize from './components/InputEditAutoResize'
import ImgCrop from 'antd-img-crop'
import { Collapse, DatePicker, Select, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile } from 'antd/es/upload'
import { DeleteRowOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { LanguageLevel, ResumeType, SkillLevel } from '~/types/resume.type'
import Right from './Right'

const initResume: ResumeType = {
  _id: '',
  user_id: '',
  title: 'Untitled',
  user_info: {
    property_name: 'Thông tin cá nhân',
    wanted_job_title: '',
    avatar: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postal_code: '',
    driving_license: '',
    nationality: '',
    place_of_birth: '',
    date_of_birth: ''
  },
  professional_summary: {
    content: '',
    property_name: 'Tiểu sử chuyên môn'
  },
  employment_histories: {
    data: [
      {
        city: '',
        description: '',
        employer: '',
        end_date: '',
        job_title: '',
        start_date: ''
      }
    ],
    property_name: 'Lịch sử công việc'
  },
  educations: {
    property_name: 'Học vấn',
    data: [
      {
        city: '',
        degree: '',
        description: '',
        end_date: '',
        school: '',
        start_date: ''
      }
    ]
  },
  social_or_website: {
    data: [
      {
        label: '',
        link: ''
      }
    ],
    property_name: 'Trang web hoặc liên kết'
  },
  skills: {
    data: [
      {
        skill_name: '',
        level: ''
      }
    ],
    property_name: 'Kỹ năng',
    is_show: false
  },
  references: {
    data: [
      {
        name: '',
        company: '',
        phone: '',
        email: ''
      }
    ],
    property_name: 'Người giới thiệu',
    is_show: false
  },
  internships: {
    data: [
      {
        city: '',
        description: '',
        employer: '',
        end_date: '',
        job_title: '',
        start_date: ''
      }
    ],
    property_name: 'Thực tập'
  },
  courses: {
    data: [
      {
        end_date: '',
        institution: '',
        title: '',
        start_date: ''
      }
    ],
    property_name: 'Khóa học'
  },
  languages: {
    data: [
      {
        level: '',
        language: ''
      }
    ],
    property_name: 'Ngôn ngữ'
  },
  hobbies: {
    description: '',
    property_name: 'Sở thích'
  },
  extra_curricular_activities: {
    data: [
      {
        city: '',
        function_title: '',
        employer: '',
        description: '',
        end_date: '',
        start_date: ''
      }
    ],
    property_name: 'Hoạt động'
  },
  additional_info: [
    {
      data: [
        {
          title: '',
          city: '',
          start_date: '',
          end_date: '',
          description: ''
        }
      ],
      property_name: 'Untitled'
    }
  ],
  status: 'draft',
  is_show: true
}

const defaultResume: ResumeType = {
  _id: '',
  user_id: '',
  title: 'Untitled',
  user_info: {
    property_name: 'Thông tin cá nhân',
    wanted_job_title: '',
    avatar: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    postal_code: '',
    driving_license: '',
    nationality: '',
    place_of_birth: '',
    date_of_birth: ''
  },
  professional_summary: {
    content: '',
    property_name: 'Tiểu sử chuyên môn'
  },
  employment_histories: {
    data: [
      {
        city: '',
        description: '',
        employer: '',
        end_date: '',
        job_title: '',
        start_date: ''
      }
    ],
    property_name: 'Lịch sử công việc'
  },
  educations: {
    property_name: 'Học vấn',
    data: [
      {
        city: '',
        degree: '',
        description: '',
        end_date: '',
        school: '',
        start_date: ''
      }
    ]
  },
  social_or_website: {
    data: [
      {
        label: '',
        link: ''
      }
    ],
    property_name: 'Trang web hoặc liên kết'
  },
  skills: {
    data: [
      {
        skill_name: '',
        level: ''
      }
    ],
    property_name: 'Kỹ năng',
    is_show: false
  },
  references: {
    data: [],
    property_name: 'Người giới thiệu',
    is_show: false
  },
  internships: {
    data: [],
    property_name: 'Thực tập'
  },
  courses: {
    data: [],
    property_name: 'Khóa học'
  },
  languages: {
    data: [],
    property_name: 'Ngôn ngữ'
  },
  hobbies: {
    description: '',
    property_name: 'Sở thích'
  },
  extra_curricular_activities: {
    data: [],
    property_name: 'Hoạt động'
  },
  additional_info: [],
  status: 'draft',
  is_show: true
}

const CV = () => {
  const [isAddInfo, setIsAddInfo] = useState(false)
  const [openIndex, setOpenIndex] = useState([1, 1, 1, 1, 1, 1, 1])
  // const plugin = ClassicEditor.builtinPlugins.map((plugin) => plugin.pluginName)

  const [data, setData] = useState<ResumeType>(defaultResume)

  console.log(data)
  const {
    additional_info,
    courses,
    educations,
    employment_histories,
    extra_curricular_activities,
    hobbies,
    internships,
    is_show,
    languages,
    professional_summary,
    references,
    skills,
    social_or_website,
    status,
    title,
    user_id,
    user_info
  } = data
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ])

  const onFocusInput = () => {}
  const preventRequest = () => false
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const handleAddMoreUserInfoDetails = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setIsAddInfo(!isAddInfo)
  }

  const handleDeleteSection = (key: string, index: number) => {
    setData((prv) => {
      prv[key] = {
        data: [],
        property_name: initResume[key].property_name
      }

      return {
        ...prv
      }
    })

    setOpenIndex((prv) => {
      prv[index] = 1
      return [...prv]
    })
  }

  const handleAddSection = (index: number, key: string) => {
    if (!openIndex[index]) return

    const item = initResume[key].data[0]
    const name = initResume[key].property_name

    setData((prvData) => {
      const extrc = prvData[key].data
      if (extrc && extrc.length > 0) {
        prvData[key].data = [...extrc, item]
      } else {
        prvData[key].data = [item]
      }

      prvData[key].property_name = name
      return {
        ...prvData
      }
    })
    setOpenIndex((prv) => {
      prv[index] = 0
      return [...prv]
    })
  }

  const handleSetData = (parentKey: string, key: string, value: string) => {
    setData((prevData) => {
      prevData[parentKey][key] = value
      return {
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [key]: value
        }
      }
    })
  }

  const handleSetSubData = (parentIndex: number, parentKey: string, key: string, value: string) => {
    setData((prevData) => {
      let arrObj = prevData[parentKey] // additional_info
      let objData = arrObj[parentIndex] // additional_info[0]
      arrObj[parentIndex] = { ...objData, [key]: value }

      return {
        ...prevData,
        [parentKey]: [...arrObj]
      }
    })
  }

  const handleSetDataArray = (parentKey: string, index: number, key: string, value: string) => {
    setData((prevData) => {
      let arrData = prevData[parentKey].data

      if (arrData.length === 0) arrData = [{}]

      arrData[index] = { ...arrData[index], [key]: value }

      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          data: [...arrData]
        }
      }
    })
  }

  const handleSetSubDataArray = (parentIndex: number, parentKey: string, index: number, key: string, value: string) => {
    setData((prevData) => {
      let arrObj = prevData[parentKey]
      let arrData = arrObj[parentIndex].data || []

      if (arrData.length === 0) arrData = [{}]

      // arrObj = arrObj.filter((_, idx) => idx !== parentIndex)

      arrData[index] = { ...arrData[index], [key]: value }

      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: [...arrObj]
      }
    })
  }

  const handleAddDataArray = (parentKey: string, value: object) => {
    setData((prevData) => {
      let arrData = prevData[parentKey].data

      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          data: [...arrData, value]
        }
      }
    })
  }

  const handleAddSubDataArray = (parentIndex: number, parentKey: string, value: object) => {
    setData((prevData) => {
      let arrObj = prevData[parentKey] // additional_info
      let arrData = arrObj[parentIndex].data // additional_info[0].data
      arrObj[parentIndex].data = [...arrData, value]

      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: [...arrObj]
      }
    })
  }

  const handleDeleteDataArray = (parentKey: string, index: number) => {
    setData((prevData) => {
      let arrData = prevData[parentKey].data
      if (arrData && Array.isArray(arrData) && arrData[index]) {
        arrData = arrData.filter((_, id) => id !== index)
      }

      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          data: [...arrData]
        }
      }
    })
  }

  const handleDeleteSubDataArray = (parentIndex: number, parentKey: string, index: number) => {
    setData((prevData) => {
      let arrObj = prevData[parentKey]
      let arrData = (arrObj[parentIndex].data || []) as Array<any>
      if (arrData.length > 0) {
        arrObj[parentIndex].data = arrData.filter((_, idx) => idx !== index)
      }

      if (arrData.length === 0) {
        arrData = []
      }
      // prevData[parentKey][index][key] = value
      return {
        ...prevData,
        [parentKey]: [...arrObj]
      }
    })
  }

  return (
    <>
      <div className='wrap'>
        <div className='left'>
          <div className='title'>
            <InputAutoResize
              style={{
                fontSize: '19px',
                fontWeight: 500
              }}
              onChange={(e) => {
                setData({ ...data, title: e.target.value })
              }}
              value={data.title}
              id='1'
            />
          </div>

          <div className='title-left'>
            {/* START  personal-detail*/}
            <InputEditAutoResize
              value={user_info.property_name || ''}
              defaultstring={initResume.user_info.property_name as string}
              onChange={(e) => handleSetData('user_info', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('user_info', 'property_name', value)
              }}
              id='2'
              width='150px'
            />
            <div className='personal-detail'>
              <div className='personal-detail-row'>
                <div className='personal-detail-col-left'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Tên công việc mong muốn</p>
                    <InputCustom
                      // value={user_info.wanted_job_title || ''}
                      onChange={(e) => handleSetData('user_info', 'wanted_job_title', e.target.value)}
                      type='text'
                    />
                  </div>
                </div>
                <div className='personal-detail-col-right wrap-upload'>
                  <div className='upload-avatar-resume'>
                    <ImgCrop rotationSlider>
                      <Upload
                        maxCount={1}
                        listType='picture-card'
                        beforeUpload={preventRequest}
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        className='custom-upload'
                      >
                        {fileList.length < 1 && '+ Upload'}
                      </Upload>
                    </ImgCrop>
                    <span style={{ marginLeft: '10px' }}>Upload photo</span>
                  </div>
                </div>
              </div>
              <div className='personal-detail-row'>
                <div className='personal-detail-col-left'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Họ</p>
                    <InputCustom
                      // value={user_info.first_name || ''}
                      onChange={(e) => handleSetData('user_info', 'first_name', e.target.value)}
                      type='text'
                    />
                  </div>
                </div>
                <div className='personal-detail-col-right'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Tên</p>
                    <InputCustom
                      // value={user_info.last_name || ''}
                      onChange={(e) => handleSetData('user_info', 'last_name', e.target.value)}
                      type='text'
                    />
                  </div>
                </div>
              </div>
              <div className='personal-detail-row'>
                <div className='personal-detail-col-left'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Email</p>
                    <InputCustom
                      type='text'
                      // value={user_info.email || ''}
                      onChange={(e) => handleSetData('user_info', 'email', e.target.value)}
                    />
                  </div>
                </div>
                <div className='personal-detail-col-right'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Số điện thoại</p>
                    <InputCustom
                      type='text'
                      // value={user_info.phone || ''}
                      onChange={(e) => handleSetData('user_info', 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className='personal-detail-row'>
                <div className='personal-detail-col-left'>
                  <div style={{ width: '90%' }}>
                    <p className='title-name'>Thành phố</p>
                    <InputCustom
                      type='text'
                      // value={user_info.city || ''}
                      onChange={(e) => handleSetData('user_info', 'city', e.target.value)}
                    />
                  </div>
                </div>
                <div className='personal-detail-col-right'>
                  {/* <div style={{ width: '90%' }}>
                    <p className='title-name'>Số điện thoại</p>
                    <InputCustom type='text' />
                  </div> */}
                </div>
              </div>
              {isAddInfo && (
                <>
                  <div className='personal-detail-row'>
                    <div className='personal-detail-col-left'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Địa chỉ</p>
                        <InputCustom
                          type='text'
                          // value={user_info.address || ''}
                          onChange={(e) => handleSetData('user_info', 'address', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='personal-detail-col-right'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Mã bưu điện</p>
                        <InputCustom
                          type='text'
                          // value={user_info.postal_code || ''}
                          onChange={(e) => handleSetData('user_info', 'postal_code', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='personal-detail-row'>
                    <div className='personal-detail-col-left'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Bằng lái xe</p>
                        <InputCustom
                          type='text'
                          // value={user_info.driving_license || ''}
                          onChange={(e) => handleSetData('user_info', 'driving_license', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='personal-detail-col-right'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Quốc tịch</p>
                        <InputCustom
                          type='text'
                          // value={user_info.country || ''}
                          onChange={(e) => handleSetData('user_info', 'country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='personal-detail-row'>
                    <div className='personal-detail-col-left'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Nơi sinh</p>
                        <InputCustom
                          type='text'
                          // value={user_info.place_of_birth || ''}
                          onChange={(e) => handleSetData('user_info', 'place_of_birth', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='personal-detail-col-right'>
                      <div style={{ width: '90%' }}>
                        <p className='title-name'>Ngày sinh</p>
                        <InputCustom
                          type='text'
                          // value={user_info.date_of_birth || ''}
                          onChange={(e) => handleSetData('user_info', 'date_of_birth', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <a className='btn-additional-details' onClick={handleAddMoreUserInfoDetails}>
                {isAddInfo ? 'Ẩn' : 'Thêm'} thông tin chi tiết{' '}
                {isAddInfo ? (
                  <UpOutlined style={{ fontSize: '15px' }} />
                ) : (
                  <DownOutlined style={{ fontSize: '15px' }} />
                )}
              </a>
            </div>
            {/* END  personal-detail*/}

            {/* START Professional Summary */}

            <InputEditAutoResize
              value={professional_summary.property_name || ''}
              defaultstring={initResume.professional_summary.property_name as string}
              onChange={(e) => handleSetData('professional_summary', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('professional_summary', 'property_name', value)
              }}
              id='3'
              width='200px'
            />
            <p style={{ fontSize: '12px' }}>
              Viết 2-4 câu ngắn gọn để người đọc hứng thú! Đề cập đến vai trò, kinh nghiệm và quan trọng nhất của bạn -
              những thành tựu lớn nhất, những phẩm chất và kỹ năng tốt nhất của bạn.
            </p>
            <div className='professional-summary'>
              <p style={{ fontSize: '12px' }}>Mẹo nhà tuyển dụng: viết 50-200 ký tự để tăng cơ hội phỏng vấn</p>
              {EditorCustom(data.professional_summary.content, (value) =>
                handleSetData('professional_summary', 'content', value)
              )}
              {/* END Professional Summary */}
            </div>

            {/* START Employment History */}
            <InputEditAutoResize
              value={employment_histories.property_name || ''}
              defaultstring={initResume.employment_histories.property_name as string}
              onChange={(e) => handleSetData('employment_histories', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('employment_histories', 'property_name', value)
              }}
              id='4'
              width='200px'
            />
            <div className='employment-history'>
              {data &&
                data.employment_histories.data &&
                data.employment_histories.data.map((item, index) => (
                  <div key={index} className='cv-item'>
                    <Collapse
                      expandIconPosition={'end'}
                      style={{ backgroundColor: 'white' }}
                      size='large'
                      items={[
                        {
                          key: '1',
                          label: CustomTitle(item.job_title, item.employer, item.start_date, item.end_date),
                          children: (
                            <div className='personal-detail'>
                              <div className='personal-detail-row'>
                                <div className='personal-detail-col-left'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>Job Title</p>
                                    <InputCustom
                                      value={item.job_title}
                                      onChange={(e) =>
                                        handleSetDataArray('employment_histories', index, 'job_title', e.target.value)
                                      }
                                      type='text'
                                    />
                                  </div>
                                </div>
                                <div className='personal-detail-col-right'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>Employer</p>
                                    <InputCustom
                                      value={item.employer}
                                      onChange={(e) =>
                                        handleSetDataArray('employment_histories', index, 'employer', e.target.value)
                                      }
                                      type='text'
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='personal-detail-row'>
                                <div className='personal-detail-col-left'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>Start & End Date</p>
                                    <div className='start-end-date'>
                                      <DatePicker
                                        value={item.start_date ? dayjs(item.start_date, 'MM/YY') : undefined}
                                        onChange={(e) => {
                                          handleSetDataArray(
                                            'employment_histories',
                                            index,
                                            'start_date',
                                            e?.format('MM/YY') || ''
                                          )
                                        }}
                                        className='input-date'
                                        placeholder='MM/YY'
                                        format='MM/YY'
                                      />
                                      <span style={{ width: '10px' }}></span>
                                      <DatePicker
                                        value={item.end_date ? dayjs(item.end_date || null, 'MM/YY') : undefined}
                                        className='input-date'
                                        format='MM/YY'
                                        placeholder='MM/YY'
                                        onChange={(e) => {
                                          handleSetDataArray(
                                            'employment_histories',
                                            index,
                                            'end_date',
                                            e?.format('MM/YY') || ''
                                          )
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className='personal-detail-col-right'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>City</p>
                                    <InputCustom
                                      type='text'
                                      value={item.city}
                                      onChange={(e) =>
                                        handleSetDataArray('employment_histories', index, 'city', e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='personal-detail-row'>
                                <div style={{ width: '100%' }}>
                                  <p className='title-name'>Description</p>
                                  {EditorCustom(item.description, (value) =>
                                    handleSetDataArray('employment_histories', index, 'description', value)
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ]}
                    />
                    <button
                      className='btn-delete-row'
                      onClick={() => {
                        handleDeleteDataArray('employment_histories', index)
                      }}
                    >
                      <DeleteRowOutlined />
                    </button>
                  </div>
                ))}
            </div>
            <div>
              <button
                className='btn-add-employment'
                style={{ fontSize: '15px' }}
                onClick={() => {
                  const newData = {
                    city: '',
                    description: '',
                    employer: '',
                    end_date: '',
                    job_title: '',
                    start_date: ''
                  }
                  handleAddDataArray('employment_histories', newData)
                }}
              >
                <PlusOutlined /> Thêm việc làm
              </button>
            </div>
            {/* END Employment History */}

            {/* START Education */}
            <InputEditAutoResize
              value={educations.property_name || ''}
              defaultstring={initResume.educations.property_name as string}
              onChange={(e) => handleSetData('educations', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('educations', 'property_name', value)
              }}
              id='5'
              width='200px'
            />
            <div className='employment-history'>
              {data &&
                data.educations.data &&
                data.educations.data.map((item, index) => (
                  <div key={index} className='cv-item'>
                    <Collapse
                      expandIconPosition={'end'}
                      style={{ backgroundColor: 'white' }}
                      size='large'
                      items={[
                        {
                          key: '1',
                          label: CustomTitle(item.school, item.degree, item.start_date, item.end_date),
                          children: (
                            <div className='personal-detail'>
                              <div className='personal-detail-row'>
                                <div className='personal-detail-col-left'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>School</p>
                                    <InputCustom
                                      value={item.school}
                                      onChange={(e) =>
                                        handleSetDataArray('educations', index, 'school', e.target.value)
                                      }
                                      type='text'
                                    />
                                  </div>
                                </div>
                                <div className='personal-detail-col-right'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>Degree</p>
                                    <InputCustom
                                      value={item.degree}
                                      onChange={(e) =>
                                        handleSetDataArray('educations', index, 'degree', e.target.value)
                                      }
                                      type='text'
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='personal-detail-row'>
                                <div className='personal-detail-col-left'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>Start & End Date</p>
                                    <div className='start-end-date'>
                                      <DatePicker
                                        value={item.start_date ? dayjs(item.start_date, 'MM/YY') : undefined}
                                        onChange={(e) => {
                                          handleSetDataArray(
                                            'educations',
                                            index,
                                            'start_date',
                                            e?.format('MM/YY') || ''
                                          )
                                        }}
                                        className='input-date'
                                        placeholder='MM/YY'
                                        format='MM/YY'
                                      />
                                      <span style={{ width: '10px' }}></span>
                                      <DatePicker
                                        value={item.end_date ? dayjs(item.end_date || null, 'MM/YY') : undefined}
                                        className='input-date'
                                        format='MM/YY'
                                        placeholder='MM/YY'
                                        onChange={(e) => {
                                          handleSetDataArray('educations', index, 'end_date', e?.format('MM/YY') || '')
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className='personal-detail-col-right'>
                                  <div style={{ width: '95%' }}>
                                    <p className='title-name'>City</p>
                                    <InputCustom
                                      value={item.city}
                                      onChange={(e) => handleSetDataArray('educations', index, 'city', e.target.value)}
                                      type='text'
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='personal-detail-row'>
                                <div style={{ width: '100%' }}>
                                  <p className='title-name'>Description</p>
                                  {EditorCustom(item.description, (value) =>
                                    handleSetDataArray('educations', index, 'description', value)
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ]}
                    />
                    <button
                      className='btn-delete-row'
                      onClick={() => {
                        handleDeleteDataArray('educations', index)
                      }}
                    >
                      <DeleteRowOutlined />
                    </button>
                  </div>
                ))}
            </div>
            <div>
              <button
                className='btn-add-employment'
                style={{ fontSize: '15px' }}
                onClick={() => {
                  const newData = {
                    city: '',
                    degree: '',
                    description: '',
                    end_date: '',
                    school: '',
                    start_date: ''
                  }
                  handleAddDataArray('educations', newData)
                }}
              >
                <PlusOutlined /> Thêm học vấn
              </button>
            </div>
            {/* END Education */}

            {/* START Websites & Social Links */}
            <InputEditAutoResize
              value={social_or_website.property_name || ''}
              defaultstring={initResume.social_or_website.property_name as string}
              onChange={(e) => handleSetData('social_or_website', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('social_or_website', 'property_name', value)
              }}
              id='6'
              width='auto'
            />
            <div className='employment-history'>
              {data &&
                data.social_or_website.data &&
                data.social_or_website.data.map((item, index) => (
                  <div key={index} className='cv-item'>
                    <Collapse
                      expandIconPosition={'end'}
                      style={{ backgroundColor: 'white' }}
                      size='large'
                      items={[
                        {
                          key: '1',
                          label: CustomTitle(item.label, item.link),
                          children: (
                            <>
                              <div className='personal-detail'>
                                <div className='personal-detail-row'>
                                  <div className='personal-detail-col-left'>
                                    <div style={{ width: '95%' }}>
                                      <p className='title-name'>Label</p>
                                      <InputCustom
                                        value={item.label}
                                        onChange={(e) =>
                                          handleSetDataArray('social_or_website', index, 'label', e.target.value)
                                        }
                                        type='text'
                                      />
                                    </div>
                                  </div>
                                  <div className='personal-detail-col-right'>
                                    <div style={{ width: '95%' }}>
                                      <p className='title-name'>Link</p>
                                      <InputCustom
                                        value={item.link}
                                        onChange={(e) =>
                                          handleSetDataArray('social_or_website', index, 'link', e.target.value)
                                        }
                                        type='text'
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        }
                      ]}
                    />
                    <button
                      className='btn-delete-row'
                      onClick={() => {
                        handleDeleteDataArray('social_or_website', index)
                      }}
                    >
                      <DeleteRowOutlined />
                    </button>
                  </div>
                ))}
            </div>

            <div>
              <button
                className='btn-add-employment'
                style={{ fontSize: '15px' }}
                onClick={() => {
                  const newData = {
                    label: '',
                    link: ''
                  }
                  handleAddDataArray('social_or_website', newData)
                }}
              >
                <PlusOutlined /> Thêm liên kết
              </button>
            </div>
            {/* END Websites & Social Links */}

            {/* START Skills */}
            <InputEditAutoResize
              value={skills.property_name || ''}
              defaultstring={initResume.skills.property_name as string}
              onChange={(e) => handleSetData('skills', 'property_name', e.target.value)}
              setdefaultdata={(value) => {
                handleSetData('skills', 'property_name', value)
              }}
              id='7'
              width='auto'
            />
            <div className='employment-history'>
              {data &&
                data.skills.data &&
                data.skills.data.map((item, index) => (
                  <div key={index} className='cv-item'>
                    <Collapse
                      expandIconPosition={'end'}
                      style={{ backgroundColor: 'white' }}
                      size='large'
                      items={[
                        {
                          key: '1',
                          label: CustomTitle(item.skill_name, '', item.level),
                          children: (
                            <>
                              <div className='personal-detail'>
                                <div className='personal-detail-row'>
                                  <div className='personal-detail-col-left'>
                                    <div style={{ width: '95%' }}>
                                      <p className='title-name'>Skill</p>
                                      <InputCustom
                                        value={item.skill_name}
                                        onChange={(e) =>
                                          handleSetDataArray('skills', index, 'skill_name', e.target.value)
                                        }
                                        type='text'
                                      />
                                    </div>
                                  </div>
                                  <div className='personal-detail-col-right'>
                                    <div style={{ width: '95%' }}>
                                      <p className='title-name'>Level</p>
                                      <Select
                                        className='select-level'
                                        value={item.level}
                                        showSearch
                                        onChange={(e) => {
                                          handleSetDataArray(
                                            'skills',
                                            index,
                                            'level',
                                            Object.keys(SkillLevel)[Number(e) - 1]
                                          )
                                        }}
                                        style={{ width: 200 }}
                                        placeholder='Search to Select'
                                        optionFilterProp='children'
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        // filterSort={(optionA, optionB) =>
                                        //   (optionA?.label ?? '')
                                        //     .toLowerCase()
                                        //     .localeCompare((optionB?.label ?? '').toLowerCase())
                                        // }
                                        options={[
                                          {
                                            value: '1',
                                            label: 'Novice'
                                          },
                                          {
                                            value: '2',
                                            label: 'Beginer'
                                          },
                                          {
                                            value: '3',
                                            label: 'Skillful'
                                          },
                                          {
                                            value: '4',
                                            label: 'Experienced'
                                          },
                                          {
                                            value: '5',
                                            label: 'Expert'
                                          }
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        }
                      ]}
                    />
                    <button
                      className='btn-delete-row'
                      onClick={() => {
                        handleDeleteDataArray('skills', index)
                      }}
                    >
                      <DeleteRowOutlined />
                    </button>
                  </div>
                ))}
            </div>

            <div>
              <button
                className='btn-add-employment'
                style={{ fontSize: '15px' }}
                onClick={() => {
                  const newData = {
                    skill_name: '',
                    level: ''
                  }
                  handleAddDataArray('skills', newData)
                }}
              >
                <PlusOutlined /> Thêm kỹ năng
              </button>
            </div>
            {/* END Skills */}

            {/* START Untitled */}

            {openIndex[0] === 0 &&
              data &&
              data.additional_info &&
              data.additional_info.map((infos, pIndex) => (
                <React.Fragment key={pIndex}>
                  <InputEditAutoResize
                    deletesection={() => {
                      setData((prv) => {
                        if (prv.additional_info.length === 1) {
                          delete prv.additional_info[pIndex]
                          prv.additional_info = []
                        } else {
                          prv.additional_info = prv.additional_info.filter((_, index) => index !== pIndex)
                        }

                        return {
                          ...prv
                        }
                      })
                    }}
                    value={infos.property_name + pIndex || ''}
                    defaultstring={'Untitled'}
                    onChange={(e) => handleSetSubData(pIndex, 'additional_info', 'property_name', e.target.value)}
                    setdefaultdata={(value) => {
                      handleSetSubData(pIndex, 'additional_info', 'property_name', value)
                    }}
                    id={'8' + pIndex}
                    width='auto'
                  />
                  <div className='employment-history'>
                    {infos &&
                      infos.data &&
                      infos.data.map((info, index) => (
                        <div key={index} className='cv-item'>
                          <Collapse
                            expandIconPosition={'end'}
                            style={{ backgroundColor: 'white' }}
                            size='large'
                            items={[
                              {
                                key: '1' + '8' + pIndex + '' + index,
                                label: CustomTitle(info.title, info.city, info.start_date, info.end_date),
                                children: (
                                  <div className='personal-detail'>
                                    <div className='personal-detail-row'>
                                      <div className='personal-detail-col-left'>
                                        <div style={{ width: '95%' }}>
                                          <p className='title-name'>Activity name, job title, book title, etc.</p>
                                          <InputCustom
                                            value={info.title}
                                            type='text'
                                            onChange={(e) =>
                                              handleSetSubDataArray(
                                                pIndex,
                                                'additional_info',
                                                index,
                                                'title',
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className='personal-detail-col-right'>
                                        <div style={{ width: '95%' }}>
                                          <p className='title-name'>City</p>
                                          <InputCustom
                                            value={info.city}
                                            type='text'
                                            onChange={(e) =>
                                              handleSetSubDataArray(
                                                pIndex,
                                                'additional_info',
                                                index,
                                                'city',
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className='personal-detail-row'>
                                      <div className='personal-detail-col-left'>
                                        <div style={{ width: '95%' }}>
                                          <p className='title-name'>Start & End Date</p>
                                          <div className='start-end-date'>
                                            <DatePicker
                                              value={info.start_date ? dayjs(info.start_date, 'MM/YY') : undefined}
                                              onChange={(e) => {
                                                handleSetSubDataArray(
                                                  pIndex,
                                                  'additional_info',
                                                  index,
                                                  'start_date',
                                                  e?.format('MM/YY') || ''
                                                )
                                              }}
                                              className='input-date'
                                              placeholder='MM/YY'
                                              format='MM/YY'
                                            />
                                            <span style={{ width: '10px' }}></span>
                                            <DatePicker
                                              value={info.end_date ? dayjs(info.end_date || null, 'MM/YY') : undefined}
                                              className='input-date'
                                              format='MM/YY'
                                              placeholder='MM/YY'
                                              onChange={(e) => {
                                                handleSetSubDataArray(
                                                  pIndex,
                                                  'additional_info',
                                                  index,
                                                  'end_date',
                                                  e?.format('MM/YY') || ''
                                                )
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className='personal-detail-col-right'>
                                        {/* <div style={{ width: '95%' }}>
                                <p className='title-name'>City</p>
                                <InputCustom type='text' />
                              </div> */}
                                      </div>
                                    </div>
                                    <div className='personal-detail-row'>
                                      <div style={{ width: '100%' }}>
                                        <p className='title-name'>Description</p>
                                        {EditorCustom(info.description, (value) =>
                                          handleSetSubDataArray(pIndex, 'additional_info', index, 'description', value)
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            ]}
                          />
                          <button
                            className='btn-delete-row'
                            onClick={() => {
                              handleDeleteSubDataArray(pIndex, 'additional_info', index)
                            }}
                          >
                            <DeleteRowOutlined />
                          </button>
                        </div>
                      ))}
                  </div>

                  <div>
                    <button
                      className='btn-add-employment'
                      style={{ fontSize: '15px' }}
                      onClick={() => {
                        const newData = {
                          title: '',
                          city: '',
                          start_date: '',
                          end_date: '',
                          description: ''
                        }
                        handleAddSubDataArray(pIndex, 'additional_info', newData)
                      }}
                    >
                      <PlusOutlined /> Thêm tùy chọn
                    </button>
                  </div>
                </React.Fragment>
              ))}

            {/* END Untitled */}

            {/* START Courses */}
            {openIndex[1] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('courses', 1)
                  }}
                  value={courses.property_name || ''}
                  defaultstring={initResume.courses.property_name as string}
                  onChange={(e) => handleSetData('courses', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('courses', 'property_name', value)
                  }}
                  id='9'
                  width='auto'
                />
                <div className='employment-history'>
                  {data &&
                    data.courses.data &&
                    data.courses.data.map((item, index) => (
                      <div key={index} className='cv-item'>
                        <Collapse
                          expandIconPosition={'end'}
                          style={{ backgroundColor: 'white' }}
                          size='large'
                          items={[
                            {
                              key: '1',
                              label: CustomTitle(item.title, item.institution, item.start_date, item.end_date),
                              children: (
                                <div className='personal-detail'>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Course</p>
                                        <InputCustom
                                          value={item.title}
                                          onChange={(e) =>
                                            handleSetDataArray('courses', index, 'title', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Institution</p>
                                        <InputCustom
                                          value={item.institution}
                                          onChange={(e) =>
                                            handleSetDataArray('courses', index, 'institution', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Start & End Date</p>
                                        <div className='start-end-date'>
                                          <DatePicker
                                            value={item.start_date ? dayjs(item.start_date, 'MM/YY') : undefined}
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'courses',
                                                index,
                                                'start_date',
                                                e?.format('MM/YY') || ''
                                              )
                                            }}
                                            className='input-date'
                                            placeholder='MM/YY'
                                            format='MM/YY'
                                          />
                                          <span style={{ width: '10px' }}></span>
                                          <DatePicker
                                            value={item.end_date ? dayjs(item.end_date || null, 'MM/YY') : undefined}
                                            className='input-date'
                                            format='MM/YY'
                                            placeholder='MM/YY'
                                            onChange={(e) => {
                                              handleSetDataArray('courses', index, 'end_date', e?.format('MM/YY') || '')
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      {/* <div style={{ width: '95%' }}>
                                <p className='title-name'>City</p>
                                <InputCustom type='text' />
                              </div> */}
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          ]}
                        />
                        <button
                          className='btn-delete-row'
                          onClick={() => {
                            handleDeleteDataArray('courses', index)
                          }}
                        >
                          <DeleteRowOutlined />
                        </button>
                      </div>
                    ))}
                </div>

                <div>
                  <button
                    className='btn-add-employment'
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      const newData = {
                        end_date: '',
                        institution: '',
                        title: '',
                        start_date: ''
                      }

                      handleAddDataArray('courses', newData)
                    }}
                  >
                    <PlusOutlined /> Thêm khóa học
                  </button>
                </div>
              </>
            )}

            {/* END Courses */}

            {/* START Internships */}
            {openIndex[2] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('internships', 2)
                  }}
                  value={internships.property_name || ''}
                  defaultstring={initResume.internships.property_name as string}
                  onChange={(e) => handleSetData('internships', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('internships', 'property_name', value)
                  }}
                  id='10'
                  width='200px'
                />
                <div className='employment-history'>
                  {data &&
                    data.internships.data &&
                    data.internships.data.map((item, index) => (
                      <div key={index} className='cv-item'>
                        <Collapse
                          expandIconPosition={'end'}
                          style={{ backgroundColor: 'white' }}
                          size='large'
                          items={[
                            {
                              key: '1',
                              label: CustomTitle(item.job_title, item.employer, item.start_date, item.end_date),
                              children: (
                                <div className='personal-detail'>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Job Title</p>
                                        <InputCustom
                                          value={item.job_title}
                                          onChange={(e) =>
                                            handleSetDataArray('internships', index, 'job_title', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Employer</p>
                                        <InputCustom
                                          value={item.employer}
                                          onChange={(e) =>
                                            handleSetDataArray('internships', index, 'employer', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Start & End Date</p>
                                        <div className='start-end-date'>
                                          <DatePicker
                                            value={item.start_date ? dayjs(item.start_date, 'MM/YY') : undefined}
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'internships',
                                                index,
                                                'start_date',
                                                e?.format('MM/YY') || ''
                                              )
                                            }}
                                            className='input-date'
                                            placeholder='MM/YY'
                                            format='MM/YY'
                                          />
                                          <span style={{ width: '10px' }}></span>
                                          <DatePicker
                                            value={item.end_date ? dayjs(item.end_date || null, 'MM/YY') : undefined}
                                            className='input-date'
                                            format='MM/YY'
                                            placeholder='MM/YY'
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'internships',
                                                index,
                                                'end_date',
                                                e?.format('MM/YY') || ''
                                              )
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>City</p>
                                        <InputCustom
                                          value={item.city}
                                          onChange={(e) =>
                                            handleSetDataArray('internships', index, 'city', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div style={{ width: '100%' }}>
                                      <p className='title-name'>Description</p>
                                      {EditorCustom(item.description, (value) =>
                                        handleSetDataArray('internships', index, 'description', value)
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          ]}
                        />
                        <button
                          className='btn-delete-row'
                          onClick={() => {
                            handleDeleteDataArray('internships', index)
                          }}
                        >
                          <DeleteRowOutlined />
                        </button>
                      </div>
                    ))}
                </div>
                <div>
                  <button
                    className='btn-add-employment'
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      const newData = {
                        city: '',
                        description: '',
                        employer: '',
                        end_date: '',
                        job_title: '',
                        start_date: ''
                      }

                      handleAddDataArray('internships', newData)
                    }}
                  >
                    <PlusOutlined /> Thêm
                  </button>
                </div>
              </>
            )}

            {/* END Internships */}

            {/* START Languages */}
            {openIndex[3] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('languages', 3)
                  }}
                  value={languages.property_name || ''}
                  defaultstring={initResume.languages.property_name as string}
                  onChange={(e) => handleSetData('languages', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('languages', 'property_name', value)
                  }}
                  id='11'
                  width='auto'
                />
                <div className='employment-history'>
                  {data &&
                    data.languages.data &&
                    data.languages.data.map((item, index) => (
                      <div key={index} className='cv-item'>
                        <Collapse
                          expandIconPosition={'end'}
                          style={{ backgroundColor: 'white' }}
                          size='large'
                          items={[
                            {
                              key: '1',
                              label: CustomTitle(item.language, '', item.level),
                              children: (
                                <>
                                  <div className='personal-detail'>
                                    <div className='personal-detail-row'>
                                      <div className='personal-detail-col-left'>
                                        <div style={{ width: '95%' }}>
                                          <p className='title-name'>Language</p>
                                          <InputCustom
                                            value={item.language}
                                            onChange={(e) =>
                                              handleSetDataArray('languages', index, 'language', e.target.value)
                                            }
                                            type='text'
                                          />
                                        </div>
                                      </div>
                                      <div className='personal-detail-col-right'>
                                        <div style={{ width: '95%' }}>
                                          <p className='title-name'>Level</p>
                                          <Select
                                            className='select-level'
                                            showSearch
                                            value={item.level ? item.level : ''}
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'languages',
                                                index,
                                                'level',
                                                Object.keys(LanguageLevel)[Number(e) - 1]
                                              )
                                            }}
                                            style={{ width: 200 }}
                                            placeholder='Search to Select'
                                            optionFilterProp='children'
                                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                            // filterSort={(optionA, optionB) =>
                                            //   (optionA?.label ?? '')
                                            //     .toLowerCase()
                                            //     .localeCompare((optionB?.label ?? '').toLowerCase())
                                            // }
                                            options={[
                                              {
                                                value: '1',
                                                label: 'Native Speaker'
                                              },
                                              {
                                                value: '2',
                                                label: 'Highly proficient'
                                              },
                                              {
                                                value: '3',
                                                label: 'Very good command'
                                              },
                                              {
                                                value: '4',
                                                label: 'Good working knowledge'
                                              },
                                              {
                                                value: '5',
                                                label: 'Working knowledge'
                                              },
                                              {
                                                value: '6',
                                                label: 'C2'
                                              },
                                              {
                                                value: '7',
                                                label: 'C1'
                                              },
                                              {
                                                value: '8',
                                                label: 'B2'
                                              },
                                              {
                                                value: '9',
                                                label: 'B1'
                                              },
                                              {
                                                value: '10',
                                                label: 'A2'
                                              },
                                              {
                                                value: '11',
                                                label: 'A1'
                                              }
                                            ]}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            }
                          ]}
                        />
                        <button
                          className='btn-delete-row'
                          onClick={() => {
                            handleDeleteDataArray('languages', index)
                          }}
                        >
                          <DeleteRowOutlined />
                        </button>
                      </div>
                    ))}
                </div>

                <div>
                  <button
                    className='btn-add-employment'
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      const newData = {
                        level: '',
                        language: ''
                      }
                      handleAddDataArray('languages', newData)
                    }}
                  >
                    <PlusOutlined /> Thêm ngôn ngữ
                  </button>
                </div>
              </>
            )}

            {/* END Languages */}

            {/* START Extra-curricular Activities */}
            {openIndex[4] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('extra_curricular_activities', 4)
                  }}
                  value={extra_curricular_activities.property_name || ''}
                  defaultstring={initResume.extra_curricular_activities.property_name as string}
                  onChange={(e) => handleSetData('extra_curricular_activities', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('extra_curricular_activities', 'property_name', value)
                  }}
                  id='12'
                  width='200px'
                />
                <div className='employment-history'>
                  {data &&
                    data.extra_curricular_activities.data &&
                    data.extra_curricular_activities.data.map((item, index) => (
                      <div key={index} className='cv-item'>
                        <Collapse
                          expandIconPosition={'end'}
                          style={{ backgroundColor: 'white' }}
                          size='large'
                          items={[
                            {
                              key: '1',
                              label: CustomTitle(item.function_title, item.employer, item.start_date, item.end_date),
                              children: (
                                <div className='personal-detail'>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Function Title</p>
                                        <InputCustom
                                          value={item.function_title}
                                          onChange={(e) =>
                                            handleSetDataArray(
                                              'extra_curricular_activities',
                                              index,
                                              'function_title',
                                              e.target.value
                                            )
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Employer</p>
                                        <InputCustom
                                          value={item.employer}
                                          onChange={(e) =>
                                            handleSetDataArray(
                                              'extra_curricular_activities',
                                              index,
                                              'employer',
                                              e.target.value
                                            )
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Start & End Date</p>
                                        <div className='start-end-date'>
                                          <DatePicker
                                            value={item.start_date ? dayjs(item.start_date, 'MM/YY') : undefined}
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'extra_curricular_activities',
                                                index,
                                                'start_date',
                                                e?.format('MM/YY') || ''
                                              )
                                            }}
                                            className='input-date'
                                            placeholder='MM/YY'
                                            format='MM/YY'
                                          />
                                          <span style={{ width: '10px' }}></span>
                                          <DatePicker
                                            value={item.end_date ? dayjs(item.end_date || null, 'MM/YY') : undefined}
                                            className='input-date'
                                            format='MM/YY'
                                            placeholder='MM/YY'
                                            onChange={(e) => {
                                              handleSetDataArray(
                                                'extra_curricular_activities',
                                                index,
                                                'end_date',
                                                e?.format('MM/YY') || ''
                                              )
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>City</p>
                                        <InputCustom
                                          value={item.city}
                                          onChange={(e) =>
                                            handleSetDataArray(
                                              'extra_curricular_activities',
                                              index,
                                              'city',
                                              e.target.value
                                            )
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div style={{ width: '100%' }}>
                                      <p className='title-name'>Description</p>
                                      {EditorCustom(item.description, (value) =>
                                        handleSetDataArray('extra_curricular_activities', index, 'description', value)
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          ]}
                        />
                        <button
                          className='btn-delete-row'
                          onClick={() => {
                            handleDeleteDataArray('extra_curricular_activities', index)
                          }}
                        >
                          <DeleteRowOutlined />
                        </button>
                      </div>
                    ))}
                </div>
                <div>
                  <button
                    className='btn-add-employment'
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      const newData = {
                        city: '',
                        function_title: '',
                        employer: '',
                        description: '',
                        end_date: '',
                        start_date: ''
                      }

                      handleAddDataArray('extra_curricular_activities', newData)
                    }}
                  >
                    <PlusOutlined /> Thêm
                  </button>
                </div>
              </>
            )}

            {/* END Extra-curricular Activities */}

            {/* START Hobbies */}

            {openIndex[5] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('hobbies', 5)
                  }}
                  value={hobbies.property_name || ''}
                  defaultstring={initResume.hobbies.property_name as string}
                  onChange={(e) => handleSetData('hobbies', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('hobbies', 'property_name', value)
                  }}
                  id='13'
                  width='auto'
                />
                <div className='employment-history'>
                  <p style={{ fontSize: '12px' }}>What would you like?</p>
                  <div>
                    <InputCustom
                      value={hobbies.description}
                      onChange={(e) => handleSetData('hobbies', 'description', e.target.value)}
                      type='text'
                    />
                  </div>
                </div>
              </>
            )}

            {/* END Hobbies */}

            {/* START References */}

            {openIndex[6] === 0 && (
              <>
                <InputEditAutoResize
                  deletesection={() => {
                    handleDeleteSection('references', 6)
                  }}
                  value={references.property_name || ''}
                  defaultstring={initResume.references.property_name as string}
                  onChange={(e) => handleSetData('references', 'property_name', e.target.value)}
                  setdefaultdata={(value) => {
                    handleSetData('references', 'property_name', value)
                  }}
                  id='14'
                  width='200px'
                />
                <div className='employment-history'>
                  {data &&
                    data.references.data &&
                    data.references.data.map((item, index) => (
                      <div key={index} className='cv-item'>
                        <Collapse
                          expandIconPosition={'end'}
                          style={{ backgroundColor: 'white' }}
                          size='large'
                          items={[
                            {
                              key: '1',
                              label: CustomTitle(item.name, '', item.company),
                              children: (
                                <div className='personal-detail'>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Referent's Full Name</p>
                                        <InputCustom
                                          value={item.name}
                                          onChange={(e) =>
                                            handleSetDataArray('references', index, 'name', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Company</p>
                                        <InputCustom
                                          value={item.company}
                                          onChange={(e) =>
                                            handleSetDataArray('references', index, 'company', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='personal-detail-row'>
                                    <div className='personal-detail-col-left'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Phone</p>
                                        <InputCustom
                                          value={item.phone}
                                          onChange={(e) =>
                                            handleSetDataArray('references', index, 'phone', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                    <div className='personal-detail-col-right'>
                                      <div style={{ width: '95%' }}>
                                        <p className='title-name'>Email</p>
                                        <InputCustom
                                          value={item.email}
                                          onChange={(e) =>
                                            handleSetDataArray('references', index, 'email', e.target.value)
                                          }
                                          type='text'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          ]}
                        />
                        <button
                          className='btn-delete-row'
                          onClick={() => {
                            handleDeleteDataArray('references', index)
                          }}
                        >
                          <DeleteRowOutlined />
                        </button>
                      </div>
                    ))}
                </div>
                <div>
                  <button
                    className='btn-add-employment'
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      const newData = {
                        name: '',
                        company: '',
                        phone: '',
                        email: ''
                      }

                      handleAddDataArray('references', newData)
                    }}
                  >
                    <PlusOutlined /> Thêm việc làm
                  </button>
                </div>
              </>
            )}

            {/* END References */}

            <h3 style={{ fontWeight: '600' }}>Thêm tùy chọn</h3>
            <div className='add-section'>
              <div className='section-left'>
                <button
                  onClick={() => {
                    setOpenIndex((prv) => {
                      prv[0] = 0
                      return [...prv]
                    })
                    if (data.additional_info.length < 5) {
                      const item = initResume.additional_info[0]
                      setData((prvData) => {
                        return {
                          ...prvData,
                          additional_info: [...prvData.additional_info, item]
                        }
                      })
                    }
                  }}
                >
                  <img
                    src={
                      openIndex[0] === 1 && data.additional_info.length < 5
                        ? iconStatic.customIcon
                        : iconStatic.customGrayIcon
                    }
                  />
                  Tùy Chỉnh
                </button>
                <button
                  onClick={() => {
                    handleAddSection(4, 'extra_curricular_activities')
                  }}
                  style={{ cursor: openIndex[4] ? 'pointer' : 'unset' }}
                >
                  <img src={openIndex[4] === 1 ? iconStatic.activityIcon : iconStatic.activityGrayIcon} />
                  Hoạt Động Ngoại Khóa
                </button>
                <button
                  onClick={() => {
                    if (!openIndex[5]) return

                    setData((prvData) => {
                      const hobbie = prvData.hobbies
                      prvData.hobbies = { ...hobbie, description: '' }
                      return {
                        ...prvData
                      }
                    })
                    setOpenIndex((prv) => {
                      prv[5] = 0
                      return [...prv]
                    })
                  }}
                >
                  <img src={openIndex[5] === 1 ? iconStatic.hobbieIcon : iconStatic.hobbieGrayIcon} />
                  Sở Thích
                </button>
                <button
                  onClick={() => {
                    handleAddSection(6, 'references')
                  }}
                >
                  <img src={openIndex[6] === 1 ? iconStatic.referenceIcon : iconStatic.referenceGrayIcon} />
                  Người Giới Thiệu
                </button>
              </div>
              <div className='section-right'>
                <button
                  onClick={() => {
                    handleAddSection(1, 'courses')
                  }}
                >
                  <img src={openIndex[1] === 1 ? iconStatic.courseIcon : iconStatic.courseGrayIcon} />
                  Khóa học
                </button>
                <button
                  onClick={() => {
                    handleAddSection(2, 'internships')
                  }}
                >
                  <img src={openIndex[2] === 1 ? iconStatic.internshipIcon : iconStatic.internshipGrayIcon} />
                  Thực tập
                </button>
                <button
                  onClick={() => {
                    handleAddSection(3, 'languages')
                  }}
                >
                  <img src={openIndex[3] === 1 ? iconStatic.languageIcon : iconStatic.languageGrayIcon} />
                  Ngôn ngữ
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='right'>
          <Right data={data} file={fileList[0]} />
        </div>
      </div>
    </>
  )
}

const CustomTitle = (title1?: string, title2?: string, startDate?: string, endDate?: String) => {
  return (
    <>
      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1E2532' }}>
        {title1 ? (title2 ? title1.concat(' - ') + title2 : title1) : title2 ? title2 : '(Không cụ thể)'}
      </h5>
      <h5 style={{ fontSize: '14px', color: 'rgb(130, 139, 162)' }}>
        {startDate ? (endDate ? startDate.concat(' - ') + endDate : startDate) : endDate ? endDate : ''}
      </h5>
    </>
  )
}

const EditorCustom = (data: string, handleSetData: (value: string) => void) => {
  return (
    <CKEditor
      data={data}
      config={{
        // removePlugins: [
        //   'ImageUpload',
        //   'EasyImage',
        //   'Image',
        //   'CKFinderUploadAdapter',
        //   'CKFinder',
        //   'ImageCaption',
        //   'ImageStyle',
        //   'MediaEmbed',
        //   'PictureEditing',
        //   'Table',
        //   'TableToolbar',
        //   'CKBoxEditing',
        //   'CKBox',
        //   'ImageToolbar'
        // ],
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
          'outdent',
          'indent'
        ]
      }}
      editor={ClassicEditor}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        // console.log('Editor is ready to use!', editor)
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        handleSetData(data)
      }}
      onBlur={(event, editor) => {
        // console.log('Blur.', editor)
      }}
      onFocus={(event, editor) => {
        // console.log('Focus.', editor)
      }}
    />
  )
}

export default CV
