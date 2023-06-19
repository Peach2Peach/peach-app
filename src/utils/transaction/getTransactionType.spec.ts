import { getTransactionType } from '.'

describe('getTransactionType', () => {
  it('should return TRADE for a transaction with a BuyOffer', () => {
    const tx = { received: 1337 }
    const offer = { type: 'bid' } as const
    const result = getTransactionType(tx, offer)
    expect(result).toEqual('TRADE')
  })

  it('should return DEPOSIT for a transaction with a received value', () => {
    const tx = { received: 1618033988 }
    const result = getTransactionType(tx)
    expect(result).toEqual('DEPOSIT')
  })

  it('should return WITHDRAWAL for a transction and zero received value', () => {
    const tx = { received: 0 }
    const result = getTransactionType(tx)
    expect(result).toEqual('WITHDRAWAL')
  })

  it('should return REFUND for a transaction with a SellOffer that is refunded', () => {
    const tx = { received: 210000 }
    const offer = { type: 'ask' } as const
    const result = getTransactionType(tx, offer)
    expect(result).toEqual('REFUND')
  })
})
