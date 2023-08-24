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
            path='dashboard'
            element={
              <Auth role={UserRole.Employer}>
                <DashboardEmployer />
              </Auth>
            }
          />
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
