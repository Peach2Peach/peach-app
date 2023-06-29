import { Image, View } from 'react-native'
import { Placeholder, Text } from '../../../../components'
import { BTCAmount } from '../../../../components/bitcoin'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import bitcoinAnimation from '../../../../assets/animated/bitcoin.gif'

type Props = ComponentProps & {
  amount: number
  isRefreshing?: boolean
}
export const TotalBalance = ({ amount, isRefreshing }: Props) => (
  <View style={tw`items-center self-stretch gap-4`}>
    <View style={tw`flex-row items-center self-stretch justify-center gap-14px`}>
      <Placeholder style={tw`w-8 h-8`} />
      <Text style={[tw`text-center button-medium`, isRefreshing && tw`opacity-60`]}>{i18n('wallet.totalBalance')}:</Text>
      <Image source={bitcoinAnimation} style={[tw`w-8 h-8`, !isRefreshing && tw`opacity-0`]} resizeMode="cover" />
    </View>
    <BTCAmount style={isRefreshing && tw`opacity-60`} amount={amount} size="extra large" />
  </View>
)
