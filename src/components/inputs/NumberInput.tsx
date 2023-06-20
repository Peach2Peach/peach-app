import { enforceDecimalsFormat, enforceNumberFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

type Props = InputProps & {
  decimals?: number
}
export const NumberInput = ({ decimals, onChange, onSubmit, ...props }: Props) => {
  const enforceFormat = (number: string) => {
    const formatted = enforceNumberFormat(number)
    if (decimals) return enforceDecimalsFormat(formatted, decimals)
    return formatted
  }

  return (
    <Input
      {...{
        ...props,
        keyboardType: 'numeric',
        onChange: onChange ? (number: string) => onChange(enforceFormat(number)) : undefined,
        onSubmit: onSubmit ? (number: string) => onSubmit(enforceFormat(number)) : undefined,
      }}
    />
  )
}
