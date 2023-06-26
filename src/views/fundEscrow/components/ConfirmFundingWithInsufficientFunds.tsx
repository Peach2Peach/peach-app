import { View } from 'react-native'
import { Text } from '../../../components'
import { ShortBitcoinAddress, BTCAmount } from '../../../components/bitcoin'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import tw from '../../../styles/tailwind'

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
      {i18n('fundFromPeachWallet.confirm.to')} <ShortBitcoinAddress address={address} />
    </Text>
    <Text>{i18n('fundFromPeachWallet.confirm.networkFee', thousands(fee), thousands(feeRate))}</Text>
  </View>
)
