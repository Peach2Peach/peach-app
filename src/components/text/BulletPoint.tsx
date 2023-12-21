import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from './PeachText'

type Props = { text: string }

export const BulletPoint = ({ text }: Props) => (
  <View style={tw`flex-row pl-3`}>
    <PeachText style={tw`text-xl body-m`}>· </PeachText>
    <PeachText style={tw`body-m`}>{text}</PeachText>
  </View>
)
