import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { FIFTEEN_SECONDS } from '../constants'
import { useRefundEscrow } from '../hooks/useRefundEscrow'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../hooks/useShowLoadingPopup'
import { usePopupStore } from '../store/usePopupStore'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import i18n from '../utils/i18n'
import { peachAPI } from '../utils/peachAPI'

export const useCancelAndStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow()
  const [closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const showError = useShowErrorBanner()

  const cancelAndStartRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      showLoadingPopup({ title: i18n('refund.loading.title') })

      const { result: refundPsbtResult, error: refundPsbtError } = await peachAPI.private.offer.cancelOffer({
        offerId: sellOffer.id,
        signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
      })
      if (refundPsbtResult && 'psbt' in refundPsbtResult) {
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
