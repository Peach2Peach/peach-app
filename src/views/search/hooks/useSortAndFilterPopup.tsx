import { useCallback } from 'react'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { BuyFilterAndSort, SellSorters } from '../../../popups/filtersAndSorting'
import { usePopupStore } from '../../../store/usePopupStore'
import { isBuyOffer } from '../../../utils/offer/isBuyOffer'

export const useSortAndFilterPopup = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    if (!offer) return
    setPopup(isBuyOffer(offer) ? <BuyFilterAndSort offer={offer} /> : <SellSorters />)
  }, [offer, setPopup])

  return showPopup
}
