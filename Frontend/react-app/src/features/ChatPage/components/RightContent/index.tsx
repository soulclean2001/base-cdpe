import RightItem from '../RightItem'
import { useState } from 'react'
import './style.scss'

const dataJobApplied = [
  {
    idUser: 'u1',
    idJob: 'idJob1',
    idCompany: 'idCompany1',
    logo: '',
    titleName: 'name job1',
    nameCompany: 'Công ty X'
  },
  {
    idUser: 'u2',
    idJob: 'idJob2',
    idCompany: 'idCompany2',
    logo: '',
    titleName: 'name job2',
    nameCompany: 'name company 2'
  }
]
const dataCandidate = [
  { idUser: 'u1', idJob: '', idCompany: '', logo: '', titleName: 'Phong', nameCompany: '' },
  { idUser: 'u2', idJob: '', idCompany: '', logo: '', titleName: 'Hiếu', nameCompany: '' }
]
const dataUserConnect = [
  { idUser: 'u1', idJob: '', idCompany: '', logo: '', titleName: 'Công ty X', nameCompany: '' },
  { idUser: 'u2', idJob: '', idCompany: '', logo: '', titleName: 'Phong', nameCompany: '' }
]
const RightContent = (props: any) => {
  const { roleType } = props

  // const [dataContact,setDataContact] = useState<Array<DataType>>([])
  const getDataByRoleType = () => {
    if (roleType === 'CANDIDATE_TYPE') {
      return dataJobApplied
    }
    if (roleType === 'EMPLOYER_TYPE') {
      return dataCandidate
    }
    if (roleType === 'ADMIN_TYPE') {
      return dataUserConnect
    }
    return []
  }
  return (
    <div className='right-content-chat-page-container'>
      <div className='header-container'>
        {roleType === 'CANDIDATE_TYPE' && <h5>TIN TUYỂN DỤNG ĐÃ ỨNG TUYỂN</h5>}
        {roleType === 'EMPLOYER_TYPE' && <h5>DANH SÁCH CÁC ỨNG TUYỂN VIÊN</h5>}
        {roleType === 'ADMIN_TYPE' && <h5>DANH SÁCH NGƯỜI DÙNG</h5>}
      </div>
      <div className='list-applied-jobs'>
        {getDataByRoleType().map((job) => (
          <RightItem key={job.idUser} data={job} />
        ))}
      </div>
    </div>
  )
}

export default RightContent
