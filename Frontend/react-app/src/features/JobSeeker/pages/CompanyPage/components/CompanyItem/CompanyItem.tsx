import { Button, Col, Row, Tooltip } from 'antd'
import './style.scss'
import { MdWork } from 'react-icons/md'
import { FaFolderOpen, FaUsers } from 'react-icons/fa'
import logoTemp from '~/assets/HF_logo.jpg'
import bannerTemp from '~/assets/banner_temp.jpg'
import { useNavigate } from 'react-router-dom'
const CompanyItem = (props: any) => {
  const navigate = useNavigate()
  const handleClickShowDetail = () => {
    // const convertNameEng = props.nameCompany
    //   .normalize('NFD')
    //   .replace(/[\u0300-\u036f]/g, '')
    //   .toLowerCase()
    // const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    // navigate(`/companies/${convertName}-id-${props.idCompany}`)
    navigate(`/companies/id-${props.idCompany}`)
  }
  return (
    <Row className='company-item-container'>
      <Col span={24} className='image-container'>
        <div className='background-company'>
          <img
            width={'100%'}
            height={'100%'}
            className='cover-img'
            src={props.backgroundImg ? props.backgroundImg : bannerTemp}
          />
        </div>
        <div className='logo-company'>
          <img className='logo' src={props.logo ? props.logo : logoTemp} />

          <div className='total-followers'>
            <span>
              <FaUsers />
              {`${props.followers ? props.followers : 0} lượt theo dõi`}
            </span>
          </div>
        </div>
      </Col>
      <Col span={24} className='company-item-info'>
        <div className='name-company'>{props.nameCompany ? props.nameCompany : 'Tên công ty'}</div>
        <div className='type-jobs'>
          <Tooltip title={props.field ? props.field.join(', ') : '_'}>
            <FaFolderOpen />
            <span style={{ maxWidth: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {props.field ? props.field.join(', ') : '_'}
            </span>
          </Tooltip>
        </div>
        <div className='quantiy-jobs'>
          <MdWork />
          {`${props.totalJobs ? props.totalJobs : 0} Việc làm`}
        </div>
      </Col>
      <Col className='btn-follow-container' span={24}>
        <Button onClick={handleClickShowDetail} size='large' className='btn-follow'>
          Chi tiết
        </Button>
      </Col>
    </Row>
  )
}

export default CompanyItem
