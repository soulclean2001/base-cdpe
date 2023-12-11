import { Avatar } from 'antd'
import './style.scss'
import { format, parseISO } from 'date-fns'
import apiNotify from '~/api/notify.api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsRead } from '../NotifyDrawer/notifySlice'
import { useNavigate } from 'react-router-dom'
import { AuthState } from '~/features/Auth/authSlice'
import { RootState } from '~/app/store'
import ReactHtmlParser from 'html-react-parser'
import apiCandidate from '~/api/candidate.api'
interface DataType {
  id: string
  logo?: string
  name?: string
  actionInfo?: string
  createDate?: string
  isRead?: boolean
  type?: string
  idSender?: string
  nameSender?: string
  idCompany?: string
  jobId?: string
  jobTitle?: string
  job_applied_id?: string
  candidate_id?: string
}
interface PropsType {
  data: DataType
}
const NotifyItem = (props: any) => {
  const auth: AuthState = useSelector((state: RootState) => state.auth)
  const { data }: PropsType = props
  const disPath = useDispatch()
  const navigate = useNavigate()
  const handleShowDetail = (id: string, name: string, to: string) => {
    if (!id || !to) return
    console.log(name)
    // const convertNameEng = name
    //   .normalize('NFD')
    //   .replace(/[\u0300-\u036f]/g, '')
    //   .toLowerCase()
    // const convertName = convertNameEng.replace(/\s+/g, '-').trim()
    //companies || jobs ||
    // navigate(`/${to}/${convertName}-id-${id}`)
    navigate(`/${to}/id-${id}`)
  }
  const handleReadingNotify = async (id: string) => {
    if (!data) {
      console.log('Data')
      return
    }
    if (data && !data.isRead) {
      await apiNotify.seeNotify(id).then(() => {
        disPath(setIsRead(id))
      })
    }

    switch (data.type) {
      case 'cv/seen': {
        if (!data.nameSender || !data.idCompany) break
        handleShowDetail(data.idCompany, data.nameSender, 'companies')
        break
      }

      case 'post/created': {
        if (!data.jobTitle || !data.jobId) break
        handleShowDetail(data.jobId, data.jobTitle, 'jobs')
        break
      }
      case 'post/approved': {
        navigate('/employer/dashboard/post-manage')
        break
      }
      case 'post/rejected': {
        navigate('/employer/dashboard/post-manage')
        break
      }
      case 'post/pending': {
        navigate('/admin/dashboard/post-review-manage')
        break
      }
      case 'post/applied': {
        navigate('/employer/dashboard/cv-manage')
        break
      }
      case 'order/success': {
        navigate('/admin/dashboard/orders-manage')
        break
      }
      case 'chat': {
        if (!auth.isLogin) return
        if (auth.role.toString() === '0') {
          navigate('/admin/chat')
        }

        if (auth.role.toString() === '1') {
          navigate('/employer/chat')
        }

        if (auth.role.toString() === '2') {
          navigate('/chat')
        }
        break
      }
      case 'cv/approved': {
        navigate('/settings')
        break
      }
      case 'cv/potential': {
        navigate('/settings')
        break
      }
      case 'resume/update': {
        if (!data.candidate_id) return
        let nameCV = ''
        await apiCandidate.getCandidateDetail(data.candidate_id).then((rs) => {
          if (rs.result.cv.user_info && rs.result.cv.user_info.last_name) nameCV = rs.result.cv.user_info.last_name
        })

        handleShowDetail(data.candidate_id, nameCV, 'employer/dashboard/cv-manage/tracked-candidate')
        break
      }
      case 'potential/update': {
        navigate('/employer/dashboard/cv-manage')
        break
      }
      case 'order/completed': {
        navigate('/employer/dashboard/my-orders')
        break
      }
      case 'post/candidate_find_job': {
        if (!data.jobTitle || !data.jobId) break
        handleShowDetail(data.jobId, data.jobTitle, 'jobs')
        break
      }
      default:
        break
    }
  }
  if (!data) return <div>...</div>
  return (
    <div onClick={() => handleReadingNotify(data.id)} className='notify-item-container'>
      <Avatar className='logo' src={data.logo ? data.logo : ''} shape='circle' />
      <div className='info-notify'>
        <span className='name-company'>{data.name ? data.name : ''}</span>
        <span className={data.isRead ? 'action-info' : 'action-info info-not-read'}>
          {data.actionInfo && ReactHtmlParser(data.actionInfo)}
        </span>
        <span className={data.isRead ? 'create-time' : 'create-time time-not-read'}>
          {data.createDate ? format(parseISO(data.createDate), 'dd-MM-yyyy HH:mm:ss') : 'time'}
        </span>
      </div>
      <span className={data.isRead ? 'is-read' : 'is-read not-read'}> </span>
    </div>
  )
}

export default NotifyItem
