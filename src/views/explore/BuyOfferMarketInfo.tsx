import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { isSellOffer } from '../../utils/offer/isSellOffer'
import { MarketInfo } from '../offerPreferences/components/MarketInfo'

export function BuyOfferMarketInfo ({ offerId }: { offerId: string }) {
  const { offer } = useOfferDetails(offerId)

  if (offer && isSellOffer(offer)) {
    throw new Error('Offer should be a buy offer')
  }

  return (
    <MarketInfo
      type={'sellOffers'}
      meansOfPayment={offer?.meansOfPayment}
      maxPremium={offer?.maxPremium || undefined}
      minReputation={offer?.minReputation || undefined}
      buyAmountRange={offer?.amount}
    />
  )
}
