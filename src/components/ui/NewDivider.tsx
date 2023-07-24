import { View } from 'react-native'
import { HorizontalLine } from './HorizontalLine'
import { Text } from '../text'
import tw from '../../styles/tailwind'

type Props = {
  title: string
}

export const NewDivider = ({ title }: Props) => (
  <View style={tw`flex-row items-center self-stretch justify-center gap-2`}>
    <Text style={tw`h7`}>{title}</Text>
    <HorizontalLine />
  </View>
)
