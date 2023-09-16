import InputAutoResize from '../InputAutoResize'
import './InputEditAutoResize.scss'
import { useState, useRef, useEffect, InputHTMLAttributes, MutableRefObject } from 'react'
import { Button } from 'antd'
import { DeleteRowOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { omit } from 'lodash'

interface InputAutoResizeProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string
  width?: string
  defaultstring?: string
  setdefaultdata?: (value: string) => void
  deletesection?: () => void
}

const InputEditAutoResize = (props: InputAutoResizeProps) => {
  const { setdefaultdata, defaultstring, deletesection } = props
  props = omit(props, ['defaultstring', 'setdefaultdata', 'deletesection'])
  const [isDisable, setIsDisable] = useState(true)
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (!isDisable) inputRef.current?.select()
  }, [isDisable])
  return (
    <div className='wrap-input-ar'>
      <InputAutoResize
        {...props}
        style={{
          fontSize: '19px',
          fontWeight: 500
        }}
        width={props.width || '100px'}
        disabled={isDisable}
        refelement={inputRef}
      />
      <Button
        type='text'
        style={{ padding: '4px' }}
        onClick={() => {
          setIsDisable(!isDisable)
        }}
      >
        <EditOutlined />
      </Button>
      <Button
        style={{ padding: '4px' }}
        type='text'
        onClick={() => {
          if (setdefaultdata && defaultstring) setdefaultdata(defaultstring)
          setIsDisable(true)
        }}
      >
        <ReloadOutlined />
      </Button>

      {deletesection && (
        <Button style={{ padding: '4px' }} type='text' onClick={deletesection}>
          <DeleteRowOutlined />
        </Button>
      )}
    </div>
  )
}

export default InputEditAutoResize
