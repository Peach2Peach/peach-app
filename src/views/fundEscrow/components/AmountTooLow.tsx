import { View } from 'react-native'
import { BTCAmount } from '../../../components/bitcoin/btcAmount/BTCAmount'
import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  available: number
  needed: number
}

export const AmountTooLow = ({ available, needed }: Props) => (
  <View style={tw`gap-3`}>
    <PeachText>{i18n('fundFromPeachWallet.amountTooLow.description.1')}</PeachText>
    <BTCAmount amount={available} size="medium" />
    <PeachText>{i18n('fundFromPeachWallet.amountTooLow.description.2')}</PeachText>
    <BTCAmount amount={needed} size="medium" />
  </View>
)
