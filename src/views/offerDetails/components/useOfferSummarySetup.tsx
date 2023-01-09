import messaging from '@react-native-firebase/messaging'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext } from 'react'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import MatchAccepted from '../../../overlays/MatchAccepted'
import i18n from '../../../utils/i18n'
import { sellOrBuy } from '../helpers/sellOrBuy'

export const useOfferSummarySetup = (offer: BuyOffer | SellOffer) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const title
    = offer.tradeStatus !== 'offerCanceled' ? i18n('yourTrades.search.title') : i18n(`${sellOrBuy(offer)}.title`)

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (remoteMessage.data.type === 'offer.matchSeller') {
          matchStoreSetOffer(offer)
          navigation.navigate('search')
        } else if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offer.id) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} />,
            visible: true,
          })
        }
      })

      return unsubscribe
    }, [matchStoreSetOffer, navigation, offer, updateOverlay]),
  )

  return {
    title,
    navigation,
  }
}
