import { ReactElement } from 'react'
import { enforceWalletFormat } from '../../utils/format/enforceWalletFormat'
import Input, { InputProps } from './Input'

export const WalletInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (wallet: string) => onChange(enforceWalletFormat(wallet)) : undefined,
      onSubmit: onSubmit ? (wallet: string) => onSubmit(enforceWalletFormat(wallet)) : undefined,
    }}
  />
)
