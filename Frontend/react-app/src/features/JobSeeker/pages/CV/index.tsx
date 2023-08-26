import React, { useState } from 'react'
import { Row, Col } from 'antd'

import './cv.scss'
import InputCustom from './components/InputCustom'

const CV = () => {
  const [title, setTitle] = useState('Hello')
  const onFocusInput = () => {}
  return (
    <div className='wrap'>
      <div className='left'>
        <h1>Personal Details</h1>
        <div>
          <InputCustom type='text' />
        </div>
      </div>
      <div className='right'></div>
    </div>
  )
}

export default CV
