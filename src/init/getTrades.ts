import { tradeSummaryStore } from '../store/tradeSummaryStore'
import { error, info } from '../utils/log'
import { getContracts, getOffers } from '../utils/peachAPI'

export const getTrades = async (): Promise<void> => {
  const [offers, getOffersError] = await getOffers({})
  if (offers) {
    info(`Got ${offers.length} offers`)
    tradeSummaryStore.getState().setOffers(offers)
  } else if (getOffersError) {
    error('Error', getOffersError)
  }

  const [contracts, err] = await getContracts({})
  if (contracts) {
    tradeSummaryStore.getState().setContracts(contracts)
  } else if (err) {
    error('Error', err)
  }
}
