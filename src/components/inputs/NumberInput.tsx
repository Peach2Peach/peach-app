import { enforceDecimalsFormat } from '../../utils/format/enforceDecimalsFormat'
import { Input, InputProps } from './Input'

type Props = InputProps & {
  decimals?: number
}
export const NumberInput = ({ decimals = 0, onChangeText, ...props }: Props) => (
  <Input
    {...props}
    keyboardType="numeric"
    onChangeText={onChangeText ? (number: string) => onChangeText(enforceDecimalsFormat(number, decimals)) : undefined}
  />
)
