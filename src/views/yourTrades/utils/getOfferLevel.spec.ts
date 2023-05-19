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
  it('should return "DEFAULT" when tradeStatus is "tradeCanceled"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('DEFAULT')
  })
  it('should return "DEFAULT" when tradeStatus is "offerCanceled"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'offerCanceled' })).toBe('DEFAULT')
  })
  it('should return "APP" when tradeStatus is "tradeCompleted" and type is "ask"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'ask' })).toBe('APP')
  })
  it('should return "SUCCESS" when tradeStatus is "tradeCompleted" and type is "bid"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCompleted', type: 'bid' })).toBe('SUCCESS')
  })
  it('should return "ERROR" when tradeStatus is "refundAddressRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundAddressRequired' })).toBe('ERROR')
  })
  it('should return "ERROR" when tradeStatus is "dispute"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'dispute' })).toBe('ERROR')
  })
  it('should return "WARN" when tradeStatus is "releaseEscrow"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'releaseEscrow' })).toBe('WARN')
  })
  it('should return "APP" when tradeStatus is "fundingAmountDifferent"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'fundingAmountDifferent' })).toBe('APP')
  })
  it('should return "WARN" when tradeStatus is "confirmCancelation"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'confirmCancelation' })).toBe('WARN')
  })
  it('should return "WARN" when tradeStatus is "refundTxSignatureRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundTxSignatureRequired' })).toBe('WARN')
  })
  it('should return "WARN" when tradeStatus is "refundOrReviveRequired"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'refundOrReviveRequired' })).toBe('WARN')
  })
  it('should return "WAITING" when tradeStatus is "escrowWaitingForConfirmation"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'escrowWaitingForConfirmation' })).toBe('WAITING')
  })
  it('should return "WAITING" when tradeStatus is "searchingForPeer"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'searchingForPeer' })).toBe('WAITING')
  })
  it('should return "WAITING" when tradeStatus is "offerHidden"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'offerHidden' })).toBe('WAITING')
  })
  it('should return "WAITING" when tradeStatus is "paymentRequired" and type is "ask"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'paymentRequired', type: 'ask' })).toBe('WAITING')
  })
  it('should return "WAITING" when tradeStatus is "confirmPaymentRequired" and type is "bid"', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'confirmPaymentRequired', type: 'bid' })).toBe('WAITING')
  })
  it('should return "WARN" when the trade has a dispute winner and is a contract summary', () => {
    expect(getOfferLevel({ ...defaultTrade, disputeWinner: 'buyer' })).toBe('WARN')
  })
  it('should return "DEFAULT" when tradeStatus is "tradeCanceled" and is a contract summary', () => {
    expect(getOfferLevel({ ...defaultTrade, tradeStatus: 'tradeCanceled' })).toBe('DEFAULT')
  })
  it('should return "APP" when none of the above', () => {
    expect(getOfferLevel(defaultTrade)).toBe('APP')
  })
})
