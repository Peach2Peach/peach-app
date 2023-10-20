/* eslint-disable max-statements */
import { getOfferColor } from './getOfferColor'

const defaultTrade: TradeSummary = {
  tradeStatus: 'rateUser',
  type: 'bid',
  id: 'id',
  offerId: 'offerId',
  creationDate: new Date('2021-01-01'),
  lastModified: new Date('2021-01-01'),
  amount: 21000,
  price: 21,
  currency: 'EUR',
  unreadMessages: 0,
}
describe('getOfferColor', () => {
  it('should return "black" when tradeStatus is "tradeCanceled"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "offerCanceled"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'offerCanceled' })).toBe('black')
  })
  it('should return "primary" when tradeStatus is "tradeCompleted" and type is "ask"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'ask' })).toBe('primary')
  })
  it('should return "success" when tradeStatus is "tradeCompleted" and type is "bid"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'bid' })).toBe('success')
  })
  it('should return "error" when tradeStatus is "refundAddressRequired"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'refundAddressRequired' })).toBe('error')
  })
  it('should return "error" when tradeStatus is "dispute"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'dispute' })).toBe('error')
  })
  it('should return "warning" when tradeStatus is "releaseEscrow"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'releaseEscrow' })).toBe('warning')
  })
  it('should return "primary" when tradeStatus is "fundingAmountDifferent"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'fundingAmountDifferent' })).toBe('primary')
  })
  it('should return "black" when tradeStatus is "confirmCancelation"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'confirmCancelation' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "refundTxSignatureRequired"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'refundTxSignatureRequired' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "refundOrReviveRequired"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'refundOrReviveRequired' })).toBe('black')
  })
  it('should return "primary-mild" when tradeStatus is "escrowWaitingForConfirmation"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'escrowWaitingForConfirmation' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "searchingForPeer"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'searchingForPeer' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "offerHidden"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'offerHidden' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "paymentRequired" and type is "ask"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'paymentRequired', type: 'ask' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "paymentRequired" and type is "bid"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'paymentRequired', type: 'bid' })).toBe('primary')
  })
  it('should return "primary-mild" when tradeStatus is "confirmPaymentRequired" and type is "bid"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'confirmPaymentRequired', type: 'bid' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "confirmPaymentRequired" and type is "ask"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'confirmPaymentRequired', type: 'ask' })).toBe('primary')
  })
  it('should return "warning" when the trade has a dispute winner and is a contract summary', () => {
    expect(getOfferColor({ ...defaultTrade, disputeWinner: 'buyer' })).toBe('warning')
  })
  it('should return "warning" when the tradeStatus is "paymentTooLate"', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'paymentTooLate' })).toBe('warning')
  })
  it('should return "black" when tradeStatus is "tradeCanceled" and is a contract summary', () => {
    expect(getOfferColor({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('black')
  })
  it('should return "primary" when none of the above', () => {
    expect(getOfferColor(defaultTrade)).toBe('primary')
  })
})
