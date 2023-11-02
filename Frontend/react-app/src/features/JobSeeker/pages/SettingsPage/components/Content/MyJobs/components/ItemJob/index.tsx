import { Button, Col, Row } from 'antd'
import { AiOutlineHeart } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import './style.scss'
interface DataType {
  id: string
  logo: string
  jobTitle: string
  nameCompany: string
  province: string
  salary: string
  status: string | undefined
}
interface PropsType {
  data: DataType | undefined
  type: string | undefined
}
const ItemJob = (props: any) => {
  const { data, type }: PropsType = props
  const [statusCSS, setStatusCSS] = useState('pending')
  useEffect(() => {
    handleSetCssStatus()
  }, [data])
  const handleSetCssStatus = () => {
    if (data) {
      if (data.status === 'Pending') {
        setStatusCSS('pending')
        return
      } else if (data.status === 'Rejected') {
        setStatusCSS('rejected')
        return
      } else if (data.status === 'Approved') {
        setStatusCSS('approved')
        return
      } else if (data.status === 'Interview') {
        setStatusCSS('interview')
        return
      } else if (data.status === 'Hired') {
        setStatusCSS('hired')
        return
      } else if (data.status === 'NotContactable') {
        setStatusCSS('not-contactable')
        return
      } else setStatusCSS('')
    }
  }
  if (!data) return <>k co data</>

  return (
    <Row className='item-save-ojb-container' justify={'space-between'}>
      <Col lg={19} md={17} sm={17} xs={24} className='left-container'>
        <div className='logo-container'>
          <img src={data.logo ? data.logo : ''} alt='' />
        </div>
        <div className='info-job'>
          <div className='name-job'>{data.jobTitle ? data.jobTitle : 'job title'}</div>
          <div className='name-company'>{data.nameCompany ? data.nameCompany : 'name company'}</div>
          <div className='province'>{data.province ? data.province : 'province'}</div>
          <div className='salary'>{data.salary ? data.salary : 'Thương lượng'}</div>
        </div>
      </Col>
      <Col
        lg={3}
        md={5}
        sm={6}
        xs={24}
        className='right-container'
        style={{ justifyContent: type === 'ITEM_SAVE_JOB' ? 'center' : 'space-between' }}
      >
        {type === 'ITEM_APPLIED_JOB' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span className={`status-apply-job ${statusCSS}`}>{data.status ? data.status : 'status'}</span>
          </div>
        )}
        <div className='btn-wapper'>
          {/* <Button className='btn-follow' icon={<AiOutlineHeart />} /> */}
          <Button className='btn-show-detail'>Chi tiết</Button>
        </div>
      </Col>
    </Row>
  )
}

export default ItemJob