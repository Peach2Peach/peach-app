import { useNavigation } from '../../../hooks'
import { useCallback } from 'react'
import { reviveSellOffer } from '../../../utils/peachAPI'
import { getSellOfferFromContract, saveContract } from '../../../utils/contract'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useOverlayContext } from '../../../contexts/overlay'
import i18n from '../../../utils/i18n'
import { OfferRepublished } from '../../../overlays/tradeCancelation'

export const useRepublishOffer = () => {
  const [, updateOverlay] = useOverlayContext()
  const showErrorBanner = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const confirmOverlay = useCallback(
    (contract: Contract) => {
      closeOverlay()
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closeOverlay],
  )

  const republishOffer = useCallback(
    async (contract: Contract) => {
      const sellOffer = getSellOfferFromContract(contract)

      const [reviveSellOfferResult, err] = await reviveSellOffer({ offerId: sellOffer.id })

      const closeAction = () => {
        navigation.replace('contract', { contractId: contract.id })
        confirmOverlay(contract)
      }
      const goToOfferAction = () => {
        if (!reviveSellOfferResult) return
        navigation.replace('search', { offerId: reviveSellOfferResult.newOfferId })
        confirmOverlay(contract)
      }
      if (!reviveSellOfferResult || err) {
        showErrorBanner(err?.error)
        closeOverlay()
        return { closeAction, goToOfferAction }
      }

      updateOverlay({
        title: i18n('contract.cancel.offerRepublished.title'),
        content: <OfferRepublished />,
        visible: true,
        level: 'APP',
        requireUserAction: true,
        action1: {
          label: i18n('goToOffer'),
          icon: 'arrowRightCircle',
          callback: goToOfferAction,
        },
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: closeAction,
        },
      })

      return { closeAction, goToOfferAction }
    },
    [closeOverlay, confirmOverlay, navigation, showErrorBanner, updateOverlay],
  )

  return republishOffer
}
