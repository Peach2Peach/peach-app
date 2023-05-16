import i18n from '../../utils/i18n'
import { getBuyerStatusText } from './getBuyerStatusText'

const isPaymentTooLateMock = jest.fn((..._args) => false)
jest.mock('./isPaymentTooLate', () => ({
  isPaymentTooLate: (...args: any) => isPaymentTooLateMock(...args),
}))

describe('getBuyerStatusText', () => {
  const mockContract = {
    tradeStatus: 'tradeCompleted',
    paymentMade: new Date(),
    paymentMethod: 'sepa',
  } as unknown as Contract
  it('should return correct text if the buyer canceled the trade and it\'s not a cash trade', () => {
    expect(getBuyerStatusText({ ...mockContract, canceled: true, canceledBy: 'buyer' })).toBe(
      i18n('contract.buyer.buyerCanceledTrade'),
    )
  })
  it('should return correct text if the buyer canceled the trade and it\'s a cash trade', () => {
    expect(getBuyerStatusText({ ...mockContract, canceled: true, canceledBy: 'buyer', paymentMethod: 'cash' })).toBe(
      'contract.buyer.buyerCanceledCashTrade',
    )
  })
  it.todo('should return correct text if seller requested cancelation')
  it.todo('should return correct text if buyer agreed to cancel')
  it.todo('should return correct text if seller canceled cash trade')
  it.todo('should return correct text if payment is too late')
  it.todo('should return the correct text if buyer lost a dispute')
  it.todo('should return the correct text if buyer won a dispute and is waiting for the seller to pay')
  it.todo('should return correct text if the buyer won a dispute and the seller paid')
})
