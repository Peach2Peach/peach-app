import { ReactElement } from 'react'
import { View } from 'react-native'
import { SatsFormat, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type Props = {
  amount: number
  actualAmount: number
  maxAmount: number
}

export const WrongFundingAmount = ({ amount, actualAmount, maxAmount }: Props): ReactElement => (
  <View>
    <Text>{i18n('warning.fundingAmountDifferent.description.1')}</Text>
    <SatsFormat style={tw`text-warning-mild`} color={tw`text-black-1`} sats={actualAmount} />
    <Text style={tw`mt-4`}>{i18n('warning.fundingAmountDifferent.description.2')}</Text>
    <SatsFormat style={tw`text-warning-mild`} color={tw`text-black-1`} sats={amount} />
    <Text style={tw`mt-4`}>{i18n('warning.wrongFundingAmount.description', thousands(maxAmount))}</Text>
  </View>
)
