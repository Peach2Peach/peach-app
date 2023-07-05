import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useRefundEscrow } from '../hooks/useRefundEscrow'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../hooks/useShowLoadingPopup'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { getRefundPSBT } from '../utils/peachAPI'

export const useStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow()
  const [closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showLoadingPopup = useShowLoadingPopup()
  const showError = useShowErrorBanner()

  const startRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      showLoadingPopup({ title: i18n('refund.loading.title') })

      const [refundPsbtResult, refundPsbtError] = await getRefundPSBT({ offerId: sellOffer.id, timeout: 15 * 1000 })
      if (refundPsbtResult) {
        await refundEscrow(sellOffer, refundPsbtResult.psbt)
      } else {
        showError(refundPsbtError?.error)
        closePopup()
      }
    },
    [closePopup, refundEscrow, showError, showLoadingPopup],
  )

  return startRefundPopup
}
