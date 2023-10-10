import { View } from 'react-native'
import { Divider, Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { sum } from '../../../utils/math'
import { thousands } from '../../../utils/string'
import { LabelAndAmount } from './LabelAndAmount'

type Props = {
  sellOffer?: SellOffer
}
export const WrongFundingAmountSummary = ({ sellOffer }: Props) => {
  const actualAmount = sellOffer?.funding.amounts.reduce(sum, 0) || 0
  const fundingAmount = sellOffer?.amount || 0
  return (
    <View style={tw`gap-3 grow`}>
      <Divider icon={<Icon id="download" size={20} />} text={i18n('offer.requiredAction.fundingAmountDifferent')} />
      <View style={tw`gap-1`}>
        <LabelAndAmount label={i18n('escrow.funded')} amount={actualAmount} />
        <LabelAndAmount label={i18n('amount')} amount={fundingAmount} />
      </View>
      <Text style={tw`body-s`}>
        {i18n('escrow.wrongFundingAmount.description', thousands(actualAmount), thousands(fundingAmount))}
      </Text>
      <Text style={tw`body-s`}>{i18n('escrow.wrongFundingAmount.continueOrRefund', thousands(actualAmount))}</Text>
    </View>
  )
}
