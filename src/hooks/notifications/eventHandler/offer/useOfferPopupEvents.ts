import { useMemo } from 'react'
import { useConfirmEscrowOverlay } from '../../../../overlays/useConfirmEscrowOverlay'
import { useWronglyFundedOverlay } from '../../../../overlays/useWronglyFundedOverlay'
import { getOffer } from '../../../../utils/offer'
import { useBuyOfferExpiredOverlay } from '../../../../overlays/useBuyOfferExpiredOverlay'
import { useOfferOutsideRangeOverlay } from '../../../../overlays/useOfferOutsideRangeOverlay'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData, notification?: PNNotification) => void>>

export const useOfferPopupEvents = () => {
  const confirmEscrowOverlay = useConfirmEscrowOverlay()
  const wronglyFundedOverlay = useWronglyFundedOverlay()
  const offerOutsideRangeOverlay = useOfferOutsideRangeOverlay()
  const buyOfferExpiredOverlay = useBuyOfferExpiredOverlay()

  const offerPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': ({ offerId }) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        confirmEscrowOverlay(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': ({ offerId }) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        wronglyFundedOverlay(sellOffer)
      },
      // PN-S10
      'offer.outsideRange': ({ offerId }) => {
        if (!offerId) return
        offerOutsideRangeOverlay(offerId)
      },
      // PN-B14
      'offer.buyOfferExpired': (_, notification) => {
        const [offerId, days] = notification?.bodyLocArgs || []
        buyOfferExpiredOverlay(offerId, days)
      },
    }),
    [buyOfferExpiredOverlay, confirmEscrowOverlay, offerOutsideRangeOverlay, wronglyFundedOverlay],
  )
  return offerPopupEvents
}
