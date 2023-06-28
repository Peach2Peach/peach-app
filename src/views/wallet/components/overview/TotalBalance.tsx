import { Image, View } from 'react-native'
import { Text } from '../../../../components'
import { BTCAmount } from '../../../../components/bitcoin'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import bitcoinAnimation from '../../../../assets/animated/bitcoin.gif'

type Props = ComponentProps & {
  amount: number
  isRefreshing?: boolean
}
export const TotalBalance = ({ amount, isRefreshing }: Props) => (
  <View style={tw`gap-4 self-stretch items-center`}>
    <View style={tw`flex-row items-center justify-center gap-3`}>
      <View style={tw`w-8 h-8`}>{/* layout dummy placeholder */}</View>
      <Text style={[tw`button-medium text-center`, isRefreshing && tw`opacity-60`]}>{i18n('wallet.totalBalance')}:</Text>
      <Image source={bitcoinAnimation} style={[tw`w-8 h-8`, !isRefreshing && tw`opacity-0`]} resizeMode="contain" />
    </View>
    <BTCAmount style={isRefreshing && tw`opacity-60`} amount={amount} size="extra large" />
  </View>
)
