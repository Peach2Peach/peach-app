import { tradeSummaryStore } from '../store/tradeSummaryStore'
import { error, info } from '../utils/log'
import { getContractSummaries, getOfferSummaries } from '../utils/peachAPI'

export const getTrades = async (): Promise<void> => {
  const [offers, getOffersError] = await getOfferSummaries({})
  if (offers) {
    info(`Got ${offers.length} offers`)
    tradeSummaryStore.getState().setOffers(offers)
  } else if (getOffersError) {
    error('Error', getOffersError)
  }

  const [contracts, err] = await getContractSummaries({})
  if (contracts) {
    tradeSummaryStore.getState().setContracts(contracts)
  } else if (err) {
    error('Error', err)
  }
}
