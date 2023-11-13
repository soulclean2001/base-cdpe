import { Button, Col, Row, Tabs, TabsProps } from 'antd'
import './style.scss'

import { BsFillShareFill } from 'react-icons/bs'
import CompanyInfo from './components/CompanyInfo/CompanyInfo'
import ListJob from './components/ListJob/ListJob'
import { useNavigate, useParams } from 'react-router-dom'
import logoTemp from '~/assets/HF_logo.jpg'
import bannerTemp from '~/assets/banner_temp.jpg'
import apiCompany from '~/api/company.api'
import { useState, useEffect } from 'react'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
import apiFollow from '~/api/follow.api'
import { toast } from 'react-toastify'
export interface TypeCompanyDetail {
  [key: string]: any
}
const CompanyDetail = () => {
  const { infoUrlCompanyDetail } = useParams()
  const [myCompany, setMyCompany] = useState<TypeCompanyDetail>()
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    getDetailCompany()
  }, [])
  const getDetailCompany = async () => {
    if (!infoUrlCompanyDetail) return
    const idCompany = infoUrlCompanyDetail.match(/id-(\w+)/)

    if (!idCompany) return
    await apiCompany.getDetailCompany(idCompany[1]).then((rs) => {
      setMyCompany(rs.result)
    })
    if (auth && auth.isLogin) {
      await apiCompany.checkFollowed(idCompany[1]).then((rs) => {
        setIsFollowed(rs.result)
      })
    }
  }
  const fetchFollowCompany = async (type: string) => {
    if (!myCompany) return
    if (!auth || !auth.isLogin) {
      navigate('/candidate-login')
      return
    }
    if (type === 'FOLLOW') {
      await apiFollow.follow(myCompany._id).then(() => {
        toast.success('Bạn đã theo dõi công ty thành công')
        setIsFollowed(true)
      })
    } else {
      await apiFollow.unFollow({ company_id: myCompany._id }).then(() => {
        toast.success('Bạn đã bỏ theo dõi công ty thành công')
        setIsFollowed(false)
      })
    }
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
  if (!myCompany)
    return (
      <div style={{ height: '86vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Công ty không tồn tại
      </div>
    )
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
            {isFollowed ? (
              <Button onClick={() => fetchFollowCompany('UNFOLLOW')} size='large' className='btn-follow'>
                Đang theo dõi
              </Button>
            ) : (
              <Button onClick={() => fetchFollowCompany('FOLLOW')} size='large' className='btn-follow'>
                Theo dõi
              </Button>
            )}

            {/* <Button size='large' className='btn-report' icon={<AiFillFlag />} /> */}
            <Button size='large' className='btn-share' icon={<BsFillShareFill />} />
          </Col>
        </Row>
        <Tabs className='tab-company-detail' defaultActiveKey='1' items={items} />
      </div>
    </div>
  )
}

export default CompanyDetail
