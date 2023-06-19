import { TextStyle } from 'react-native'
import { Text } from '../../..'
import tw from '../../../../styles/tailwind'

type Props = {
  key: number
  style: (false | TextStyle)[]
  shouldBeBlack5: boolean
  isError: boolean
  letterSpacing: number
}
export const DotText = ({ style, shouldBeBlack5, isError, letterSpacing }: Props) => (
  <Text style={[style, shouldBeBlack5 && isError ? tw`text-error-mild` : tw`text-black-5`, { letterSpacing }]}>.</Text>
)
