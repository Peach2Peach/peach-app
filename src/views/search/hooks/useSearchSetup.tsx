import { useContext, useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isBuyOffer, offerIdToHex } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
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
  const getHeaderIcons = () => {
    if (!offer) return undefined
    const icons = [{ ...headerIcons.cancel, onPress: cancelOffer }]
    if (offer.matches.length > 0) {
      icons.push({ ...headerIcons.help, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup })
    }
    return icons
  }
  useHeaderSetup({
    title: offerIdToHex(offerId),
    icons: getHeaderIcons(),
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
