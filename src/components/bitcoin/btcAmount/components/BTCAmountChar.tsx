import { TextStyle } from 'react-native'
import tw from '../../../../styles/tailwind'
import { PeachText } from '../../../text/Text'

type Props = {
  letterSpacing: number
  style: (false | TextStyle)[]
  reduceOpacity: boolean
  white: boolean
  char: string
}

export const BTCAmountChar = ({ style, letterSpacing, reduceOpacity, white, char }: Props) => (
  <PeachText
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
  </PeachText>
)
