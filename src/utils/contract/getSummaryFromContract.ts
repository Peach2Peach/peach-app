import { account } from './../account/account'
import { getBuyOfferIdFromContract } from './getBuyOfferIdFromContract'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'

export const getSummaryFromContract = (contract: Contract): ContractSummary => {
  const type = account.publicKey === contract.seller.id ? 'ask' : 'bid'
  return {
    id: contract.id,
    offerId: type === 'ask' ? getSellOfferIdFromContract(contract) : getBuyOfferIdFromContract(contract),
    type,
    creationDate: contract.creationDate,
    lastModified: contract.lastModified,
    paymentMade: contract.paymentMade || undefined,
    paymentConfirmed: contract.paymentConfirmed || undefined,
    tradeStatus: contract.tradeStatus,
    amount: contract.amount,
    price: contract.price,
    currency: contract.currency,
    disputeWinner: contract.disputeWinner,
    unreadMessages: contract.unreadMessages,
    releaseTxId: contract.releaseTxId,
  }
}
