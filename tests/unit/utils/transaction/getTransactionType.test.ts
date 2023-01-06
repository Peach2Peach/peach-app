import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'
import { getTransactionType } from '../../../../src/utils/transaction'

describe('getTransactionType', () => {
  it('should return TRADE for a ConfirmedTransaction with a BuyOffer', () => {
    const tx: Partial<ConfirmedTransaction> = {
      txid: '123',
      sent: 0,
      received: 1337,
    }
    const offer: Partial<BuyOffer> = {
      id: '456',
    }
    const result = getTransactionType(tx as ConfirmedTransaction, offer as BuyOffer)
    expect(result).toEqual('TRADE')
  })

  it('should return DEPOSIT for a ConfirmedTransaction with a received value', () => {
    const tx: Partial<ConfirmedTransaction> = {
      txid: '123',
      sent: 0,
      received: 1618033988,
    }
    const result = getTransactionType(tx as ConfirmedTransaction)
    expect(result).toEqual('DEPOSIT')
  })

  it('should return WITHDRAWAL for a ConfirmedTransaction zero received value', () => {
    const tx: Partial<ConfirmedTransaction> = {
      sent: 615000,
      received: 0,
    }
    const result = getTransactionType(tx as ConfirmedTransaction)
    expect(result).toEqual('WITHDRAWAL')
  })

  it('should return REFUND for a PendingTransaction with a SellOffer that is refunded', () => {
    const tx: Partial<PendingTransaction> = {
      txid: '123',
      sent: 0,
      received: 210000,
    }
    const offer: Partial<SellOffer> = {
      id: '456',
      refunded: true,
    }
    const result = getTransactionType(tx as PendingTransaction, offer as SellOffer)
    expect(result).toEqual('REFUND')
  })
})
