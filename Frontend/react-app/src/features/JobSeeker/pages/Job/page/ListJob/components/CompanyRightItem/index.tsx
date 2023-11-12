import { Link, useNavigate } from 'react-router-dom'
import './style.scss'
import logoTemp from '~/assets/logo_temp.jpg'
import bannerTemp from '~/assets/HF_logo.jpg'
interface DataType {
  id: string
  name: string
  logo: string
  banner: string
}
interface PropsType {
  data?: DataType
}
const CompanyRightItem = (props: PropsType) => {
  const { data } = props
  const navigate = useNavigate()
  const handleClickShowDetail = (id: string, name: string) => {
    const convertNameEng = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    navigate(`/companies/${convertName}-id-${id}`)
  }
  if (!data) return <>...</>
  return (
    <div className='company-right-item-container'>
      <div className='banner-wapper'>
        <img src={data.banner ? data.banner : bannerTemp} alt='' />
      </div>
      <div className='logo-wapper'>
        <img src={data.logo ? data.logo : logoTemp} alt='' />
      </div>
      <div className='name'>{data.name}</div>
      {/* <div className='descript'>Tham gia</div> */}
      <span
        style={{ color: '#1677FF', cursor: 'pointer' }}
        onClick={() => handleClickShowDetail(data.id, data.name)}
        className='count-jobs'
      >{`Tham gia cùng chúng tôi`}</span>
    </div>
  )
}

export default CompanyRightItem
