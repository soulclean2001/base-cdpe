import { Link } from 'react-router-dom'
import './style.scss'

const CompanyRightItem = () => {
  return (
    <div className='company-right-item-container'>
      <div className='banner-wapper'>
        <img
          src='https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages02.vietnamworks.com%2Fcompanyprofile%2Fbanner-default-company.png&w=750&q=75'
          alt=''
        />
      </div>
      <div className='logo-wapper'>
        <img src='https://images.vietnamworks.com/pictureofcompany/41/11130398.png' alt='' />
      </div>
      <div className='name'>
        Nab Innovation Centre Vietnammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
      </div>
      {/* <div className='descript'>Tham gia</div> */}
      <Link to={'/jobs/job-detail'} className='count-jobs'>{`3 vị trí đang tuyển dụng`}</Link>
    </div>
  )
}

export default CompanyRightItem
