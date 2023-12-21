import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from '../text/PeachText'
import { HorizontalLine } from './HorizontalLine'

type Props = {
  title: string
}

export const NewDivider = ({ title }: Props) => (
  <View style={tw`flex-row items-center self-stretch justify-center gap-2`}>
    <PeachText style={tw`h7`}>{title}</PeachText>
    <HorizontalLine />
  </View>
)
