import tw from '../../styles/tailwind'
import { InputProps } from './Input'
import { NumberInput } from './NumberInput'
type Props = InputProps & {
  decimals?: number
}
export const PercentageInput = ({ value, onChange, style, ...props }: Props) => (
  <NumberInput
    style={[tw`w-24`, style]}
    inputStyle={tw`text-right`}
    {...{ ...props, value, onChange }}
    decimals={2}
    icons={[['percent', () => {}]]}
  />
)
