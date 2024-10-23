import React from 'react'
import { RemoveIcon } from './Icons'

export function Input ({
  onChange,
  value,
  ...rest
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  function onClear () {
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
  }

  const hasValue = !!value?.toString()

  return (
    <div className='input'>
      <input type='text' onChange={onChange} value={value} {...rest} />
      {hasValue && (
        <button type='button' onClick={onClear}>
          <RemoveIcon />
        </button>
      )}
    </div>
  )
}
