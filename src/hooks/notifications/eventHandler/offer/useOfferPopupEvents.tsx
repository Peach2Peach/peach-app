import { useMemo } from 'react'
import { useSetPopup } from '../../../../components/popup/Popup'
import { BuyOfferExpiredPopup } from '../../../../popups/BuyOfferExpiredPopup'
import { FundingAmountDifferentPopup } from '../../../../popups/FundingAmountDifferentPopup'
import { OfferOutsideRangePopup } from '../../../../popups/OfferOutsideRangePopup'
import { WronglyFundedPopup } from '../../../../popups/WronglyFundedPopup'
import { isSellOffer } from '../../../../utils/offer/isSellOffer'
import { peachAPI } from '../../../../utils/peachAPI'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData, notification?: PNNotification) => void>>

export const useOfferPopupEvents = () => {
  const setPopup = useSetPopup()

  const offerPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': async ({ offerId }) => {
        const { result: sellOffer } = offerId
          ? await peachAPI.private.offer.getOfferDetails({ offerId })
          : { result: null }
        if (!sellOffer || !isSellOffer(sellOffer)) return

        setPopup(<FundingAmountDifferentPopup sellOffer={sellOffer} />)
      },
      // PN-S08
      'offer.wrongFundingAmount': async ({ offerId }) => {
        const { result: sellOffer } = offerId
          ? await peachAPI.private.offer.getOfferDetails({ offerId })
          : { result: null }

        if (!sellOffer || !isSellOffer(sellOffer)) return
        setPopup(<WronglyFundedPopup sellOffer={sellOffer} />)
      },
      // PN-S10
      'offer.outsideRange': ({ offerId }) => {
        if (!offerId) return
        setPopup(<OfferOutsideRangePopup offerId={offerId} />)
      },
      // PN-B14
      'offer.buyOfferExpired': (_, notification) => {
        const [offerId, days] = notification?.bodyLocArgs || []
        setPopup(<BuyOfferExpiredPopup offerId={offerId} days={days} />)
      },
    }),
    [setPopup],
  )
  return offerPopupEvents
}
