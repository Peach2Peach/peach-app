import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Button, Title, TradeSummary } from '../../../components'
import tw from '../../../styles/tailwind'
import { getContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { toShortDateFormat } from '../../../utils/string'
import { OfferScreenNavigationProp } from '../Offer'

type ContractSummaryProps = {
  offer: BuyOffer|SellOffer,
  status: OfferStatus['status'],
  navigation: OfferScreenNavigationProp,
}
export const ContractSummary = ({ offer, status, navigation }: ContractSummaryProps): ReactElement => {
  const contract = getContract(offer.contractId as string) as Contract
  const finishedDate = contract.paymentConfirmed
  const subtitle = status === 'tradeCompleted'
    ? i18n('offers.offerCompleted.subtitle', finishedDate ? toShortDateFormat(finishedDate) : '')
    : i18n('offers.tradeCanceled.subtitle')

  return <View>
    <Title title={i18n(`${offer.type === 'ask' ? 'sell' : 'buy'}.title`)} subtitle={subtitle}/>

    <View style={[tw`mt-7`, status === 'tradeCanceled' ? tw`opacity-50` : {}]}>
      <TradeSummary type={offer.type} contract={contract} />
    </View>

    <View style={tw`flex items-center mt-4`}>
      <Button
        title={i18n('back')}
        secondary={true}
        wide={false}
        onPress={() => navigation.goBack()}
      />
    </View>
  </View>
}