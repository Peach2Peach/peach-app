import React, { useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { Icon } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { useMatchStore } from '../../../components/matches/store'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { CancelOffer } from '../../../overlays/CancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/system'
import { useOfferMatches } from './useOfferMatches'
import useRefetchOnNotification from './useRefetchOnNotification'

export const useSearchSetup = () => {
  const navigation = useNavigation()

  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [offer, addMatchSelectors] = useMatchStore((state) => [state.offer, state.addMatchSelectors], shallow)
  const showHelpPopup = useShowHelp('matchmatchmatch')

  const showCancelPopup = () => {
    updateOverlay({
      title: i18n('search.popups.cancelOffer.title'),
      content: <CancelOffer />,
      visible: true,
      level: 'ERROR',
      action1: {
        icon: 'xCircle',
        label: i18n('search.popups.cancelOffer.cancelOffer'),
        callback: () => updateOverlay({ visible: false }),
      },
      action2: {
        icon: 'arrowLeftCircle',
        label: i18n('search.popups.cancelOffer.neverMind'),
        callback: () => updateOverlay({ visible: false }),
      },
    })
  }

  useHeaderSetup({
    title: 'offer ' + offer.id,
    hideGoBackButton: true,
    icons: [
      { iconComponent: <Icon id="xCircle" color={tw`text-error-main`.color} />, onPress: showCancelPopup },
      { iconComponent: <HelpIcon />, onPress: showHelpPopup },
    ],
  })

  const { allMatches: matches, error, refetch } = useOfferMatches()
  const resetStore = useMatchStore((state) => state.resetStore)

  useEffect(() => {
    addMatchSelectors(matches, offer.meansOfPayment)
  }, [offer.meansOfPayment, addMatchSelectors, matches])

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
        if (offer.id) navigation.replace('offer', { offerId: offer.id })
        return
      }
      if (errorMessage !== 'UNAUTHORIZED') {
        updateMessage({ msgKey: errorMessage, level: 'ERROR' })
      }
    }
  }, [error, navigation, offer, updateMessage])

  useRefetchOnNotification(refetch, offer.id)

  return { offer, hasMatches: !!matches.length }
}
