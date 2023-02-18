import { setAccount } from '../../../../src/utils/account'
import { getSummaryFromContract } from '../../../../src/utils/contract/getSummaryFromContract'
import { account1 } from '../../data/accountData'
import { contract } from '../../data/contractData'

describe('getSummaryFromContract', () => {
  const expectedSummary = {
    id: contract.id,
    creationDate: contract.creationDate,
    lastModified: contract.lastModified,
    paymentMade: undefined,
    paymentConfirmed: undefined,
    tradeStatus: contract.tradeStatus,
    amount: contract.amount,
    price: contract.price,
    currency: contract.currency,
    disputeWinner: contract.disputeWinner,
    unreadMessages: contract.unreadMessages,
    releaseTxId: contract.releaseTxId,
  }

  it('should return a ContractSummary object with the expected properties when account is the seller', () => {
    setAccount({ ...account1, publicKey: contract.seller.id })

    expect(getSummaryFromContract(contract)).toEqual({
      ...expectedSummary,
      offerId: '14',
      type: 'ask',
    })
  })

  it('should return a ContractSummary object with the expected properties when account is the buyer', () => {
    setAccount({ ...account1, publicKey: contract.buyer.id })

    expect(getSummaryFromContract(contract)).toEqual({
      ...expectedSummary,
      offerId: '15',
      type: 'bid',
    })
  })
})
