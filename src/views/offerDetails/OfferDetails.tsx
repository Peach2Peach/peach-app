import { isSellOffer } from '../../utils/offer'

import { LoadingScreen } from '../loading/LoadingScreen'
import { OfferSummary } from './components/OfferSummary'
import { isCanceledOffer } from './helpers/isCanceledOffer'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'

export const OfferDetails = () => {
  const offer = useOfferDetailsSetup()

  return isCanceledOffer(offer) && isSellOffer(offer) ? <OfferSummary offer={offer} /> : <LoadingScreen />
}
