import { getOfferLevel } from './getOfferLevel'

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
describe('getOfferLevel', () => {
  it('should return "gray" when tradeStatus is "tradeCanceled"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('gray')
  })
  it('should return "gray" when tradeStatus is "offerCanceled"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'offerCanceled' })).toBe('gray')
  })
  it('should return "orange" when tradeStatus is "tradeCompleted" and type is "ask"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'ask' })).toBe('orange')
  })
  it('should return "green" when tradeStatus is "tradeCompleted" and type is "bid"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'bid' })).toBe('green')
  })
  it('should return "red" when tradeStatus is "refundAddressRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundAddressRequired' })).toBe('red')
  })
  it('should return "red" when tradeStatus is "dispute"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'dispute' })).toBe('red')
  })
  it('should return "yellow" when tradeStatus is "releaseEscrow"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'releaseEscrow' })).toBe('yellow')
  })
  it('should return "orange" when tradeStatus is "fundingAmountDifferent"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'fundingAmountDifferent' })).toBe('orange')
  })
  it('should return "gray" when tradeStatus is "confirmCancelation"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'confirmCancelation' })).toBe('gray')
  })
  it('should return "yellow" when tradeStatus is "refundTxSignatureRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundTxSignatureRequired' })).toBe('yellow')
  })
  it('should return "yellow" when tradeStatus is "refundOrReviveRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundOrReviveRequired' })).toBe('yellow')
  })
  it('should return "mild" when tradeStatus is "escrowWaitingForConfirmation"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'escrowWaitingForConfirmation' })).toBe('mild')
  })
  it('should return "mild" when tradeStatus is "searchingForPeer"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'searchingForPeer' })).toBe('mild')
  })
  it('should return "mild" when tradeStatus is "offerHidden"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'offerHidden' })).toBe('mild')
  })
  it('should return "mild" when tradeStatus is "paymentRequired" and type is "ask"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'paymentRequired', type: 'ask' })).toBe('mild')
  })
  it('should return "mild" when tradeStatus is "confirmPaymentRequired" and type is "bid"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'confirmPaymentRequired', type: 'bid' })).toBe('mild')
  })
  it('should return "yellow" when the trade has a dispute winner and is a contract summary', () => {
    expect(getOfferLevel({ ...defaultTrade, disputeWinner: 'buyer' })).toBe('yellow')
  })
  it('should return "gray" when tradeStatus is "tradeCanceled" and is a contract summary', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('gray')
  })
  it('should return "orange" when none of the above', () => {
    expect(getOfferLevel(defaultTrade)).toBe('orange')
  })
})
