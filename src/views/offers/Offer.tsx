import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { PeachScrollView } from '../../components'
import { MessageContext } from '../../contexts/message'
import { info, error } from '../../utils/log'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import i18n from '../../utils/i18n'
import { getOffer, getOfferStatus, saveOffer } from '../../utils/offer'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { OfferSummary } from './components/OfferSummary'
import { ContractSummary } from './components/ContractSummary'

export type OfferScreenNavigationProp = StackNavigationProp<RootStackParamList, 'offer'>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer|SellOffer,
  } }>,
  navigation: OfferScreenNavigationProp,
}

export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const offerId = route.params.offer.id as string
  const offer = getOffer(offerId) as BuyOffer|SellOffer
  const offerStatus = getOfferStatus(offer)

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    saveOffer(offerData)
  }

  useFocusEffect(useCallback(getOfferDetailsEffect({
    offerId,
    interval: 30 * 1000,
    onSuccess: result => {
      if (!offer) return

      saveAndUpdate({
        ...offer,
        ...result,
      })

      if (result.matches.length && !result.contractId) {
        info('Offer.tsx - getOfferDetailsEffect', `navigate to search ${offer.id}`)
        navigation.navigate('search', { offer })
      }
      if (result.contractId && !/tradeCompleted|tradeCanceled/u.test(offerStatus.status)) {
        info('Offer.tsx - getOfferDetailsEffect', `navigate to contract ${result.contractId}`)
        navigation.navigate('contract', { contractId: result.contractId })
      }
    },
    onError: err => {
      error('Could not fetch offer information for offer', offerId)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offer]))

  return <PeachScrollView contentContainerStyle={tw`pt-5 pb-10 px-6`}>
    {/offerPublished|searchingForPeer|offerCanceled/u.test(offerStatus.status)
      ? <OfferSummary offer={offer} status={offerStatus.status} navigation={navigation} />
      : null
    }
    {/tradeCompleted|tradeCanceled/u.test(offerStatus.status)
      ? <ContractSummary offer={offer} status={offerStatus.status} navigation={navigation} />
      : null
    }
  </PeachScrollView>
}