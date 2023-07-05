import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Left } from './Left'
import { Right } from './Right'
import { StatusCardProps } from '../StatusCard'

export const Top = (props: StatusCardProps) => (
  <View style={tw`flex-row items-center justify-between gap-2 px-4 py-3`}>
    <Left {...props} />
    <Right {...props} />
  </View>
)
