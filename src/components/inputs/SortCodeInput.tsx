import React, { ReactElement } from 'react'
import { enforceSortCodeFormat } from '../../utils/format/enforceSortCodeFormat'
import Input, { InputProps } from './Input'

export const SortCodeInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (sortCode: string) => onChange(enforceSortCodeFormat(sortCode)) : undefined,
      onSubmit: onSubmit ? (sortCode: string) => onSubmit(enforceSortCodeFormat(sortCode)) : undefined,
    }}
  />
)
