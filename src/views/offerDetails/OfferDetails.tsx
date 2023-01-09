import React, { ReactElement } from 'react'

import ContractSummary from './components/ContractSummary'
import OfferLoading from './components/OfferLoading'
import OfferSummary from './components/OfferSummary'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'

const statusToShowOfferSummary = ['offerPublished', 'searchingForPeer', 'offerCanceled']
const statusToShowContractSummary = ['tradeCompleted', 'tradeCanceled']

export default (): ReactElement => {
  const { offer, contract } = useOfferDetailsSetup()

  if (!offer) return <OfferLoading />
  if (statusToShowOfferSummary.includes(offer.tradeStatus)) {
    return <OfferSummary offer={offer} />
  }
  if (contract && statusToShowContractSummary.includes(offer.tradeStatus)) {
    return <ContractSummary contract={contract} />
  }

  return <OfferLoading />
}
