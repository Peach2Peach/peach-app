import React, { useCallback, useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { Icon } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useOfferDetails } from '../../../hooks/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { CancelOffer } from '../../../overlays/CancelOffer'
import tw from '../../../styles/tailwind'
import { updateTradingLimit } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { cancelAndSaveOffer, initiateEscrowRefund, isBuyOffer } from '../../../utils/offer'
import { getTradingLimit } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/system'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const { allMatches: matches, error, refetch } = useOfferMatches()

  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const offerId = useRoute<'search'>().params.offerId
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')

  const showConfirmationPopup = useCallback(() => {
    updateOverlay({
      title: 'offer canceled!',
      visible: true,
      level: 'APP',
    })
  }, [updateOverlay])

  const cancelOffer = useCallback(async () => {
    if (!offer) return
    const [cancelResult, cancelError] = await cancelAndSaveOffer(offer)

    if (!cancelResult || cancelError) {
      showError(cancelError?.error || 'GENERAL_ERROR')
      return
    }

    getTradingLimit({}).then(([tradingLimit]) => {
      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })

    if (!(isBuyOffer(offer) || offer.funding.status === 'NULL' || offer.funding.txIds.length === 0)) {
      const [txId, refundError] = await initiateEscrowRefund(offer, cancelResult)
      if (!txId || refundError) {
        showError(refundError || 'GENERAL_ERROR')
        return
      }
    }

    showConfirmationPopup()
    if (offerId) navigation.replace('offer', { offerId })
  }, [navigation, offer, offerId, showConfirmationPopup, showError])

  const showCancelPopup = () => {
    updateOverlay({
      title: i18n('search.popups.cancelOffer.title'),
      content: <CancelOffer />,
      visible: true,
      level: 'ERROR',
      action1: {
        icon: 'xCircle',
        label: i18n('search.popups.cancelOffer.cancelOffer'),
        callback: cancelOffer,
      },
      action2: {
        icon: 'arrowLeftCircle',
        label: i18n('search.popups.cancelOffer.neverMind'),
        callback: () => updateOverlay({ visible: false }),
      },
    })
  }

  useHeaderSetup({
    title: 'offer ' + offerId,
    hideGoBackButton: true,
    icons: offer
      ? [
        { iconComponent: <Icon id="xCircle" color={tw`text-error-main`.color} />, onPress: showCancelPopup },
        { iconComponent: <HelpIcon />, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup },
      ]
      : [],
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
