import { View } from 'react-native'
import { Loading, Text } from '../../../../components'
import { BTCAmount } from '../../../../components/bitcoin'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = ComponentProps & {
  amount: number
  isRefreshing?: boolean
}
export const TotalBalance = ({ amount, isRefreshing }: Props) => (
  <View style={tw`items-center self-stretch gap-4`}>
    <View style={tw`flex-row items-center self-stretch justify-center gap-14px`}>
      <Text style={[tw`text-center button-medium`, isRefreshing && tw`opacity-60`]}>{i18n('wallet.totalBalance')}:</Text>
      {isRefreshing && <Loading style={tw`absolute top-4`} />}
    </View>
    <BTCAmount style={isRefreshing && tw`opacity-60`} amount={amount} size="extra large" />
  </View>
)
