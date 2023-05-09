import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from './Text'

type Props = { text: String }

export const BulletPoint = ({ text }: Props) => (
  <View style={tw`flex-row pl-3`}>
    <PeachText style={tw`text-xl body-m`}>· </PeachText>
    <PeachText style={tw`body-m`}>{text}</PeachText>
  </View>
)
