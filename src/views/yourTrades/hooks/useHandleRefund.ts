import { useCallback } from 'react'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { queryClient } from '../../../queryClient'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'

export const useHandleRefund = () => {
  const showStartRefundPopup = useStartRefundPopup()

  const handleRefund = useCallback(
    async (tradeStatus: TradeStatus, offerId: string) => {
      if (tradeStatus !== 'refundTxSignatureRequired') return false
      const [sellOffer] = await getOfferDetails({ offerId })
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(['offer', sellOffer.id], sellOffer)
        showStartRefundPopup(sellOffer)
        return true
      }
      return false
    },
    [showStartRefundPopup],
  )

  return handleRefund
}
