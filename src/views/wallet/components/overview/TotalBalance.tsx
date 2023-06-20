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
  <View>
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={[tw`button-medium text-center`, isRefreshing && tw`opacity-60`]}>{i18n('wallet.totalBalance')}:</Text>
      <View style={tw`w-0 h-8 `}>
        {isRefreshing && <Image source={bitcoinAnimation} style={tw`w-8 h-8 left-4 absolute`} resizeMode="contain" />}
      </View>
    </View>
    <BTCAmount style={isRefreshing && tw`opacity-60`} amount={amount} size="extra large" />
  </View>
)
