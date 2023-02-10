import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { SatsFormat, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type WrongFundingAmountProps = {
  amount: number
  actualAmount: number
}

export const WrongFundingAmount = ({ amount, actualAmount }: WrongFundingAmountProps): ReactElement => (
  <View>
    <Text>{i18n('warning.fundingAmountDifferent.description.1')}</Text>
    <SatsFormat style={tw`text-warning-mild`} color={tw`text-black-1`} sats={actualAmount} />
    <Text style={tw`mt-4`}>{i18n('warning.fundingAmountDifferent.description.2')}</Text>
    <SatsFormat style={tw`text-warning-mild`} color={tw`text-black-1`} sats={amount} />
    <Text style={tw`mt-4`}>{i18n('warning.wrongFundingAmount.description', thousands(actualAmount))}</Text>
  </View>
)
