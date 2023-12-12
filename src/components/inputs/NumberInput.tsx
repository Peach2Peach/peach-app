import { enforceDecimalsFormat } from '../../utils/format/enforceDecimalsFormat'
import { Input, InputProps } from './Input'

type Props = InputProps & {
  decimals?: number
}
export const NumberInput = ({ decimals = 0, onChange, onSubmit, ...props }: Props) => (
  <Input
    {...props}
    keyboardType="numeric"
    onChange={onChange ? (number: string) => onChange(enforceDecimalsFormat(number, decimals)) : undefined}
    onSubmit={onSubmit ? (number: string) => onSubmit(enforceDecimalsFormat(number, decimals)) : undefined}
  />
)
