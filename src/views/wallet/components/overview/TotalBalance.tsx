import { View } from 'react-native'
import { Text } from '../../../../components'
import { BTCAmount } from '../../../../components/bitcoin'
import i18n from '../../../../utils/i18n'
import tw from '../../../../styles/tailwind'

type Props = ComponentProps & {
  amount: number
}
export const TotalBalance = ({ amount, style }: Props) => (
  <View style={style}>
    <Text style={tw`button-medium text-center`}>{i18n('wallet.totalBalance')}:</Text>
    <BTCAmount amount={amount} size="extra large" />
  </View>
)
