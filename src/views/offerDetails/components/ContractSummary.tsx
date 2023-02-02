import React, { ReactElement } from 'react'
import tw from '../../../styles/tailwind'

import { View } from 'react-native'
import { PeachScrollView, Text, Title, TradeSummary } from '../../../components'
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
    <PeachScrollView contentContainerStyle={tw`px-6 pt-5 pb-10`}>
      <View>
        <Title title={title} subtitle={subtitle} />
        {!!newOfferId && (
          <Text style={tw`leading-6 text-center text-grey-2`} onPress={goToOffer}>
            {i18n('yourTrades.offer.replaced', offerIdToHex(newOfferId))}
          </Text>
        )}
        <View style={tw`mt-7`}>
          <View>
            <ChatButton contract={{ ...contract, unreadMessages }} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
            <TradeSummary {...{ contract, view }} />
          </View>
        </View>
      </View>
    </PeachScrollView>
  )
}
