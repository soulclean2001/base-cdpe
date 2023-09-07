import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'

import 'antd/dist/reset.css'

import SignUp from './features/JobSeeker/pages/SignUpJobSeeker'
import Job from './features/JobSeeker/pages/Job/Job'
import SignUpEmployer from './features/Employer/pages/SignUpEmployer'
import LoginEmployer from './features/Employer/pages/LoginEmployer'
import Login from './features/JobSeeker/pages/LoginJobSeeker'

import ServicesPage from './features/Employer/pages/ServicesPage'
import DashboardEmployer from './features/Employer/pages/Dashboard'
import Auth from './features/Auth'
import { UserRole } from './types'
import Home from './features/JobSeeker/pages/HomeJobSeeker'
import OauthGoogleLogin from './features/JobSeeker/pages/LoginJobSeeker/OauthGoogleLogin'
import { VerifyEmail } from './VerifyEmail'
import { VerifyForgotPasswordToken } from './VerifyForgotPasswordToken'
import ResetPassword from './ResetPassword'
import CompanyPage from './features/JobSeeker/pages/CompanyPage'
import 'react-toastify/dist/ReactToastify.css'
import CV from './features/JobSeeker/pages/CV'
import PostManagePage from './features/Employer/pages/Dashboard/pages/PostManagePage/PostManagePage'
import MyAccountManagePage from './features/Employer/pages/Dashboard/pages/MyAccountManagePage/MyAccountManagePage'
import CompanyManagePage from './features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import CartPage from './features/Employer/pages/CartPage'
import SettingsPage from './features/JobSeeker/pages/SettingsPage'
import Overview from './features/JobSeeker/pages/SettingsPage/components/Content/Overview/Overview'
import ManageCV from './features/Employer/pages/Dashboard/pages/ManageCV/ManageCV'
const titleLoginAdmin = {
  title: 'Chào mừng người quản trị',
  description: 'Cùng nhau xây dựng và tạo giá trị cho HFWork'
}
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout forRole='CADIDATE_ROLE' />}>
          <Route index element={<Home />}></Route>
          <Route path='jobs' element={<Job />} />
          <Route path='companies' element={<CompanyPage />} />
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
          </Route>
        </Route>
        <Route path='/candidate-login' element={<Login />} />
        <Route path='/candidate-sign-up' element={<SignUp />} />
        <Route path='/login/oauth' element={<OauthGoogleLogin />} />
        <Route path='/email-verifications' element={<VerifyEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<VerifyForgotPasswordToken />} />
        <Route path='/employer' element={<Layout forRole='EMPLOYER_ROLE' />}>
          <Route index element={<ServicesPage />} />
          <Route path='services' element={<ServicesPage />} />

          <Route
            path='cart'
            element={
              // <Auth role={UserRole.Employer}>
              <CartPage />
              // </Auth>
            }
          />

          <Route
            path='dashboard'
            element={
              // <Auth role={UserRole.Employer}>
              <DashboardEmployer />
              // </Auth>
            }
          >
            <Route path='cv-applied-manage' element={<ManageCV />} />
            <Route path='post-manage' element={<PostManagePage />} />
            <Route path='my-account-info' element={<MyAccountManagePage />} />
            <Route path='company-general' element={<CompanyManagePage />} />
          </Route>
        </Route>
        <Route path='/employer-sign-up' element={<SignUpEmployer />} />
        <Route path='/employer-login' element={<LoginEmployer />} />

        <Route
          path='/admin'
          element={
            <Auth role={UserRole.Administrators}>
              <Layout forRole='ADMIN_ROLE' />{' '}
            </Auth>
          }
        >
          <Route path='test' element={<LoginEmployer hiddenTabSignUp={true} titleForm={titleLoginAdmin} />} />
        </Route>
        <Route path='/admin-login' element={<LoginEmployer hiddenTabSignUp={true} titleForm={titleLoginAdmin} />} />
      </Routes>
    </>
  )
}

export default App
