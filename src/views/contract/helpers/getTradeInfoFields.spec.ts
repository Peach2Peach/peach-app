import { getTradeInfoFields } from './getTradeInfoFields'

// eslint-disable-next-line max-lines-per-function
describe('getTradeInfoFields', () => {
  it('should return the correct fields for an active sell trade', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'sepa',
    } as any
    expect(getTradeInfoFields(contract, 'seller')).toEqual(['price', 'reference', 'paidToMethod', 'via'])
    expect(getTradeInfoFields({ ...contract, tradeStatus: 'dispute' }, 'seller')).toEqual([
      'price',
      'reference',
      'paidToMethod',
      'via',
    ])
  })
  it('should return the correct fields for a past sell trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as any
    expect(getTradeInfoFields(contract, 'seller')).toEqual([
      'price',
      'paidToMethod',
      'via',
      'bitcoinAmount',
      'bitcoinPrice',
    ])
    expect(getTradeInfoFields({ ...contract, tradeStatus: 'dispute', releaseTxId: 'someId' }, 'seller')).toEqual([
      'price',
      'paidToMethod',
      'via',
      'bitcoinAmount',
      'bitcoinPrice',
    ])
  })
  it('should return the correct fields for a past buy trade', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
      paymentMethod: 'sepa',
      releaseTxId: 'someId',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'price',
      'paidWithMethod',
      'bitcoinAmount',
      'bitcoinPrice',
      'paidToWallet',
    ])
  })
  it('should return the correct fields for an active buy trade - template1', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'sepa',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'beneficiary', 'iban', 'bic', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template2', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'advcash',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'wallet', 'email'])
  })
  it('should return the correct fields for an active buy trade - template3', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'vipps',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'beneficiary', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template4', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'skrill',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'beneficiary', 'email', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template5', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'fasterPayments',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'method',
      'price',
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
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'userName', 'email', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template7', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'straksbetaling',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'method',
      'price',
      'beneficiary',
      'accountNumber',
      'reference',
    ])
  })
  it('should return the correct fields for an active buy trade - template8', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'paysera',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual(['method', 'price', 'beneficiary', 'phone', 'reference'])
  })
  it('should return the correct fields for an active buy trade - template9', () => {
    const contract = {
      tradeStatus: 'waiting',
      paymentMethod: 'nationalTransferBG',
    } as any
    expect(getTradeInfoFields(contract, 'buyer')).toEqual([
      'method',
      'price',
      'beneficiary',
      'iban',
      'accountNumber',
      'bic',
      'reference',
    ])
  })
})
