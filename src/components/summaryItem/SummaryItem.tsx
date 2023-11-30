import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'

export type SummaryItemProps = ComponentProps & {
  title: string
}
export const SummaryItem = ({ title, children, style }: SummaryItemProps) => (
  <View style={[tw`flex-row flex-wrap justify-between max-w-full`, style]}>
    <Text style={[tw`body-m text-black-3`, tw`md:body-l`]}>{title}</Text>
    <View>{children}</View>
  </View>
)
