import { getTradeInfoFields } from './getTradeInfoFields'

// eslint-disable-next-line max-lines-per-function
describe('getTradeInfoFields', () => {
  it('should return the correct fields for an active sell trade', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'sepa',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual(['price', 'reference', 'paidToMethod', 'via'])
  })
  it('should return the correct fields for a past sell trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual(['price', 'bitcoinPrice', 'paidToMethod'])
  })
  it('should return the correct fields for a past buy trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'bitcoinPrice', 'paidWithMethod'])
  })
  it('should return the correct fields for an active buy trade - template1', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'sepa',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'beneficiary', 'iban', 'bic', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template2', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'advcash',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'wallet', 'email'])
  })
  it('should return the correct fields for an active buy trade - template3', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'vipps',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'beneficiary', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template4', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'skrill',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'beneficiary', 'email', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template5', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'fasterPayments',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'price',
      'method',
      'beneficiary',
      'ukBankAccount',
      'ukSortCode',
      'reference',
    ])
  })
  it('should return the correct fields for an active buy trade - template6', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'paypal',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'userName', 'email', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template7', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'straksbetaling',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'price',
      'method',
      'beneficiary',
      'accountNumber',
      'reference',
    ])
  })
  it('should return the correct fields for an active buy trade - template8', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'paysera',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'method', 'beneficiary', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template9', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'nationalTransferBG',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'price',
      'method',
      'beneficiary',
      'iban',
      'accountNumber',
      'bic',
      'reference',
    ])
  })
})

describe('getTradeInfoFields - cash trades', () => {
  it('should return the correct fields for an active trade', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'cash.someMeetup',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'meetup', 'location'])
    expect(getTradeInfoFields(contract, 'seller')).toEqual(['price', 'meetup', 'location'])
  })
  it('should return the correct fields for a past buy offer', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'cash.someMeetup',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['price', 'bitcoinPrice', 'meetup'])
  })
  it('should return the correct fields for a past sell offer', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'cash.someMeetup',
      releaseTxId: 'someId',
    } as const
    expect(getTradeInfoFields(contract, 'seller')).toEqual(['price', 'bitcoinPrice', 'meetup'])
  })
})
