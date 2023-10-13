import { TextStyle } from 'react-native'
import { Text } from '../../..'
import tw from '../../../../styles/tailwind'

type Props = {
  letterSpacing: number
  style: (false | TextStyle)[]
  reduceOpacity: boolean
  white: boolean
  char: string
}

export const BTCAmountChar = ({ style, letterSpacing, reduceOpacity, white, char }: Props) => (
  <Text
    style={[
      style,
      {
        letterSpacing,
        color: `${(white ? tw`text-primary-background-light` : tw`text-black-1`).color?.toString()}${
          reduceOpacity ? '1A' : ''
        }`,
      },
    ]}
  >
    {char}
  </Text>
)
