import { Button, Col, Row } from 'antd'
import './style.scss'
import { AiFillHeart } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
interface DataType {
  id: string
  logo: string
  nameCompany: string
  industries: string
  area: string
}
interface PropsType {
  data: DataType
}
const ItemCompany = (props: PropsType) => {
  const { data } = props
  const navigate = useNavigate()
  const handleClickShowDetail = () => {
    const convertNameEng = data.nameCompany
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/companies/${convertName}-id-${data.id}`)
  }
  if (!data) return <></>
  return (
    <Row className='item-follow-container' justify={'space-between'}>
      <Col lg={19} md={19} sm={24} xs={24} className='left-container'>
        <div className='logo-container'>
          <img src={data.logo && data.logo !== '_' ? data.logo : ''} alt='' />
        </div>
        <div className='info-company'>
          <div className='name-company'>{data.nameCompany}</div>
          <div className='fields'>{`Lĩnh vực:  ${data.industries}`} </div>
          <div className='address'>{`Địa chỉ:  ${data.area}`}</div>
        </div>
      </Col>
      <Col lg={3} md={4} sm={24} xs={24} className='right-container'>
        <span className='time-seen'></span>
        <div className='btn-container'>
          <a style={{ color: '#e31b23' }} className='btn-follow'>
            <AiFillHeart />
          </a>
          <Button onClick={handleClickShowDetail} className='btn-show-detail'>
            Chi tiết
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default ItemCompany
