import React, { ReactElement } from 'react'
import { enforceIBANFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const IBANInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (iban: string) => onChange(enforceIBANFormat(iban)) : undefined,
      onSubmit: onSubmit ? (iban: string) => onSubmit(enforceIBANFormat(iban)) : undefined,
    }}
  />
)
