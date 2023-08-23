import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import { FiMoreHorizontal } from 'react-icons/fi'
const JobItem = (props: any) => {
  const img: string = props.img
  const nameJob: string = props.nameJob
  const nameCompany: string = props.nameCompany
  const salary: string = props.salary
  const area: string = props.area
  const timePost: string = props.timePost
  return (
    <Row className='job-item-container'>
      <Col
        className='job-item-image'
        md={4}
        sm={24}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img
          style={{ width: '100%', height: '100%' }}
          src={img ? img : 'https://images.vietnamworks.com/pictureofcompany/ed/11125246.png'}
          alt=''
        />
      </Col>
      <Col className='job-item-info' md={18} sm={20} xs={20}>
        <div className='name-job'>{nameJob ? nameJob : 'Tên công việc'}</div>
        <div className='name-company'>{nameCompany ? nameCompany : 'Tên công ty'}</div>
        <div className='salary-job'>
          {salary ? salary : 'Thương lượng'}
          <span className='area'>| {area ? area : 'Khu vực'}</span>
        </div>
        <div className='time-post'>{timePost ? timePost : 'Hôm nay'}</div>
      </Col>
      <Col className='job-item-action' md={2} sm={4} xs={4}>
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
