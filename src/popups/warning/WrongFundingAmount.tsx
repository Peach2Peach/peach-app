import { View } from 'react-native'
import { Text } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type Props = {
  amount: number
  actualAmount: number
  maxAmount: number
}

export const WrongFundingAmount = ({ amount, actualAmount, maxAmount }: Props) => (
  <View style={tw`gap-4`}>
    <Text>{i18n('warning.fundingAmountDifferent.description.1')}</Text>
    <BTCAmount amount={actualAmount} size="medium" />
    <Text>{i18n('warning.fundingAmountDifferent.description.2')}</Text>
    <BTCAmount amount={amount} size="medium" />
    <Text>{i18n('warning.wrongFundingAmount.description', thousands(maxAmount))}</Text>
  </View>
)
