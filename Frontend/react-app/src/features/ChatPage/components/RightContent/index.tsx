import RightItem from '../RightItem'
import { useState, useEffect } from 'react'
import './style.scss'
import apiChat from '~/api/chat.api'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import avatarTemp from '~/assets/logo_temp.jpg'
interface ContactChatType {
  [key: string]: any
}
interface DataType {
  id: string
  idUser: string
  idJob: string | undefined
  idCompany: string | undefined
  logo: string
  titleName: string
  nameCompany: string | undefined
  titleJob: string
}

const RightContent = (props: any) => {
  const { roleType } = props
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const [dataContact, setDataContact] = useState<Array<DataType>>([])
  useEffect(() => {
    if (notificaions.page > 0) getDataByRoleType()
  }, [notificaions.total])

  // test api chứ chua co rap n bi vong fo moi thang nay bị bi gi bị vong lap có cái này chứ mấy  r do day nãy cũng có gọi nó đâu mà nó tự chạy api vậy t bấm dô cai list do
  const getDataByRoleType = async () => {
    if (roleType === 'CANDIDATE_TYPE') {
      await apiChat.getListChatForCandidate().then((rs) => {
        console.log('rs chat', rs)
        let temp = rs.result.map((item: ContactChatType) => {
          return {
            id: item._id,
            idUser: item.user_id,
            idJob: item.info_job._id,
            idCompany: item.info_company._id,
            logo: item.info_company.avatar ? item.info_company.avatar : avatarTemp,
            titleName: item.info_job.job_title,
            nameCompany: item.info_company.company_name,
            titleJob: item.info_job.job_title
          }
        })
        setDataContact(temp)
      })
    }
    if (roleType === 'EMPLOYER_TYPE') {
      await apiChat.getListChatForEmployer().then((rs) => {
        console.log('rs chat', rs)
        let temp = rs.result.map((item: ContactChatType) => {
          return {
            id: item._id,
            idUser: item.user_id,
            idJob: item.info_job._id,
            idCompany: item.info_company._id,
            logo: item.info_user.avatar ? item.info_user.avatar : avatarTemp,
            titleName: item.full_name,
            nameCompany: '',
            titleJob: item.info_job.job_title
          }
        })
        setDataContact(temp)
      })
    }
    if (roleType === 'ADMIN_TYPE') {
    }
  }
  return (
    <div className='right-content-chat-page-container'>
      <div className='header-container'>
        {roleType === 'CANDIDATE_TYPE' && <h5>TIN TUYỂN DỤNG ĐÃ ỨNG TUYỂN</h5>}
        {roleType === 'EMPLOYER_TYPE' && <h5>DANH SÁCH CÁC ỨNG TUYỂN VIÊN</h5>}
        {roleType === 'ADMIN_TYPE' && <h5>DANH SÁCH NGƯỜI DÙNG</h5>}
      </div>
      <div className='list-applied-jobs'>
        {dataContact.map((job) => (
          <RightItem key={job.id} infoRoom={{ userId: job.idUser, companyId: job.idCompany }} data={job} />
        ))}
      </div>
    </div>
  )
}

export default RightContent
