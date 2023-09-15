// InputAutoResize.tsx
import { useState, useEffect, MutableRefObject, InputHTMLAttributes, useRef } from 'react'
import './InputAutoResize.scss'

interface InputAutoResizeProps extends InputHTMLAttributes<HTMLInputElement> {
  refelement?: MutableRefObject<HTMLInputElement | null>
  width?: string
}

const InputAutoResize = (props: InputAutoResizeProps) => {
  const { value, onChange, id, style, width } = props
  const [inputWidth, setInputWidth] = useState<number | null>(100)

  useEffect(() => {
    const inputElement = document.getElementById(`auto-resize-input-${id}`)
    if (inputElement) {
      inputElement.style.width = width ? width : '100px'
      inputElement.style.width = inputElement.scrollWidth + 5 + 'px'
    }
  }, [value])

  return (
    <div className='wrap-input-auto-resize'>
      <input
        {...props}
        ref={props.refelement}
        id={`auto-resize-input-${id}`}
        type='text'
        value={value}
        style={{ ...style, width: inputWidth ? inputWidth + 'px' : 'auto' }}
      />
      <div className='line'></div>
    </div>
  )
}

export default InputAutoResize
