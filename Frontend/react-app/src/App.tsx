import Layout from './Layout'
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom'

import 'antd/dist/reset.css'

import SignUp from './features/JobSeeker/pages/SignUpJobSeeker'
import Job from './features/JobSeeker/pages/Job/Job'
import SignUpEmployer from './features/Employer/pages/SignUpEmployer'
import LoginEmployer from './features/Employer/pages/LoginEmployer'
import Login from './features/JobSeeker/pages/LoginJobSeeker'

import HomePage from './features/Employer/pages/HomePage'
import DashboardEmployer from './features/Employer/pages/Dashboard'
import Auth from './features/Auth'
import { ApiResponse, ConversationType, RoomType, UserRole } from './types'
import Home from './features/JobSeeker/pages/HomeJobSeeker'
import OauthGoogleLogin from './features/JobSeeker/pages/LoginJobSeeker/OauthGoogleLogin'
import { VerifyEmail } from './VerifyEmail'
import { VerifyForgotPasswordToken } from './VerifyForgotPasswordToken'
import ResetPassword from './ResetPassword'
import CompanyPage from './features/JobSeeker/pages/CompanyPage'
import 'react-toastify/dist/ReactToastify.css'
import CV from '~/features/JobSeeker/pages/CV'
import PostManagePage from './features/Employer/pages/Dashboard/pages/PostManagePage/PostManagePage'
import MyAccountManagePage from './features/Employer/pages/Dashboard/pages/MyAccountManagePage/MyAccountManagePage'
import CompanyManagePage from './features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import CartPage from './features/Employer/pages/CartPage'
import SettingsPage from './features/JobSeeker/pages/SettingsPage'
import Overview from './features/JobSeeker/pages/SettingsPage/components/Content/Overview/Overview'
import ManageCV from './features/Employer/pages/Dashboard/pages/ManageCV/ManageCV'
import JobDetailPage from './features/JobSeeker/pages/Job/page/JobDetailPage'
import ListJob from './features/JobSeeker/pages/Job/page/ListJob/ListJob'
import ListCompany from './features/JobSeeker/pages/CompanyPage/pages/ListCompany/ListCompany'
import CompanyDetail from './features/JobSeeker/pages/CompanyPage/pages/CompanyDetail/CompanyDetail'
import FindCandidatePage from './features/Employer/pages/Dashboard/pages/FindCandidatePage'
import MyCompanies from './features/JobSeeker/pages/SettingsPage/components/Content/MyCompanies'
import MyJobs from './features/JobSeeker/pages/SettingsPage/components/Content/MyJobs'
import ChatPage from './features/ChatPage'
import CandidateDetailPage from './features/Employer/pages/Dashboard/pages/CandidateDetailPage'
import ServicesPage from './features/Employer/pages/ServicesPage'
import NotFoundPage from './components/NotFound'
import AdminOverview from './features/Admin/contents/Overview'
import UsersManage from './features/Admin/contents/UsersManage'
import PostReviewManage from './features/Admin/contents/PostReviewManage'
import ServicesManage from './features/Admin/contents/ServicesManage'
import OrdersManage from './features/Admin/contents/OrdersManage'
import AdminPage from './features/Admin'
import OverviewEmployer from './features/Employer/pages/Dashboard/pages/OverviewPage'
import ListPostReview from './features/Admin/contents/PostReviewManage/pages/ListPostReview'

import { AppThunkDispatch, useAppDispatch } from './app/hook'
import { AuthPayload, AuthState, logout, setToken } from './features/Auth/authSlice'
import { RootState } from './app/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getTimeExpired, isExpired } from './utils/jwt'
import { getMe } from './features/Account/meSlice'
import WorkLocationPage from './features/Employer/pages/Dashboard/pages/WorkLocationPage'
import { Socket, io } from 'socket.io-client'
import { setSocket } from './features/User/userSlice'
import { addMessage, setRooms } from './features/ChatPage/chatSlice'
import ActivePage from './features/ActivePage'
import ForgotPasswordPage from './features/ForgotPasswordPage'
import ResetPasswordPage from './features/ResetPasswordPage'
import MyServicesPage from './features/Employer/pages/Dashboard/pages/MyServicesPage'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import apiClient from './api/client'
import CVAppliedDetailPage from './features/Employer/pages/Dashboard/pages/CVAppliedDetailPage'
import CandidateFollowedPage from './features/Employer/pages/Dashboard/pages/CandidateFollowedPage'
import MyOrdersPage from './features/Employer/pages/Dashboard/pages/MyOrdersPage'
import VNPayReturn from './features/Employer/pages/CartPage/components/VNPAY/VNPayReturn'
import RoadMapPage from './features/RoadMapPage'
import { notification } from 'antd'
import { NotificationType, addNotify } from './components/Header/NotifyDrawer/notifySlice'

const titleLoginAdmin = {
  title: 'Chào mừng người quản trị',
  description: 'Cùng nhau xây dựng và tạo giá trị cho HFWork'
}
export let socket: Socket

function App() {
  const navigate = useNavigate()
  const dispatchAsync: AppThunkDispatch = useAppDispatch()
  const dispatch = useDispatch()
  const chat = useSelector((state: RootState) => state.chat)
  const user = useSelector((state: RootState) => state.user)
  const [loop, setLoop] = useState<any>()
  const auth: AuthState = useSelector((state: RootState) => state.auth)

  const connectSocket = async () => {
    return new Promise((resolve, reject) => {
      socket = io(import.meta.env.VITE_API_URL, {
        auth: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      })
      socket.emit('join', auth.user_id)
      dispatch(setSocket(socket))
    })
  }

  const getRefreshToken = async () => {
    if (!auth.refreshToken || !auth.accessToken) return
    try {
      const response = await axios.post('http://localhost:4000/api/v1/users/refresh-token', {
        refresh_token: auth.refreshToken
      })

      const { access_token, refresh_token } = response.data.result

      dispatch(setToken({ accessToken: access_token, refreshToken: refresh_token }))

      if (socket) {
        socket.emit('update_token', access_token)
      }
    } catch (e) {}
  }

  const getProfile = async () => {
    await dispatchAsync(getMe())
  }
  useEffect(() => {
    if (auth.refreshToken && isExpired(auth.accessToken)) {
      getRefreshToken()
    }
  }, [])

  useEffect(() => {
    if (auth.isLogin && auth.accessToken && !isExpired(auth.accessToken)) {
      connectSocket()
      socket.on('new-message', (conversation: ConversationType) => {
        dispatch(addMessage(conversation))
      })
      fetchListRooms()
      socket.on('new-notification', (notify: NotificationType) => {
        console.log('noti socket', notify)
        dispatch(addNotify(notify))
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [auth.isLogin])

  useEffect(() => {
    if (auth.isLogin && !isExpired(auth.accessToken)) getProfile()

    setTimeout(
      async () => {
        await getRefreshToken()
      },
      getTimeExpired(auth.accessToken) * 1000 - 90000 //86390000
    )
  }, [auth.refreshToken])
  const fetchListRooms = async () => {
    let rooms: RoomType[] = []
    if (auth.role === UserRole.Employer) {
      const listRooms: ApiResponse = await apiClient.get('/conversations/rooms/company')
      dispatch(setRooms(listRooms.result))
      rooms = listRooms.result
    }

    if (auth.role === UserRole.Candidate) {
      const listRooms: ApiResponse = await apiClient.get('/conversations/rooms/user')
      dispatch(setRooms(listRooms.result))
      rooms = listRooms.result
    }

    const roomIds = rooms.map((room) => room._id) // tách ra file thì kh biết tách sao nên để z luôn chứ nó sai nữa
    socket.emit('join-conversations', roomIds)
  }

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <Routes>
        <Route path='/' element={<Layout forRole='CADIDATE_ROLE' />}>
          <Route index element={<Home />} />
          <Route path='active-page' element={<ActivePage />} />
          <Route path='road-map' element={<RoadMapPage />} />
          <Route path='jobs' element={<Job />}>
            <Route index element={<ListJob />} />
            <Route path=':infoUrlJobDetail' element={<JobDetailPage />} />
          </Route>

          <Route path='companies' element={<CompanyPage />}>
            <Route index element={<ListCompany />} />
            <Route path=':infoUrlCompanyDetail' element={<CompanyDetail />} />
          </Route>
          <Route path='CV' element={<CV />} />
          <Route
            path='settings'
            element={
              // <Auth role={UserRole.Cadidate}>
              <SettingsPage />
              // </Auth>
            }
          >
            <Route index element={<Overview />} />

            <Route path='my-companies' element={<MyCompanies />} />
            <Route path='my-jobs' element={<MyJobs />} />
          </Route>
          <Route path='chat' element={<ChatPage roleType={'CANDIDATE_TYPE'} />} />
        </Route>
        <Route path='/candidate-login' element={<Login />} />
        <Route path='/candidate-sign-up' element={<SignUp />} />
        <Route path='/login/oauth' element={<OauthGoogleLogin />} />
        <Route path='/email-verifications' element={<VerifyEmail />} />
        {/* <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<VerifyForgotPasswordToken />} /> */}
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/employer' element={<Layout forRole='EMPLOYER_ROLE' />}>
          <Route index element={<HomePage />} />
          <Route path='active-page' element={<ActivePage />} />
          <Route path='road-map' element={<RoadMapPage />} />
          <Route path='services' element={<ServicesPage />} />
          <Route path='chat' element={<ChatPage roleType={'EMPLOYER_TYPE'} />} />
          <Route
            path='cart'
            element={
              // <Auth role={UserRole.Employer}>
              <CartPage />
              // </Auth>
            }
          />
          <Route
            path='order'
            element={
              <>
                <Outlet />
              </>
            }
          >
            <Route path=':order' element={<VNPayReturn />} />
          </Route>
          <Route
            path='dashboard'
            element={
              // <Auth role={UserRole.Employer}>
              <DashboardEmployer />
              // </Auth>
            }
          >
            <Route index element={<OverviewEmployer />} />
            <Route
              path='cv-manage'
              element={
                <>
                  <Outlet />
                </>
              }
            >
              <Route index element={<ManageCV />} />
              <Route
                path='tracked-candidate'
                element={
                  <>
                    <Outlet />
                  </>
                }
              >
                <Route index element={<CandidateFollowedPage />} />
                <Route path=':infoUrlCandidate' element={<CandidateDetailPage type={'FOLLOW_TYPE'} />} />
              </Route>
              <Route path=':infoUrlAppliedCV' element={<CVAppliedDetailPage />} />
            </Route>
            <Route path='post-manage' element={<PostManagePage />} />
            <Route path='my-account-info' element={<MyAccountManagePage />} />
            <Route path='company-general' element={<CompanyManagePage />} />
            <Route path='company-location' element={<WorkLocationPage />} />
            <Route
              path='find-candidate'
              element={
                <>
                  <Outlet />
                </>
              }
            >
              <Route index element={<FindCandidatePage />} />
              <Route path=':infoUrlCandidate' element={<CandidateDetailPage />} />
            </Route>

            <Route path='my-services' element={<MyServicesPage />} />
            <Route path='my-orders' element={<MyOrdersPage />} />
          </Route>
        </Route>
        <Route path='/employer-sign-up' element={<SignUpEmployer />} />
        <Route path='/employer-login' element={<LoginEmployer />} />

        <Route
          path='/admin'
          element={
            // <Auth role={UserRole.Administrators}>
            <Layout forRole='ADMIN_ROLE' />

            // </Auth>
          }
        >
          <Route path='test' element={<LoginEmployer hiddenTabSignUp={true} titleForm={titleLoginAdmin} />} />
          <Route index element={<AdminPage />} />
          <Route path='dashboard' element={<AdminPage />}>
            <Route index element={<AdminOverview />} />
            <Route path='users-manage' element={<UsersManage />} />
            <Route path='post-review-manage' element={<PostReviewManage />}>
              <Route index element={<ListPostReview />} />
            </Route>

            <Route path='services-manage' element={<ServicesManage />} />
            <Route path='orders-manage' element={<MyOrdersPage roleType={'ADMIN_TYPE'} />} />
          </Route>
          <Route path='chat' element={<ChatPage roleType={'ADMIN_TYPE'} />} />
        </Route>

        <Route path='/admin-login' element={<LoginEmployer hiddenTabSignUp={true} titleForm={titleLoginAdmin} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
