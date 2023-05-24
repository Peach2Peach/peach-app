import { useMemo } from 'react'
import { useShowFundingAmountDifferentPopup } from '../../../../overlays/useShowFundingAmountDifferentPopup'
import { useShowWronglyFundedPopup } from '../../../../overlays/useShowWronglyFundedPopup'
import { getOffer, isSellOffer } from '../../../../utils/offer'
import { useBuyOfferExpiredOverlay } from '../../../../overlays/useBuyOfferExpiredOverlay'
import { useOfferOutsideRangeOverlay } from '../../../../overlays/useOfferOutsideRangeOverlay'
import { getOfferDetails } from '../../../../utils/peachAPI'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData, notification?: PNNotification) => void>>

export const useOfferPopupEvents = () => {
  const showFundingAmountDifferentPopup = useShowFundingAmountDifferentPopup()
  const wronglyFundedOverlay = useShowWronglyFundedPopup()
  const offerOutsideRangeOverlay = useOfferOutsideRangeOverlay()
  const buyOfferExpiredOverlay = useBuyOfferExpiredOverlay()

  const offerPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': async ({ offerId }) => {
        const [sellOffer] = offerId ? await getOfferDetails({ offerId }) : [null]
        if (!sellOffer || !isSellOffer(sellOffer)) return

        showFundingAmountDifferentPopup(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': async ({ offerId }) => {
        const [sellOffer] = offerId ? await getOfferDetails({ offerId }) : [null]

        if (!sellOffer || !isSellOffer(sellOffer)) return
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
    [buyOfferExpiredOverlay, showFundingAmountDifferentPopup, offerOutsideRangeOverlay, wronglyFundedOverlay],
  )
  return offerPopupEvents
}
