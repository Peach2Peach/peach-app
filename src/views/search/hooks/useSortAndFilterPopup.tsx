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
    setPopup(<OfferSortAndFilterPopup offer={offer} />)
  }, [offer, setPopup])

  return showPopup
}

type Props = {
  offer: BuyOffer | SellOffer
}

function OfferSortAndFilterPopup ({ offer }: Props) {
  return isBuyOffer(offer) ? <BuyFilterAndSort offer={offer} /> : <SellSorters />
}

export const useGlobalSortAndFilterPopup = (type: 'buy' | 'sell') => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(() => {
    setPopup(<GlobalSortAndFilterPopup type={type} />)
  }, [setPopup, type])

  return showPopup
}

function GlobalSortAndFilterPopup ({ type }: { type: 'buy' | 'sell' }) {
  return type === 'buy' ? <BuyFilterAndSort /> : <SellSorters />
}
