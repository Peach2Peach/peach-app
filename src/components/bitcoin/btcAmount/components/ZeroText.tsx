import { TextStyle } from 'react-native'
import { Text } from '../../..'
import tw from '../../../../styles/tailwind'

type Props = {
  letterSpacing: number
  style: (false | TextStyle)[]
  shouldBeBlack5: boolean
  isError: boolean
  key: number
}

export const ZeroText = ({ style, letterSpacing, shouldBeBlack5, isError }: Props) => (
  <Text
    style={[
      style,
      shouldBeBlack5 ? (isError ? tw`text-error-mild` : tw`text-black-5`) : isError && tw`text-error-dark`,
      { letterSpacing },
    ]}
  >
    0
  </Text>
)
