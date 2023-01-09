import React, { ReactElement } from 'react'
import tw from '../../../styles/tailwind'

import { View } from 'react-native'
import { PeachScrollView, Text, Title, TradeSummary } from '../../../components'
import { PrimaryButton } from '../../../components/buttons'
import { ChatButton } from '../../../components/chat/ChatButton'
import i18n from '../../../utils/i18n'
import { getOffer, isSellOffer, offerIdToHex } from '../../../utils/offer'
import { useContractSummarySetup } from './useContractSummarySetup'
import { isTradeComplete } from '../../../utils/contract/status'
import { toShortDateFormat } from '../../../utils/date'

type ContractSummaryProps = {
  contract: Contract
}
export default ({ contract }: ContractSummaryProps): ReactElement => {
  const { offer, unreadMessages, view, navigation } = useContractSummarySetup(contract)

  const newOfferId = offer?.newOfferId
  const finishedDate = contract?.paymentConfirmed
  const title = offer ? i18n(`${isSellOffer(offer) ? 'sell' : 'buy'}.title`) : ''
  const subtitle
    = contract && offer
      ? isTradeComplete(contract)
        ? i18n(
          'yourTrades.offerCompleted.subtitle',
          offerIdToHex(offer.id as Offer['id']),
          finishedDate ? toShortDateFormat(finishedDate) : '',
        )
        : i18n('yourTrades.tradeCanceled.subtitle')
      : ''

  const goToOffer = () => {
    if (!newOfferId) return
    const offr = getOffer(newOfferId)
    if (offr?.id) navigation.replace('offer', { offerId: offr.id })
  }
  return (
    <PeachScrollView contentContainerStyle={tw`pt-5 pb-10 px-6`}>
      <View>
        <Title title={title} subtitle={subtitle} />
        {!!newOfferId && (
          <Text style={tw`text-center leading-6 text-grey-2`} onPress={goToOffer}>
            {i18n('yourTrades.offer.replaced', offerIdToHex(newOfferId))}
          </Text>
        )}
        <View style={tw`mt-7`}>
          <View>
            <ChatButton contract={{ ...contract, unreadMessages }} style={tw`absolute top-4 right-0 -mr-4 z-10`} />
            <TradeSummary {...{ contract, view }} />
          </View>
          <PrimaryButton style={tw`self-center mt-4`} onPress={() => navigation.navigate('yourTrades')} narrow>
            {i18n('back')}
          </PrimaryButton>
        </View>
      </View>
    </PeachScrollView>
  )
}
