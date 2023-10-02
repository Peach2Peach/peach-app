import { useMemo } from 'react'
import { useBuyOfferExpiredPopup } from '../../../../popups/useBuyOfferExpiredPopup'
import { useOfferOutsideRangePopup } from '../../../../popups/useOfferOutsideRangePopup'
import { useShowFundingAmountDifferentPopup } from '../../../../popups/useShowFundingAmountDifferentPopup'
import { useShowWronglyFundedPopup } from '../../../../popups/useShowWronglyFundedPopup'
import { isSellOffer } from '../../../../utils/offer'
import { peachAPI } from '../../../../utils/peachAPI'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData, notification?: PNNotification) => void>>

export const useOfferPopupEvents = () => {
  const showFundingAmountDifferentPopup = useShowFundingAmountDifferentPopup()
  const wronglyFundedPopup = useShowWronglyFundedPopup()
  const offerOutsideRangePopup = useOfferOutsideRangePopup()
  const buyOfferExpiredPopup = useBuyOfferExpiredPopup()

  const offerPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': async ({ offerId }) => {
        const { result: sellOffer } = offerId
          ? await peachAPI.private.offer.getOfferDetails({ offerId })
          : { result: null }
        if (!sellOffer || !isSellOffer(sellOffer)) return

        showFundingAmountDifferentPopup(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': async ({ offerId }) => {
        const { result: sellOffer } = offerId
          ? await peachAPI.private.offer.getOfferDetails({ offerId })
          : { result: null }

        if (!sellOffer || !isSellOffer(sellOffer)) return
        wronglyFundedPopup(sellOffer)
      },
      // PN-S10
      'offer.outsideRange': ({ offerId }) => {
        if (!offerId) return
        offerOutsideRangePopup(offerId)
      },
      // PN-B14
      'offer.buyOfferExpired': (_, notification) => {
        const [offerId, days] = notification?.bodyLocArgs || []
        buyOfferExpiredPopup(offerId, days)
      },
    }),
    [buyOfferExpiredPopup, showFundingAmountDifferentPopup, offerOutsideRangePopup, wronglyFundedPopup],
  )
  return offerPopupEvents
}
