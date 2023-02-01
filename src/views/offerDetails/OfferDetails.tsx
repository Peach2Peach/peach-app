import React, { ReactElement } from 'react'
import { isSellOffer } from '../../utils/offer'

import OfferLoading from '../loading/LoadingScreen'
import OfferSummary from './components/OfferSummary'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'

export default (): ReactElement => {
  const { offer } = useOfferDetailsSetup()

  return offer?.tradeStatus === 'offerCanceled' && isSellOffer(offer) ? <OfferSummary offer={offer} /> : <OfferLoading />
}
