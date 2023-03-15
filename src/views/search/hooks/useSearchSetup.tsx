import React, { useContext, useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Icon, Text } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isBuyOffer, offerIdToHex } from '../../../utils/offer'
import { parseError } from '../../../utils/system'
import { shouldGoToContract } from '../helpers/shouldGoToContract'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, error, refetch } = useOfferMatches(offerId)

  const [, updateMessage] = useContext(MessageContext)
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')

  const cancelOffer = useCancelOffer(offer)
  const headerIcons = useMemo(() => {
    if (!offer) return undefined
    const icons = [{ iconComponent: <Icon id="xCircle" color={tw`text-error-main`.color} />, onPress: cancelOffer }]
    if (offer.matches.length > 0) {
      icons.push({ iconComponent: <HelpIcon />, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup })
    }
    return icons
  }, [cancelOffer, offer, showAcceptMatchPopup, showMatchPopup])
  useHeaderSetup({
    titleComponent: (
      <Text style={tw`h6`}>
        {i18n('offer')} {offerIdToHex(offerId)}
      </Text>
    ),
    icons: headerIcons,
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
      const errorMessage = parseError(error?.error)
      if (errorMessage === 'CANCELED' || errorMessage === 'CONTRACT_EXISTS') {
        if (shouldGoToContract(error)) navigation.replace('contract', { contractId: error.details.contractId })
        return
      }
      if (errorMessage !== 'UNAUTHORIZED') {
        updateMessage({ msgKey: errorMessage, level: 'ERROR' })
      }
    }
  }, [error, navigation, offerId, updateMessage])

  useRefetchOnNotification(refetch)

  return { offer, hasMatches: !!matches.length }
}
