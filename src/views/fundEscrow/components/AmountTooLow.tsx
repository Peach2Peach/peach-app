import { View } from 'react-native'
import { Text } from '../../../components'
import { BTCAmount } from '../../../components/bitcoin/btcAmount/BTCAmount'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  available: number
  needed: number
}

export const AmountTooLow = ({ available, needed }: Props) => (
  <View style={tw`gap-3`}>
    <Text>{i18n('fundFromPeachWallet.amountTooLow.description.1')}</Text>
    <BTCAmount amount={available} size="medium" />
    <Text>{i18n('fundFromPeachWallet.amountTooLow.description.2')}</Text>
    <BTCAmount amount={needed} size="medium" />
  </View>
)
