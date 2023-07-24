import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { FIFTEEN_SECONDS } from '../constants'
import { useRefundEscrow } from '../hooks/useRefundEscrow'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../hooks/useShowLoadingPopup'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { cancelOffer } from '../utils/peachAPI'

export const useCancelAndStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow()
  const [closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const showError = useShowErrorBanner()

  const cancelAndStartRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      showLoadingPopup({ title: i18n('refund.loading.title') })

      const [refundPsbtResult, refundPsbtError] = await cancelOffer({ offerId: sellOffer.id, timeout: FIFTEEN_SECONDS })
      if (refundPsbtResult) {
        await refundEscrow(sellOffer, refundPsbtResult.psbt)
      } else {
        showError(refundPsbtError?.error)
        closePopup()
      }
    },
    [closePopup, refundEscrow, showError, showLoadingPopup],
  )

  return cancelAndStartRefundPopup
}
