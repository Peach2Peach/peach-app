/* eslint-disable max-statements */
import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { getOfferColor } from './getOfferColor'

describe('getOfferColor', () => {
  it('should return "black" when tradeStatus is "tradeCanceled"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'tradeCanceled' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "offerCanceled"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'offerCanceled' })).toBe('black')
  })
  it('should return "primary" when tradeStatus is "tradeCompleted" and type is "ask"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'tradeCompleted', type: 'ask' })).toBe('primary')
  })
  it('should return "success" when tradeStatus is "tradeCompleted" and type is "bid"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'tradeCompleted', type: 'bid' })).toBe('success')
  })
  it('should return "error" when tradeStatus is "refundAddressRequired"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'refundAddressRequired' })).toBe('error')
  })
  it('should return "error" when tradeStatus is "dispute"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'dispute' })).toBe('error')
  })
  it('should return "warning" when tradeStatus is "releaseEscrow"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'releaseEscrow' })).toBe('warning')
  })
  it('should return "primary" when tradeStatus is "fundingAmountDifferent"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'fundingAmountDifferent' })).toBe('primary')
  })
  it('should return "black" when tradeStatus is "confirmCancelation"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'confirmCancelation' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "refundTxSignatureRequired"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'refundTxSignatureRequired' })).toBe('black')
  })
  it('should return "black" when tradeStatus is "refundOrReviveRequired"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'refundOrReviveRequired' })).toBe('black')
  })
  it('should return "primary-mild" when tradeStatus is "escrowWaitingForConfirmation"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'escrowWaitingForConfirmation' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "searchingForPeer"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'searchingForPeer' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "offerHidden"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'offerHidden' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "paymentRequired" and type is "ask"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'paymentRequired', type: 'ask' })).toBe('primary-mild')
  })
  it('should return "primary-mild" when tradeStatus is "paymentRequired" and type is "bid"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'paymentRequired', type: 'bid' })).toBe('primary')
  })
  it('should return "primary-mild" when tradeStatus is "confirmPaymentRequired" and type is "bid"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'confirmPaymentRequired', type: 'bid' })).toBe(
      'primary-mild',
    )
  })
  it('should return "primary-mild" when tradeStatus is "confirmPaymentRequired" and type is "ask"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'confirmPaymentRequired', type: 'ask' })).toBe('primary')
  })
  it('should return "warning" when the trade has a dispute winner and is a contract summary', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'rateUser', disputeWinner: 'buyer' })).toBe('warning')
  })
  it('should return "warning" when the tradeStatus is "paymentTooLate"', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'paymentTooLate' })).toBe('warning')
  })
  it('should return "black" when tradeStatus is "tradeCanceled" and is a contract summary', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'tradeCanceled' })).toBe('black')
  })
  it('should return "primary" when none of the above', () => {
    expect(getOfferColor({ ...contractSummary, tradeStatus: 'rateUser' })).toBe('primary')
  })
})
