import { PlusOutlined } from '@ant-design/icons'
import { GiReceiveMoney } from 'react-icons/gi'
import { PiStudentFill } from 'react-icons/pi'
import { TfiCup } from 'react-icons/tfi'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Row,
  Select,
  Space
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ImLocation } from 'react-icons/im'
import { useState, useRef, useEffect } from 'react'

import { toast } from 'react-toastify'
import { BsFillAirplaneFill, BsTrashFill } from 'react-icons/bs'
import { FaMoneyBillWave } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, setDataPosts } from '~/features/Employer/employerSlice'

import apiCompany, { UpdateCompanyType } from '~/api/company.api'
import apiPost from '~/api/post.api'
import './style.scss'

import { getAllProviencesApi, getOneProvincesApi } from '~/api/provinces.api'
import { DataOptionType } from '../ModalWorkLocation'
import { RootState } from '~/app/store'
import { JobType as JobTypeFull } from '../../pages/PostManagePage/components/TableCustom/TableCustom'
import { getAllIndustries } from '~/api/industries.api'
import { format, addDays } from 'date-fns'

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

const maxItem = [{ value: 'Bạn đã chọn tối đa 3 ngành nghề', label: 'Bạn đã chọn tối đa 3 ngành nghề', disabled: true }]

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

// interface LocationData {
//   branchName: string
//   address: string
//   district: string
//   province: string
// }
export interface SelectionLocationData {
  value: WorkingLocation
  disabled: boolean
}

export interface LocationType {
  checked: boolean
  key: number
  selected: string
}

export interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}

interface SalararyRange {
  min: number
  max: number
}

interface Benefit {
  type: string
  value: string
}

export interface JobType {
  id?: string
  job_title: string
  alias?: string
  is_salary_visible: boolean
  pretty_salary?: string
  working_locations: WorkingLocation[]
  industries: string[]
  skills: string[]
  expired_date?: string
  job_level: string
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  visibility: boolean
  benefits: Benefit[]
  job_type: string
  number_of_employees_needed: number
  application_email: string
  created_at?: Date
}

const initLocation: LocationType[] = [{ checked: false, key: 0, selected: '_' }]
const initValue: DataOptionType[] = []
const ModalInfoPost = (props: any) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const employer = useSelector((state: RootState) => state.employer)
  const { idPost, open, handleClose, title, roleType, handleAfterSubmit } = props

  const [idCompany, setIdCompany] = useState('')
  const [listWorkLocation, setListWorkLocation] = useState<Array<WorkingLocation>>([])

  //state data form modal
  const [jobTitle, setJobTitle] = useState('')
  const [level, setLevel] = useState('')
  const [typeJob, setTypeJob] = useState('')
  const [industries, setIndustries] = useState<Array<string>>([])
  const [publish, setPublish] = useState(false)
  const [expireDate, setExpireDate] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobRequirement, setJobRequirement] = useState('')
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 })
  const [showSalaryRange, setShowSalaryRange] = useState(true)
  const [quantityAccept, setQuantityAccept] = useState(1)
  const [emailAcceptCV, setEmailAcceptCV] = useState('')
  const [districtsData, setDistrictsData] = useState(initValue)
  const [provincesData, setProvincesData] = useState(initValue)
  const [listLocation, setListLocation] = useState<Array<SelectionLocationData>>([])
  const [arrLocations, setArrLocations] = useState(initLocation)
  const [arrSkills, setArrSkills] = useState([{ key: 0, value: '' }])
  const [arrBenefits, setArrBenefits] = useState([{ key: 0, data: { type: listBenefit[0].value, value: '' } }])

  //

  const [formLocation] = Form.useForm()
  const [openModalLocation, setOpenModalLocation] = useState(false)

  const [dataLocationBranch, setDataLocationBranch] = useState<WorkingLocation>({
    lat: 0,
    lon: 0,
    branch_name: '',
    address: '',
    district: '',
    city_name: ''
  })
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    if (!dataLocationBranch.city_name) return
    formLocation.setFieldsValue({ district: '' })
    fetchDistricts()
  }, [dataLocationBranch.city_name])
  useEffect(() => {
    if (openModalLocation) {
      fetchProvinces()
    }
  }, [openModalLocation])
  const fetchProvinces = async () => {
    const res = await getAllProviencesApi()

    setProvincesData(res)
  }
  const fetchDistricts = async () => {
    const res = await getOneProvincesApi(dataLocationBranch.city_name)
    setDistrictsData(res)
  }
  useEffect(() => {
    if (!open) {
      handleClearDataForm()
    }
  }, [open])
  const handleClearDataForm = async () => {
    setArrBenefits([{ key: 0, data: { type: listBenefit[0].value, value: '' } }])
    setArrSkills([{ key: 0, value: '' }])
    setArrLocations(initLocation)
    setIndustries([])
    if (roleType !== 'ADMIN_ROLE') await getDataWorkLocation()
  }
  const getDataWorkLocation = async () => {
    const dataTemp: SelectionLocationData[] = []
    const listTemp: WorkingLocation[] = await apiCompany.getMyCompany().then((rs) => {
      setIdCompany(rs.result._id)
      return rs.result.working_locations
    })
    setListWorkLocation(listTemp)
    listTemp.map((workLocation: WorkingLocation) => dataTemp.push({ value: workLocation, disabled: false }))
    setListLocation(dataTemp)
  }

  const handleCloseModalLocation = () => {
    setOpenModalLocation(false)
  }
  const handleAddWorkingLocation = () => {
    if (arrLocations.length <= 5) {
      setArrLocations([
        ...arrLocations,
        { checked: false, key: arrLocations[arrLocations.length - 1].key + 1, selected: '_' }
      ])
    }
  }
  const validateMinMax = () => {
    if (salaryRange && salaryRange.min && salaryRange.max) {
      if (salaryRange.min && salaryRange.max && salaryRange.min > salaryRange.max) {
        return Promise.reject('Vui lòng nhập từ thấp đến cao')
      }
    }

    return Promise.resolve()
  }
  //submit modal location
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
    const request: UpdateCompanyType = { working_locations: [...listWorkLocation, dataLocationBranch] }
    await apiCompany
      .updateCompanyById(idCompany, 'default', 'default', request)
      .then(() => {
        toast.success('Cập nhật địa điểm làm việc thành công')
      })
      .then(() => {
        formLocation.resetFields()
      })
      .then(() => {
        setListLocation([...listLocation, { value: dataLocationBranch, disabled: false }])
        setOpenModalLocation(false)
      })
  }

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
      console.log('oldSelectedObj', oldSelectedObj)
      const oldSelected = oldSelectedObj[0].selected
      if (oldSelected !== '_') {
        const changeData = listLocation.map((item: SelectionLocationData) => {
          if (item.value.branch_name === oldSelected) {
            item.disabled = false
          }
          return item
        })
        console.log('changeData', changeData)
        setListLocation(changeData)
      }
      const filterData = arrLocations.filter((item) => item.key !== key)
      console.log('filterData', filterData)
      setArrLocations(filterData)
      form.resetFields([`location_${key}`])
    }
  }

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
    console.log('map data', mapData)
    setArrSkills(mapData)
  }
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

  const handleSubmitForm = async () => {
    const locationsFinal: WorkingLocation[] = []
    listLocation.map((location) => {
      if (location.disabled && location.value !== undefined) {
        locationsFinal.push(location.value)
      }
    })
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
    // const data = {
    //   jobTitle,
    //   level,
    //   typeJob,
    //   industries,
    //   field,
    //   locations,
    //   jobDescription,
    //   jobRequirement,
    //   skills,
    //   salaryRange,
    //   showSalaryRange,
    //   benefits,
    //   quantityAccept,
    //   emailAcceptCV
    // }
    let job: JobType = {
      job_title: jobTitle,
      job_level: level,
      job_type: typeJob,
      industries: industries,
      working_locations: locationsFinal,
      skills: skills as string[],
      salary_range: {
        min: !isNaN(Number(salaryRange.min)) ? Number(salaryRange.min) : 0,
        max: !isNaN(Number(salaryRange.max)) ? Number(salaryRange.max) : 0
      },
      job_description: jobDescription,
      job_requirement: jobRequirement,
      visibility: publish,
      benefits: benefits as Benefit[],
      number_of_employees_needed: quantityAccept,
      application_email: emailAcceptCV,
      is_salary_visible: showSalaryRange
    }
    // expired_date: expireDate ? expireDate : format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    if (publish) job = { ...job, expired_date: expireDate }
    console.log('form data post', job)

    // call api
    if (idPost) {
      await updatePost(job).then(() => toast.success(`Cập nhật #POST_${idPost.slice(-5).toUpperCase()} thành công`))
    } else await postData(job)
  }

  const updatePost = async (job: JobType) => {
    await apiPost
      .updatePost(idPost, job)
      .then((rs) => {
        const postUpdate: JobTypeFull = employer.posts.data.filter((post: any) => {
          return post.id === idPost
        })[0]

        const listFilter = employer.posts.data.filter((post: any) => {
          return post.id !== idPost
        })

        let jobFullUpdate = { ...postUpdate, ...job }
        dispatch(setDataPosts([jobFullUpdate, ...listFilter]))
      })
      .then(() => {
        form.resetFields()

        handleAfterSubmit()
        // handleClose()
      })
  }
  const postData = async (job: JobType) => {
    await apiPost
      .addPost(job)
      .then((response) => {
        const newJob = { ...job, id: response.result.insertedId } as JobType & { [key: string]: any }
        newJob.salary = job.salary_range.min + ' - ' + job.salary_range.max

        // custome before add to list posts
        toast.success(`#POST_${response.result.insertedId.slice(-5).toUpperCase()} đã được tạo thành công`)
        dispatch(addPost(newJob))
      })
      .then(() => {
        form.resetFields()

        handleAfterSubmit()
      })
  }

  useEffect(() => {
    if (open && idPost) getPostById()
  }, [open, idPost])

  const getPostById = async () => {
    if (!idPost) {
      return
    }
    form.resetFields()
    await apiPost.getPostById(idPost).then((response) => {
      const rs: JobTypeFull = response.result as JobTypeFull
      setJobTitle(rs.job_title)
      setLevel(rs.job_level)
      setTypeJob(rs.job_type)
      setIndustries(rs.industries)
      setJobDescription(rs.job_description)
      setJobRequirement(rs.job_requirement)
      //set work location

      const tempLoc = rs.working_locations.map((locationJob, index) => {
        return { checked: false, key: index, selected: locationJob.branch_name }
      })
      setArrLocations(tempLoc)

      for (let i = 0; i < rs.working_locations.length; i++) {
        form.setFieldsValue({
          [`location_${i}`]: rs.working_locations[i].branch_name
        })
      }
      // rs.working_locations.map((locationJob, index) => {
      //   // hay do cai set state n k update xong khi goi ham
      //   if (index > 0) {
      //     handleAddWorkingLocation()
      //     console.log('count', index)
      //   }
      //   form.setFieldsValue({
      //     [`location_${index}`]: locationJob.branch_name
      //   })
      // })

      const mapLocations = listLocation.map((locationCompany) => {
        for (let i = 0; i < rs.working_locations.length; ++i) {
          if (locationCompany.value.branch_name === rs.working_locations[i].branch_name) {
            locationCompany.disabled = true
          }
        }
        // rs.working_locations.map((locationJob) => {

        // })
        return locationCompany
      })
      console.log('mapLocations', mapLocations)
      setListLocation(mapLocations)

      //
      //set skills
      const mapSkills = rs.skills.map((skill, index) => {
        if (index > 0) handleAddRowSkill()
        form.setFieldsValue({
          [`skill_${index}`]: skill
        })
        return { key: index, value: skill }
      })
      setArrSkills(mapSkills)
      //
      //set benifit
      const mapBenefits = rs.benefits.map((benefit, index) => {
        if (index > 0) handleAddRowBenefit()
        form.setFieldsValue({
          [`benefit_${index}`]: benefit.value
        })
        return { key: index, data: benefit }
      })
      setArrBenefits(mapBenefits)
      console.log('arrBenefits', arrBenefits)
      //
      setSalaryRange(rs.salary_range)
      setQuantityAccept(rs.number_of_employees_needed)
      setEmailAcceptCV(rs.application_email)
      form.setFieldsValue({
        jobTitle: rs.job_title,
        level: rs.job_level,
        typeJob: rs.job_type,
        industry: rs.industries,
        descriptions: rs.job_description,
        requirements: rs.job_requirement,
        minSalary: rs.salary_range.min,
        maxSalary: rs.salary_range.max,
        showSalary: rs.is_salary_visible,
        emailApplyCV: rs.application_email,
        quantityAccept: rs.number_of_employees_needed
      })
    })
  }
  //

  return (
    <>
      <Modal
        className='modal-post-detail-container'
        title={<h2>{idPost ? `THÔNG TIN BÀI ĐĂNG ${idPost}` : title}</h2>}
        centered
        open={open}
        onOk={handleClose}
        onCancel={handleClose}
        width={800}
        footer={''}
      >
        <div>
          <hr />
          <Form
            name='form-info-jobb'
            className='form-info-job'
            initialValues={{ remember: true }}
            onFinish={handleSubmitForm}
            form={form}
            onFinishFailed={onFinishFailed}
            layout='vertical'
          >
            <h2>Mô tả công việc </h2>

            <Form.Item
              name='jobTitle'
              label={<span style={{ fontWeight: '500' }}>Chức Danh</span>}
              rules={[
                { required: true, message: 'Vui lòng không để trống tên công việc' },
                { max: 150, message: 'Đã vượt quá độ dài tối đa' }
              ]}
            >
              <Input
                disabled={roleType === 'ADMIN_ROLE' ? true : false}
                size='large'
                className='name-job-input'
                placeholder='Eg. Senior UX Designer'
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </Form.Item>

            <Row justify={'space-between'}>
              <Col md={11} sm={24} xs={24}>
                <Form.Item
                  label={<span style={{ fontWeight: '500' }}>Cấp Bậc</span>}
                  name='level'
                  rules={[{ required: true, message: 'Vui lòng chọn cấp bậc' }]}
                >
                  <Select
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
                    showSearch
                    placeholder={'Chọn cấp bậc'}
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
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
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
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
                    showSearch
                    mode={'multiple'}
                    placeholder={'Chọn ngành nghề'}
                    size='large'
                    options={industries.length === 3 ? maxItem : getAllIndustries}
                    onChange={(value) => setIndustries(value)}
                    maxTagCount={3}
                    maxTagTextLength={10}
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
                      rules={[{ required: true, message: 'Vui lòng không để trống địa chỉ trụ sở' }]}
                    >
                      <Select
                        disabled={roleType === 'ADMIN_ROLE' ? true : false}
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
                    sm={4}
                    xs={6}
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Button
                      hidden={roleType === 'ADMIN_ROLE' ? true : hiddenDeleteLocation}
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
              title={<h2>{`TẠO ĐỊA ĐIỂM LÀM VIỆC`}</h2>}
              centered
              open={openModalLocation}
              onCancel={handleCloseModalLocation}
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
                  <Button
                    onClick={() => setOpenModalLocation(false)}
                    size='large'
                    className='btn-cancel'
                    htmlType='submit'
                  >
                    Thoát
                  </Button>
                  <Button size='large' className='btn-submit' htmlType='submit'>
                    Tạo
                  </Button>
                </div>
                {/* <Form.Item name='buttonSubmit'>
                  <Button style={{ float: 'right' }} htmlType='submit'>
                    Tạo
                  </Button>
                </Form.Item> */}
              </Form>
            </Modal>

            <Button
              hidden={roleType === 'ADMIN_ROLE' ? true : false}
              style={{ marginBottom: '20px' }}
              onClick={handleAddWorkingLocation}
              icon={<PlusOutlined />}
            >
              Thêm địa điểm làm việc
            </Button>
            <Form.Item
              name='descriptions'
              label={<span style={{ fontWeight: '500' }}>Mô Tả</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống mô tả công việc' }]}
            >
              {/* <TextArea
                disabled={roleType === 'ADMIN_ROLE' ? true : false}
                size='large'
                onChange={(e) => setJobDescription(e.target.value)}
              /> */}
              <CKEditor
                data={jobDescription}
                config={{
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
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setJobDescription(data)
                }}
              />
            </Form.Item>
            <Form.Item
              name='requirements'
              label={<span style={{ fontWeight: '500' }}>Yêu Cầu Công Việc</span>}
              rules={[{ required: true, message: 'Vui lòng không để trống yêu cầu công việc' }]}
            >
              {/* <TextArea
                disabled={roleType === 'ADMIN_ROLE' ? true : false}
                size='large'
                onChange={(e) => setJobRequirement(e.target.value)}
              /> */}
              <CKEditor
                data={jobRequirement}
                config={{
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
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setJobRequirement(data)
                }}
              />
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
                      rules={[{ required: true, message: 'Vui lòng không để trống yêu cầu kỹ năng công việc' }]}
                    >
                      <Input
                        disabled={roleType === 'ADMIN_ROLE' ? true : false}
                        value={sk.value}
                        size='large'
                        onChange={(e) => handleSetSkill(e.target.value, sk.key)}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={2} sm={4} xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      hidden={roleType === 'ADMIN_ROLE' ? true : hiddenDeleteSkill}
                      size='large'
                      icon={<BsTrashFill />}
                      onClick={() => handleDeletedRowSkill(sk.key)}
                    />
                  </Col>
                </Row>
              )
            })}

            <Button
              hidden={roleType === 'ADMIN_ROLE' ? true : false}
              onClick={handleAddRowSkill}
              style={{ marginBottom: '20px' }}
              icon={<PlusOutlined />}
            >
              Thêm kỹ năng
            </Button>
            <h4 style={{ fontWeight: '500' }}>Mức Lương</h4>
            <Row justify={'start'} style={{ gap: '8px' }}>
              <Col md={7} sm={24} xs={24}>
                <Form.Item
                  // label={<span style={{ fontWeight: '500' }}>Mức Lương</span>}
                  name='minSalary'
                  rules={[
                    { required: true, message: 'Vui lòng nhập mức lương tối thiểu' },
                    { validator: validateMinMax }
                  ]}
                >
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
                    size='large'
                    placeholder='Tối thiểu'
                    onChange={(e) => setSalaryRange({ ...salaryRange, min: Number(e.target.value) })}
                  />
                </Form.Item>
              </Col>
              <Col md={7} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Item
                  name='maxSalary'
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa' }, { validator: validateMinMax }]}
                >
                  <Input
                    onKeyDown={(event) => {
                      if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                        event.preventDefault()
                      }
                    }}
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
                    size='large'
                    placeholder='Tối đa'
                    onChange={(e) => setSalaryRange({ ...salaryRange, max: Number(e.target.value) })}
                  />
                </Form.Item>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <Form.Item valuePropName='checked' name='showSalary' style={{ marginBottom: 0 }}>
                  <Checkbox
                    disabled={roleType === 'ADMIN_ROLE' ? true : false}
                    defaultChecked={showSalaryRange}
                    onClick={() => setShowSalaryRange(!showSalaryRange)}
                  >
                    Hiển Thị Mức Lương
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <h4 style={{ fontWeight: '500' }}>Phúc Lợi Từ Công Ty</h4>
            {arrBenefits.map((row) => (
              <Row key={row.key} align={'middle'} justify={'space-between'} style={{ marginBottom: '15px' }}>
                <Col md={22} sm={20} xs={18}>
                  <Form.Item
                    style={{ margin: 0 }}
                    name={`benefit_${row.key}`}
                    // label={<span style={{ fontWeight: '500' }}>Phúc Lợi Từ Công Ty</span>}
                  >
                    <Input
                      disabled={roleType === 'ADMIN_ROLE' ? true : false}
                      onChange={(e) => handleSetDataBenefit(e.target.value, row.key)}
                      addonBefore={
                        <Select
                          disabled={roleType === 'ADMIN_ROLE' ? true : false}
                          onChange={(value) => handleSetTypeBenefit(value, row.key)}
                          popupMatchSelectWidth={200}
                          size='large'
                          defaultValue={row.data ? row.data.type : listBenefit[0].value}
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
                    hidden={roleType === 'ADMIN_ROLE' ? true : hiddenDeleteBenefit}
                    size='large'
                    icon={<BsTrashFill />}
                    onClick={() => handleDeletedRowBenefit(row.key)}
                  />
                </Col>
              </Row>
            ))}

            <Button
              hidden={roleType === 'ADMIN_ROLE' ? true : false}
              onClick={handleAddRowBenefit}
              style={{ marginBottom: '20px' }}
              icon={<PlusOutlined />}
            >
              Thêm phúc lợi
            </Button>
            <Form.Item
              name='quantityAccept'
              initialValue={1}
              label={<span style={{ fontWeight: '500' }}>Số lượng tuyển</span>}
            >
              <InputNumber
                disabled={roleType === 'ADMIN_ROLE' ? true : false}
                min={1}
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
              <Input
                disabled={roleType === 'ADMIN_ROLE' ? true : false}
                size='large'
                placeholder='mail@gmail.com'
                onChange={(e) => setEmailAcceptCV(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              hidden={idPost ? true : false}
              valuePropName='checked'
              name='publish'
              style={{ marginBottom: 0 }}
            >
              <Checkbox defaultChecked={publish} onClick={() => setPublish(!publish)}>
                Công khai bài đăng
              </Checkbox>
            </Form.Item>
            <Form.Item
              hidden={idPost || !publish ? true : false}
              valuePropName='checked'
              name='expireDate'
              // style={{ marginBottom: 0 }}
              rules={[{ required: publish ? true : false, message: 'Vui lòng chọn ngày hết hạn' }]}
            >
              <DatePicker
                size='large'
                placeholder='Ngày hết hạn'
                onChange={(_, strings) => setExpireDate(strings)}
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
            <div className='btn-container' style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
              <Button size='large' style={{ width: '100px' }} onClick={handleClose}>
                Thoát
              </Button>
              {idPost && roleType === 'ADMIN_ROLE' ? (
                <>
                  <Button className='btn-reject' size='large' onClick={handleClose}>
                    Từ chối
                  </Button>
                  <Button className='btn-approved' size='large' onClick={handleClose}>
                    Chấp nhận
                  </Button>
                </>
              ) : (
                <></>
              )}
              {idPost ? (
                <Button
                  hidden={roleType === 'ADMIN_ROLE' ? true : false}
                  size='large'
                  htmlType='submit'
                  style={{ background: 'rgb(255, 125, 85)', color: 'white', width: '100px' }}
                >
                  Cập nhật
                </Button>
              ) : (
                <Button
                  disabled={roleType === 'ADMIN_ROLE' ? true : false}
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
