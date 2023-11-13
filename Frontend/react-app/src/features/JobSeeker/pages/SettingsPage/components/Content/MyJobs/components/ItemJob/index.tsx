import { Col, Row } from 'antd'

import { useState, useEffect } from 'react'
import './style.scss'
import { JobApplicationStatus } from '~/types/jobAppliacation.type'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import avatarTemp from '~/assets/HF_logo.jpg'
interface DataType {
  id: string
  logo: string
  jobTitle: string
  nameCompany: string
  province: string
  salary: string
  status: string
  updateDate: string
}
interface PropsType {
  data: DataType | undefined
  type?: string | undefined
}
const ItemJob = (props: any) => {
  const { data, type }: PropsType = props
  const navigate = useNavigate()
  const [statusCSS, setStatusCSS] = useState('0')
  useEffect(() => {
    handleSetCssStatus()
  }, [data])
  const handleSetCssStatus = () => {
    if (data) {
      if (data.status.toString() == '0') {
        setStatusCSS('pending')
        return
      }
      if (data.status.toString() === '2') {
        setStatusCSS('rejected')
        return
      }
      if (data.status.toString() === '1') {
        setStatusCSS('approved')
        return
      }
      if (data.status.toString() === '3') {
        setStatusCSS('potential')
        return
      }
      if (data.status.toString() === '4') {
        setStatusCSS('interview')
        return
      }
      if (data.status.toString() === '5') {
        setStatusCSS('hired')
        return
      }
      if (data.status.toString() === '7') {
        setStatusCSS('not-contactable')
        return
      }
      setStatusCSS('')
    }
  }
  const handleClickShowDetail = () => {
    if (!data) return
    const convertNameEng = data.jobTitle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/jobs/${convertName}-id-${data.id}`)
  }
  if (!data) return <></>

  return (
    <Row onClick={handleClickShowDetail} className='item-save-ojb-container' justify={'space-between'}>
      <Col lg={19} md={17} sm={17} xs={24} className='left-container'>
        <div className='logo-container'>
          <img src={data.logo ? data.logo : avatarTemp} alt='' />
        </div>
        <div className='info-job'>
          <div className='name-job'>{data.jobTitle ? data.jobTitle : 'job title'}</div>
          <div className='name-company'>{data.nameCompany ? data.nameCompany : 'name company'}</div>
          <div className='province'>{data.province ? data.province : 'province'}</div>
          <div className='salary'>{data.salary ? data.salary : 'Thương lượng'}</div>
        </div>
      </Col>
      <Col
        lg={4}
        md={6}
        sm={6}
        xs={24}
        className='right-container'
        style={{ justifyContent: type === 'ITEM_SAVE_JOB' ? 'center' : 'space-between' }}
      >
        {type === 'ITEM_APPLIED_JOB' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span className={`status-apply-job ${statusCSS}`}>
              {Object.values(JobApplicationStatus)[Number(data.status as string)]}
            </span>
          </div>
        )}
        <div className='btn-wapper'>
          {/* <Button className='btn-follow' icon={<AiOutlineHeart />} /> */}
          <span className='btn-show-detail'>
            {data.updateDate && format(parseISO(data.updateDate), 'dd-MM-yyyy HH:mm:ss')}
          </span>
          {/* <span style={{ alignContent: 'flex-end' }}>Ngày update</span> */}
        </div>
      </Col>
    </Row>
  )
}

export default ItemJob
