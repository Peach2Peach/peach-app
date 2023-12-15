import { View } from 'react-native'
import { BTCAmount } from '../../components/bitcoin/btcAmount/BTCAmount'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string/thousands'

type Props = {
  amount: number
  actualAmount: number
  maxAmount: number
}

export const WrongFundingAmount = ({ amount, actualAmount, maxAmount }: Props) => (
  <View style={tw`gap-4`}>
    <PeachText>{i18n('warning.fundingAmountDifferent.description.1')}</PeachText>
    <BTCAmount amount={actualAmount} size="medium" />
    <PeachText>{i18n('warning.fundingAmountDifferent.description.2')}</PeachText>
    <BTCAmount amount={amount} size="medium" />
    <PeachText>{i18n('warning.wrongFundingAmount.description', thousands(maxAmount))}</PeachText>
  </View>
)
