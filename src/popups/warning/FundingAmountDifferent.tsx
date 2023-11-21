import { View } from 'react-native'
import { Text } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type Props = {
  amount: number
  actualAmount: number
}

export const FundingAmountDifferent = ({ amount, actualAmount }: Props) => (
  <View style={tw`gap-4`}>
    <Text>{i18n('warning.fundingAmountDifferent.description.1')}</Text>
    <BTCAmount amount={actualAmount} size="medium" />
    <Text>{i18n('warning.fundingAmountDifferent.description.2')}</Text>
    <BTCAmount amount={amount} size="medium" />
    <Text>{i18n('warning.fundingAmountDifferent.description.3', thousands(actualAmount))}</Text>
  </View>
)
