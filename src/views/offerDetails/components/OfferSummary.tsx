import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, PeachScrollView, SellOfferSummary, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type OfferSummaryProps = {
  offer: SellOffer & { tradeStatus: 'offerCanceled' }
}

export default ({ offer }: OfferSummaryProps): ReactElement => (
  <PeachScrollView contentContainerStyle={tw`px-6 pt-5 pb-10`}>
    <View style={tw`flex-row items-center self-center`}>
      <Text style={tw`subtitle-1`}>
        {i18n('yourTrades.offerCanceled.subtitle')}{' '}
        {new Date(offer.creationDate).toLocaleDateString('en-GB')
          .split('/')
          .join(' / ')}
      </Text>
      <Icon id={'xCircle'} style={tw`w-6 h-6 ml-2`} color={tw`text-black-2`.color} />
    </View>

    <SellOfferSummary offer={offer} style={tw`mt-7`} />
  </PeachScrollView>
)
