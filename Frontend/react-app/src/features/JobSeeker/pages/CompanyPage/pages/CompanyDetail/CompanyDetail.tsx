import { Button, Col, Row, Tabs, TabsProps } from 'antd'
import './style.scss'
import { AiFillFlag } from 'react-icons/ai'
import { BsFillShareFill } from 'react-icons/bs'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
import ListJob from './components/ListJob/ListJob'
import { useParams } from 'react-router-dom'
import logoTemp from '~/assets/HF_logo.jpg'
import bannerTemp from '~/assets/banner_temp.jpg'
import apiCompany from '~/api/company.api'
import { useState, useEffect } from 'react'
export interface TypeCompanyDetail {
  [key: string]: any
}
const CompanyDetail = () => {
  const { infoUrlCompanyDetail } = useParams()
  const [myCompany, setMyCompany] = useState<TypeCompanyDetail>()
  useEffect(() => {
    getDetailCompany()
  }, [])
  const getDetailCompany = async () => {
    if (!infoUrlCompanyDetail) return
    const idCompany = infoUrlCompanyDetail.match(/id-(\w+)/)
    console.log('idCompany', idCompany?.[1])
    if (!idCompany) return
    await apiCompany.getDetailCompany(idCompany[1]).then((rs) => {
      console.log('rs detail', rs)
      setMyCompany(rs.result)
    })
  }
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Về chúng tôi',
      children: <CompanyInfo data={myCompany} />
    },
    {
      key: '2',
      label: 'Vị trí đang tuyển dụng',
      children: <ListJob companyId={myCompany ? myCompany._id : ''} />
    }
  ]
  return (
    <div id='company-detail-page-container'>
      <div className='header-container'>
        <div className='banner-container'>
          <img className='banner' src={myCompany && myCompany.background ? myCompany.background : bannerTemp}></img>
        </div>
        <Row className='header-content'>
          <Col lg={18} md={17} sm={24} xs={24} className='left-content'>
            <div className='logo-container'>
              <div
                className='logo'
                style={{
                  backgroundImage: `url(${myCompany && myCompany.logo ? myCompany.logo : logoTemp})`
                }}
              ></div>
            </div>
            <div className='info'>
              <div className='name-company'>{myCompany && myCompany.company_name}</div>
              <div className='total-followers'>{myCompany && myCompany.follow_num} lượt theo dõi</div>
            </div>
          </Col>
          <Col lg={5} md={6} sm={24} xs={24} className='right-content'>
            <Button size='large' className='btn-follow'>
              Theo dõi
            </Button>
            <Button size='large' className='btn-report' icon={<AiFillFlag />} />
            <Button size='large' className='btn-share' icon={<BsFillShareFill />} />
          </Col>
        </Row>
        <Tabs className='tab-company-detail' defaultActiveKey='1' items={items} onChange={onChange} />
      </div>
    </div>
  )
}

export default CompanyDetail
