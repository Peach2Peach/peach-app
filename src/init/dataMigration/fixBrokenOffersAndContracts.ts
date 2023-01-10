import { account } from '../../utils/account'
import { contractStorage, offerStorage } from '../../utils/account/accountStorage'
import { info } from '../../utils/log'

/**
 * As the app at version 0.1.10 is loading offers and contracts from the peach server on every app start
 * it is also storing them blindly into the account storage
 * Because the data structure in the /contracts and /offers changed, the app stores the wrong data
 * To fix that with the new release, we need this method to mend what is broken
 */
export const fixBrokenOffersAndContracts = () => {
  // delete and filter out offers that don't have required data
  info('fixBrokenOffersAndContracts - offers')
  const brokenOffers = account.offers
    .filter((offer) => !offer.meansOfPayment)
    .map((offer) => {
      if (!offer.id) return offer
      offerStorage.removeItem(offer.id)
      return offer
    })
  account.offers = account.offers.filter((offer) => offer.meansOfPayment)
  info('fixBrokenOffersAndContracts - offers - removed', brokenOffers.length)

  // delete and filter out contracts that don't have required data
  info('fixBrokenOffersAndContracts - contracts')
  const brokenContracts = account.contracts
    .filter((contract) => !contract.buyer)
    .map((contract) => {
      contractStorage.removeItem(contract.id)
      return contract
    })
  account.contracts = account.contracts.filter((offer) => offer.buyer)
  info('fixBrokenOffersAndContracts - contracts - removed', brokenContracts.length)
}
