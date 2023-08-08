import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '../../app/store'

const Auth = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()

  // if(!user.state.isAuthenticated) {
  //     return <Navigate to="/login" state={{ from: location}} replace />
  // }
  if (!user) return <Navigate to='/login' state={{ from: location }} replace />
  return children
}

export default Auth
