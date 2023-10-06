import { getTradeInfoFields } from './getTradeInfoFields'

// eslint-disable-next-line max-lines-per-function
describe('getTradeInfoFields', () => {
  it('should return the correct fields for an active sell trade', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'sepa',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual([
      ['youWillGet'],
      ['paidToMethod', 'reference'],
      ['buyer', 'tradeId'],
    ])
  })

  it('should return the correct fields for a past sell trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual([
      ['soldFor', 'bitcoinPrice'],
      ['paidToMethod', 'reference', 'paymentConfirmed'],
      ['buyer', 'ratingSeller'],
    ])
  })
  it('should return the correct fields for a past buy trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youPaid', 'bitcoinPrice'],
      ['via', 'reference', 'paymentConfirmed'],
      ['seller', 'ratingBuyer'],
      ['tradeBreakdown'],
    ])
  })
  it('should return the correct fields for an active buy trade - template2', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'advcash',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'wallet', 'email'],
      ['seller', 'tradeId'],
    ])
  })

  it('should return the correct fields for an active buy trade - template3', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'vipps',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'phone', 'reference'],
      ['seller', 'tradeId'],
    ])
  })
  it('should return the correct fields for an active buy trade - template4', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'skrill',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'email', 'reference'],
      ['seller', 'tradeId'],
    ])
  })
  it('should return the correct fields for an active buy trade - template5', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'fasterPayments',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'ukBankAccount', 'ukSortCode', 'reference'],
      ['seller', 'tradeId'],
    ])
  })

  it('should return the correct fields for an active buy trade - template6', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'paypal',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'userName', 'email', 'phone', 'reference'],
      ['seller', 'tradeId'],
    ])
  })
  it('should return the correct fields for an active buy trade - template7', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'straksbetaling',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'accountNumber', 'reference'],
      ['seller', 'tradeId'],
    ])
  })
  it('should return the correct fields for an active buy trade - template8', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'paysera',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'phone', 'reference'],
      ['seller', 'tradeId'],
    ])
  })

  it('should return the correct fields for an active buy trade - template9', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'nationalTransferBG',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['via', 'beneficiary', 'iban', 'accountNumber', 'bic', 'reference'],
      ['seller', 'tradeId'],
    ])
  })
})

describe('getTradeInfoFields - cash trades', () => {
  it('should return the correct fields for an active trade', () => {
    const contract = {
      tradeStatus: 'paymentRequired',
      paymentMethod: 'cash.someMeetup',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youShouldPay'],
      ['meetup', 'location'],
      ['seller', 'tradeId'],
    ])
    expect(getTradeInfoFields(contract, 'seller')).toEqual([
      ['youWillGet'],
      ['meetup', 'location'],
      ['buyer', 'tradeId'],
    ])
  })
  it('should return the correct fields for a past buy offer', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'cash.someMeetup',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      ['youPaid', 'bitcoinPrice'],
      ['meetup'],
      ['seller', 'ratingBuyer'],
      ['tradeBreakdown'],
    ])
  })
  it('should return the correct fields for a past sell offer', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'cash.someMeetup',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual([
      ['soldFor', 'bitcoinPrice'],
      ['meetup'],
      ['buyer', 'ratingSeller'],
    ])
  })
})
