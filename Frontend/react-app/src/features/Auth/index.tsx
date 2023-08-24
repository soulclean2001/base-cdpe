import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '../../app/store'
import { AuthState } from './authSlice'
import { isExpired } from '~/utils/jwt'
import { UserRole } from '~/types'

interface AuthProps {
  children: ReactNode
  role?: number
}

const Auth = ({ children, role }: AuthProps) => {
  const user = useSelector((state: RootState) => state.auth) as AuthState
  const location = useLocation()
  if (role && (user.role !== role || isExpired(user.accessToken))) {
    console.log(user.role)

    switch (user.role) {
      case UserRole.Candidate: {
        return <Navigate to='/candidate-login' state={{ from: location }} replace />
      }
      case UserRole.Employer: {
        return <Navigate to='/employer-login' state={{ from: location }} replace />
      }
      case UserRole.Administrators: {
        return <Navigate to='/admin-login' state={{ from: location }} replace />
      }
    }
  }
  return children
}

export default Auth
