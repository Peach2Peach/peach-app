import { TextStyle } from 'react-native'
import { Text } from '../../..'
import tw from '../../../../styles/tailwind'

type Props = {
  letterSpacing: number
  style: (false | TextStyle)[]
  reduceOpacity: boolean
  isError: boolean
  char: string
}

export const BTCAmountChar = ({ style, letterSpacing, reduceOpacity, isError, char }: Props) => (
  <Text
    style={[style, isError ? tw`text-error-dark` : tw`text-black-1`, reduceOpacity && tw`opacity-10`, { letterSpacing }]}
  >
    {char}
  </Text>
)
