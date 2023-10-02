import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { error, info } from '../utils/log'
import { peachAPI } from '../utils/peachAPI'

export const getTrades = async () => {
  const { result: offers, error: getOffersError } = await peachAPI.private.offer.getOfferSummaries()
  if (offers) {
    info(`Got ${offers.length} offers`)
    useTradeSummaryStore.getState().setOffers(offers)
  } else if (getOffersError) {
    error('Error', getOffersError)
  }

  const { result: contracts, error: err } = await peachAPI.private.contract.getContractSummaries()
  if (contracts) {
    useTradeSummaryStore.getState().setContracts(contracts)
  } else if (err) {
    error('Error', err)
  }
}
