import { useAccountStore } from './../account/account'
import { getBuyOfferIdFromContract } from './getBuyOfferIdFromContract'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'

export const getSummaryFromContract = (
  contract: Pick<
    Contract,
    | 'seller'
    | 'id'
    | 'creationDate'
    | 'lastModified'
    | 'paymentMade'
    | 'paymentConfirmed'
    | 'tradeStatus'
    | 'amount'
    | 'price'
    | 'currency'
    | 'disputeWinner'
    | 'unreadMessages'
    | 'releaseTxId'
  >,
): ContractSummary => {
  const publicKey = useAccountStore.getState().account.publicKey
  const type = publicKey === contract.seller.id ? 'ask' : 'bid'
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
