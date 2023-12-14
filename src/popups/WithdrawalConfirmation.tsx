import { View } from 'react-native'
import { BTCAmount, ShortBitcoinAddress } from '../components/bitcoin'
import PeachText from '../components/text/Text'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { thousands } from '../utils/string/thousands'

type Props = {
  amount: number
  address: string
  fee: number
  feeRate: number
}

export const WithdrawalConfirmation = ({ amount, address, fee, feeRate }: Props) => (
  <View style={tw`gap-3`}>
    <PeachText>{i18n('wallet.sendBitcoin.youreSending')}</PeachText>
    <BTCAmount amount={amount} size="medium" />
    <PeachText>
      {i18n('transaction.details.to')} <ShortBitcoinAddress address={address} />
    </PeachText>
    <PeachText>{i18n('transaction.details.networkFee', thousands(fee), thousands(feeRate))}</PeachText>
  </View>
)
