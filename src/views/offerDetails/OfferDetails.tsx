import { View } from 'react-native'
import { Header, Icon, PeachScrollView, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'
import { isSellOffer, offerIdToHex } from '../../utils/offer'

import { useEffect } from 'react'
import { SellOfferSummary } from '../../components/offer'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { isCanceledOffer } from './helpers/isCanceledOffer'

export const OfferDetails = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer, error } = useOfferDetails(offerId)

  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) {
      showErrorBanner(error?.error)
    }
  }, [error, offerId, showErrorBanner])

  return isCanceledOffer(offer) && isSellOffer(offer) ? (
    <Screen header={<OfferDetailsHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} contentStyle={tw`gap-10px`}>
        <View style={tw`flex-row items-center self-center gap-2`}>
          <Text style={tw`subtitle-1`}>
            {i18n('yourTrades.offerCanceled.subtitle')}{' '}
            {new Date(offer.creationDate).toLocaleDateString('en-GB')
              .split('/')
              .join(' / ')}
          </Text>
          <Icon id={'xCircle'} size={24} color={tw`text-black-2`.color} />
        </View>

        <SellOfferSummary offer={offer} />
      </PeachScrollView>
    </Screen>
  ) : (
    <LoadingScreen />
  )
}

function OfferDetailsHeader () {
  const { offerId } = useRoute<'offer'>().params
  return <Header title={offerIdToHex(offerId)} />
}
