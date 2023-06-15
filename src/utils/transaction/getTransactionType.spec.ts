import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { getTransactionType } from '.'

describe('getTransactionType', () => {
  it('should return TRADE for a transaction with a BuyOffer', () => {
    const tx: Partial<TransactionDetails> = {
      txid: '123',
      sent: 0,
      received: 1337,
    }
    const offer: Partial<OfferSummary> = {
      id: '456',
      type: 'bid',
    }
    const result = getTransactionType(tx as TransactionDetails, offer as OfferSummary)
    expect(result).toEqual('TRADE')
  })

  it('should return DEPOSIT for a transaction with a received value', () => {
    const tx: Partial<TransactionDetails> = {
      txid: '123',
      sent: 0,
      received: 1618033988,
    }
    const result = getTransactionType(tx as TransactionDetails)
    expect(result).toEqual('DEPOSIT')
  })

  it('should return WITHDRAWAL for a transction and zero received value', () => {
    const tx: Partial<TransactionDetails> = {
      sent: 615000,
      received: 0,
    }
    const result = getTransactionType(tx as TransactionDetails)
    expect(result).toEqual('WITHDRAWAL')
  })

  it('should return REFUND for a transaction with a SellOffer that is refunded', () => {
    const tx: Partial<TransactionDetails> = {
      txid: '123',
      sent: 0,
      received: 210000,
    }
    const offer: Partial<OfferSummary> = {
      id: '456',
      type: 'ask',
    }
    const result = getTransactionType(tx as TransactionDetails, offer as OfferSummary)
    expect(result).toEqual('REFUND')
  })
})
