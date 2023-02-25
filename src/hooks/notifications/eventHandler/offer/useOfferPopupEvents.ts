import { useMemo } from 'react'
import { useConfirmEscrowOverlay } from '../../../../overlays/useConfirmEscrowOverlay'
import { useWronglyFundedOverlay } from '../../../../overlays/useWronglyFundedOverlay'
import { getOffer } from '../../../../utils/offer'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

export const useOfferPopupEvents = () => {
  const confirmEscrowOverlay = useConfirmEscrowOverlay()
  const wronglyFundedOverlay = useWronglyFundedOverlay()

  const offerPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        confirmEscrowOverlay(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        wronglyFundedOverlay(sellOffer)
      },
    }),
    [confirmEscrowOverlay, wronglyFundedOverlay],
  )
  return offerPopupEvents
}
