import React, { ReactElement } from 'react'
import tw from '../../../styles/tailwind'

import { View } from 'react-native'
import { PeachScrollView, Text, Title, TradeSummary } from '../../../components'
import { PrimaryButton } from '../../../components/buttons'
import { ChatButton } from '../../../components/chat/ChatButton'
import i18n from '../../../utils/i18n'
import { getOffer, isSellOffer, offerIdToHex } from '../../../utils/offer'
import { useContractSummarySetup } from './useContractSummarySetup'

type ContractSummaryProps = {
  contract: Contract
}
export default ({ contract }: ContractSummaryProps): ReactElement => {
  const { offer, subtitle, unreadMessages, view, navigation } = useContractSummarySetup(contract)

  const goToOffer = () => {
    if (!offer?.newOfferId) return
    const offr = getOffer(offer.newOfferId)
    if (offr?.id) navigation.replace('offer', { offerId: offr.id })
  }
  return (
    <PeachScrollView contentContainerStyle={tw`pt-5 pb-10 px-6`}>
      <View>
        <Title title={i18n(`${isSellOffer(offer) ? 'sell' : 'buy'}.title`)} subtitle={subtitle} />
        {offer.newOfferId ? (
          <Text style={tw`text-center leading-6 text-grey-2`} onPress={goToOffer}>
            {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
          </Text>
        ) : null}
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
