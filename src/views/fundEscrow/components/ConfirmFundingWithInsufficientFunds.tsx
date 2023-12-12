import { View } from 'react-native'
import { Text } from '../../../components'
import { BTCAmount, ShortBitcoinAddress } from '../../../components/bitcoin'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string/thousands'

type Props = {
  amount: number
  address: string
  fee: number
  feeRate: number
}
export const ConfirmFundingWithInsufficientFunds = ({ amount, address, fee, feeRate }: Props) => (
  <View style={tw`gap-3`}>
    <Text>{i18n('fundFromPeachWallet.insufficientFunds.description.1')}</Text>
    <BTCAmount amount={amount} size="medium" />
    <Text>{i18n('fundFromPeachWallet.insufficientFunds.description.2')}</Text>
    <Text>
      {i18n('transaction.details.to')} <ShortBitcoinAddress address={address} />
    </Text>
    <Text>{i18n('transaction.details.networkFee', thousands(fee), thousands(feeRate))}</Text>
  </View>
)
