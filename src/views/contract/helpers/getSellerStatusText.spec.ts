import i18n from '../../../utils/i18n'
import { getSellerStatusText } from './getSellerStatusText'

const getSellOfferFromContractMock = jest.fn(() => ({
  refunded: false,
  newOfferId: undefined,
}))
jest.mock('../../../utils/contract/getWalletLabelFromContract', () => ({
  getWalletLabelFromContract: jest.fn(() => 'walletLabel'),
}))
jest.mock('../../../utils/contract/getSellOfferFromContract', () => ({
  getSellOfferFromContract: jest.fn(() => getSellOfferFromContractMock()),
}))

const isPaymentTooLateMock = jest.fn(() => false)
jest.mock('../../../utils/contract/status/isPaymentTooLate', () => ({
  isPaymentTooLate: jest.fn(() => isPaymentTooLateMock()),
}))

jest.mock('./getSellerDisputeStatusText', () => ({
  getSellerDisputeStatusText: jest.fn(() => 'disputeStatusText'),
}))

// eslint-disable-next-line max-lines-per-function
describe('getSellerStatusText', () => {
  it('should return the correct status if the buyer canceled the trade (republish available)', () => {
    expect(
      getSellerStatusText(
        { canceled: true, canceledBy: 'buyer', tradeStatus: 'refundOrReviveRequired' } as Contract,
        true,
      ),
    ).toBe(i18n('contract.seller.buyerCanceledWithoutRequest', 'walletLabel'))
  })
  it('should return the correct status if the buyer canceled the trade (republish unavailable)', () => {
    expect(
      getSellerStatusText(
        { canceled: true, canceledBy: 'buyer', tradeStatus: 'refundTxSignatureRequired' } as Contract,
        true,
      ),
    ).toBe('The buyer canceled the trade and you can now get refunded.')
  })
  it('should return the correct status if the offer was republished', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      refunded: false,
      // @ts-ignore
      newOfferId: 'newOfferId',
    })
    expect(getSellerStatusText({} as any, true)).toBe(i18n('contract.seller.republished'))
  })
  it('should return the correct status if the offer was refunded', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      refunded: true,
      newOfferId: undefined,
    })
    expect(getSellerStatusText({} as any, true)).toBe(i18n('contract.seller.refunded', 'walletLabel'))
  })
  it('should return the dispute status text if there is a dispute winner', () => {
    expect(getSellerStatusText({ disputeWinner: 'buyer' } as Contract, true)).toBe('disputeStatusText')
  })
  it('should return the correct status if republish is available (no dispute)', () => {
    expect(getSellerStatusText({ tradeStatus: 'refundOrReviveRequired' } as Contract, true)).toBe(
      "You'll need to decide if you want to re-publish this trade, or refund the escrow to your walletLabel.",
    )
    expect(
      getSellerStatusText(
        {
          canceled: true,
          canceledBy: 'buyer',
          cancelationRequested: true,
          tradeStatus: 'refundOrReviveRequired',
        } as Contract,
        true,
      ),
    ).toBe(i18n('contract.seller.buyerAgreedToCancel'))
  })
  it('should return the correct status if republish is not available', () => {
    expect(getSellerStatusText({ tradeStatus: 'refundTxSignatureRequired' } as Contract, true)).toBe(
      i18n('contract.seller.refund'),
    )
    expect(
      getSellerStatusText(
        {
          canceled: true,
          canceledBy: 'buyer',
          cancelationRequested: true,
          tradeStatus: 'refundTxSignatureRequired',
        } as Contract,
        true,
      ),
    ).toBe(i18n('contract.seller.refund'))
  })
})
