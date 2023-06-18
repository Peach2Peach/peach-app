import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Left } from './Left'
import { Right } from './Right'
import { SummaryItemProps } from './StatusCard'

type Props = Pick<SummaryItemProps, 'amount' | 'currency' | 'price' | 'title' | 'icon'> & {
  subtext: string
}
export const Top = ({ title, icon, subtext, amount, price, currency }: Props) => (
  <View style={tw`flex-row items-center justify-between gap-2 px-4 py-3`}>
    <Left {...{ title, icon, subtext }} />
    <Right {...{ amount, price, currency }} />
  </View>
)
