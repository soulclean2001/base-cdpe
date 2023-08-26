import React, { InputHTMLAttributes } from 'react'
import './InputCustom.scss'

interface InputCustomProps extends InputHTMLAttributes<HTMLInputElement> {}

const InputCustom = (props: InputCustomProps) => {
  return (
    <div className='wrap-input'>
      <input {...props} />
    </div>
  )
}

export default InputCustom
