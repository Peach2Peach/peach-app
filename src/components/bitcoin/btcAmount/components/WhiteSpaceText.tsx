import { TextStyle } from 'react-native'
import { Text } from '../../..'

type Props = {
  style: (false | TextStyle)[]
  letterSpacing: number
}

export const WhiteSpaceText = ({ style, letterSpacing }: Props) => <Text style={[style, { letterSpacing }]}> </Text>
