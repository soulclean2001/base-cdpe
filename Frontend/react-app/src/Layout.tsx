import { Outlet } from 'react-router-dom'
import Header from './components/Header'

const Layout = () => {
  return (
    <div className='container'>
      <Header />
      <Outlet />
      <footer>Footer</footer>
    </div>
  )
}

export default Layout
