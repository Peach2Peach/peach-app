import React, { ReactElement } from 'react'
import tw from '../../styles/tailwind'
import { isSellOffer } from '../../utils/offer'

import OfferLoading from '../loading/LoadingScreen'
import OfferSummary from './components/OfferSummary'
import { isCanceledOffer } from './helpers/isCanceledOffer'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'

export default (): ReactElement => {
  const offer = useOfferDetailsSetup()

  return isCanceledOffer(offer) && isSellOffer(offer) ? (
    <OfferSummary offer={offer} style={tw`mx-8`} />
  ) : (
    <OfferLoading />
  )
}
