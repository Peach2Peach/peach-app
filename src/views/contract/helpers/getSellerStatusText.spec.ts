import i18n from '../../../utils/i18n'
import { getSellerStatusText } from './getSellerStatusText'

const getSellOfferFromContractMock = jest.fn(() => ({
  refunded: false,
  newOfferId: undefined,
}))
jest.mock('../../../utils/contract', () => ({
  getWalletLabelFromContract: jest.fn(() => 'walletLabel'),
  getSellOfferFromContract: jest.fn(() => getSellOfferFromContractMock()),
}))

const isPaymentTooLateMock = jest.fn(() => false)
jest.mock('../../../utils/contract/status/isPaymentTooLate', () => ({
  isPaymentTooLate: jest.fn(() => isPaymentTooLateMock()),
}))

jest.mock('./getSellerDisputeStatusText', () => ({
  getSellerDisputeStatusText: jest.fn(() => 'disputeStatusText'),
}))

describe('getSellerStatusText', () => {
  it('should return the correct status if the payment was too late and contract is not canceled', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getSellerStatusText({ canceled: false } as Contract)).toBe(i18n('contract.seller.paymentWasTooLate'))
  })
  it('should return the correct status if the offer was republished', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      refunded: false,
      // @ts-ignore
      newOfferId: 'newOfferId',
    })
    expect(getSellerStatusText({} as any)).toBe(i18n('contract.seller.republished'))
  })
  it('should return the correct status if the offer was refunded', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      refunded: true,
      newOfferId: undefined,
    })
    expect(getSellerStatusText({} as any)).toBe(i18n('contract.seller.refunded', 'walletLabel'))
  })
  it('should return the dispute status text if there is a dispute winner', () => {
    expect(getSellerStatusText({ disputeWinner: 'buyer' } as Contract)).toBe('disputeStatusText')
  })
  it('should return the correct status if republish is available (no dispute)', () => {
    expect(getSellerStatusText({ tradeStatus: 'refundOrReviveRequired' } as Contract)).toBe(
      i18n('contract.seller.refundOrRepublish', 'walletLabel'),
    )
  })
  it('should return the correct status if republish is not available', () => {
    expect(getSellerStatusText({ tradeStatus: 'refundTxSignatureRequired' } as Contract)).toBe(
      i18n('contract.seller.refund'),
    )
  })
})
