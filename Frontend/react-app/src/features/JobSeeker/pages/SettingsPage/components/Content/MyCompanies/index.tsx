import { Tabs } from 'antd'
import './style.scss'
import { TabsProps } from 'antd/lib'
import ItemCompany from './components/ItemCompany'
import apiFollow from '~/api/follow.api'
import { useState, useEffect } from 'react'
const onChangeTab = (key: string) => {
  console.log(key)
}
const items: TabsProps['items'] = [
  {
    key: '2',
    label: 'Đang theo dõi',
    children: <></>
  }
]
interface AnyType {
  [key: string]: any
}
const MyCompanies = () => {
  const [listFollowed, setListFollowed] = useState<AnyType[]>([])
  useEffect(() => {
    fetchGetCompaniesFollowed()
  }, [])
  const fetchGetCompaniesFollowed = async () => {
    await apiFollow.getCompanyCandidateHasFollowed().then((rs) => {
      setListFollowed(rs.result)
    })
  }

  return (
    <div className='my-company-container-in-setting-page'>
      <div className='title'>Công Ty Của Tôi</div>
      <div className='list-companies-container'>
        <Tabs className='tab-container' defaultActiveKey='1' items={items} onChange={onChangeTab} />
        <div style={{ padding: '0 15px 15px 15px' }}>
          {listFollowed &&
            listFollowed.map((company) => (
              <ItemCompany
                key={company.company._id}
                data={{
                  id: company.company._id,
                  logo: company.company.logo,
                  nameCompany: company.company.company_name,
                  industries: company.company.fields?.join(', ') || '',
                  area:
                    company.company.working_locations
                      .map((loc: any) => {
                        return loc.city_name
                      })
                      .filter((value: any, index: number, self: any) => {
                        return self.indexOf(value) === index
                      })
                      ?.join(', ') || ''
                }}
              />
            ))}
          {!listFollowed ||
            (listFollowed.length < 1 && (
              <span style={{ fontSize: '14px', fontWeight: '300' }}>Bạn chưa theo dõi công ty</span>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MyCompanies
