import React, { useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { Icon } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import { isBuyOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/system'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { allMatches: matches, error, refetch } = useOfferMatches()

  const [, updateMessage] = useContext(MessageContext)
  const offerId = useRoute<'search'>().params.offerId
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')

  const cancelOffer = useCancelOffer(offer)

  useHeaderSetup({
    title: 'offer ' + offerId,
    hideGoBackButton: true,
    icons: offer
      ? [
        { iconComponent: <Icon id="xCircle" color={tw`text-error-main`.color} />, onPress: cancelOffer },
        { iconComponent: <HelpIcon />, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup },
      ]
      : undefined,
  })

  useEffect(() => {
    if (offer?.meansOfPayment) addMatchSelectors(matches, offer.meansOfPayment)
  }, [addMatchSelectors, matches, offer?.meansOfPayment])

  useEffect(
    () => () => {
      resetStore()
    },
    [resetStore],
  )

  useEffect(() => {
    if (error) {
      const errorMessage = parseError(error)
      if (errorMessage === 'CANCELED' || errorMessage === 'CONTRACT_EXISTS') {
        if (offerId) navigation.replace('offer', { offerId })
        return
      }
      if (errorMessage !== 'UNAUTHORIZED') {
        updateMessage({ msgKey: errorMessage, level: 'ERROR' })
      }
    }
  }, [error, navigation, offerId, updateMessage])

  useRefetchOnNotification(refetch, offerId)

  return { offer, hasMatches: !!matches.length }
}
