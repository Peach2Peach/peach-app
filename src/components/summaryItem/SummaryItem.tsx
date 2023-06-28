import { View } from 'react-native'
import { Text } from '../text'
import tw from '../../styles/tailwind'

export type SummaryItemProps = ComponentProps & {
  title: string
}
export const SummaryItem = ({ title, children, style }: SummaryItemProps) => (
  <View style={[tw`flex-row justify-between max-w-full flex-wrap`, style]}>
    <Text style={[tw`body-m text-black-3`, tw.md`body-l`]}>{title}</Text>
    <View>{children}</View>
  </View>
)
