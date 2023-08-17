import { View } from 'react-native'
import { Text } from '../components'
import { BTCAmount, ShortBitcoinAddress } from '../components/bitcoin'
import i18n from '../utils/i18n'
import { thousands } from '../utils/string'
import tw from '../styles/tailwind'

type Props = {
  amount: number
  address: string
  fee: number
  feeRate: number
}

export const WithdrawalConfirmation = ({ amount, address, fee, feeRate }: Props) => (
  <View style={tw`gap-3`}>
    <Text>{i18n('wallet.sendBitcoin.youreSending')}</Text>
    <BTCAmount amount={amount} size="medium" />
    <Text>
      {i18n('transaction.details.to')} <ShortBitcoinAddress address={address} />
    </Text>
    <Text>{i18n('transaction.details.networkFee', thousands(fee), thousands(feeRate))}</Text>
  </View>
)
