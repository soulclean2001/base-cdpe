import Layout from './Layout'
import { Routes, Route } from 'react-router-dom'
import Home from './features/Home/Home'
import 'antd/dist/reset.css'
import { Account } from './features/Account'
import SignUp from './features/Account/pages/SignUp/SignUp'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />}></Route>
        </Route>
        <Route path='/login' element={<Account />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
