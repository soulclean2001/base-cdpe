import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import { FiMoreHorizontal } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoTemp from '~/assets/HF_logo.jpg'
const JobItem = (props: any) => {
  const navigate = useNavigate()
  const idJob: string = props.idJob
  const img: string = props.img
  const nameJob: string = props.nameJob
  const nameCompany: string = props.nameCompany
  const salary: string = props.salary
  const area: string[] = props.area
  const timePost: string = props.timePost
  const style: {
    backgroundColorBeforeHover: string
    backgroundColorAfterHover: string
    borderBefore: string
    borderAfter: string
  } = props.style
  const customHover: boolean = props.customHover
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const divStyle: React.CSSProperties | undefined = {
    backgroundColor: customHover
      ? !isHovered
        ? style?.backgroundColorBeforeHover
        : style?.backgroundColorAfterHover
      : 'rgb(239, 245, 255)',
    border: customHover ? (!isHovered ? style?.borderBefore : style?.borderAfter) : '1px solid rgb(160, 193, 255)'
  }
  const handleClickShowDetail = () => {
    const convertNameEng = nameJob
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/jobs/${convertName}-id-${idJob}`)
  }
  return (
    <Row
      onClick={handleClickShowDetail}
      className='job-item-container'
      style={customHover ? divStyle : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Col
        className='job-item-image'
        md={4}
        sm={6}
        xs={6}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className='logo-wapper'>
          <img style={{ width: '100%', height: '100%' }} src={img ? img : logoTemp} alt='' />
        </div>
      </Col>
      <Col className='job-item-info' md={18} sm={15} xs={15}>
        <div className='name-job'>{nameJob ? nameJob : 'Tên công việc'}</div>
        <div className='name-company'>{nameCompany ? nameCompany : 'Tên công ty'}</div>
        <div className='salary-job'>
          {salary ? salary : 'Thương lượng'}
          <span className='area'>
            {' '}
            {area
              ? area.map((item, index) => {
                  if (index === area.length - 1) return item
                  return `${item}, `
                })
              : 'Khu vực'}
          </span>
        </div>
        <div className='time-post'>
          {`Ngày đăng: `}
          {timePost ? timePost : 'Hôm nay'}
        </div>
      </Col>
      <Col className='job-item-action' md={2} sm={3} xs={3}>
        <Button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            background: 'none',
            color: 'rgb(7, 92, 251)'
          }}
          shape='circle'
          size='middle'
          icon={<AiOutlineHeart />}
        />
        <Button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            background: 'none'
          }}
          shape='circle'
          size='middle'
          icon={<FiMoreHorizontal />}
        />
      </Col>
    </Row>
  )
}

export default JobItem
