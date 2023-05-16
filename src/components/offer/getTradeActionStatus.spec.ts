import { getTradeActionStatus } from './getTradeActionStatus'

const getSellOfferFromContractMock = jest.fn((..._args) => ({
  newOfferId: 'newOfferId',
  refunded: false,
  releaseTxId: 'releaseTxId',
}))

jest.mock('../../utils/contract', () => ({
  getSellOfferFromContract: (...args: any) => getSellOfferFromContractMock(...args),
}))

describe('getTradeActionStatus - buyer', () => {
  it.todo('should return the correct status if the buyer canceled')
  it.todo('should return the correct status if the buyer canceled a cash trade')
  it.todo('should return the correct status if the seller canceled a cash trade')
  it.todo('should return the correct status if the seller requested a cancelation')
  it.todo('should return the correct status if the buyer agreed to cancel')
  it.todo('should return the correct status if the payment is too late')
  it.todo('should return the correct status if the buyer won the dispute and the funds were not released')
  it.todo('should return the correct status if the buyer won the dispute and the funds were released')
  it.todo('should return the correct status if the buyer lost the dispute')
})

describe('getTradeActionStatus - seller', () => {
  it.todo('should return the correct status if the buyer canceled and republish is available')
  it.todo('should return the correct status if the buyer canceled and republish is not available')
  it.todo('should return the correct status if the buyer canceled and offer was republished')
  it.todo('should return the correct status if the buyer canceled and offer was refunded')
  it.todo('should return the correct status if the seller canceled a cash trade')
  it.todo('should return the correct status if the trade was canceled collaboratively and republish is available')
  it.todo('should return the correct status if the trade was canceled collaboratively and republish is not available')
  it.todo('should return the correct status if the trade was canceled collaboratively and offer was republished')
  it.todo('should return the correct status if the trade was canceled collaboratively and offer was refunded')
  it.todo('should return the correct status if payment was too late and seller can cancel or give more time')
  it.todo('should return the correct status if payment was too late and republish is available')
  it.todo('should return the correct status if payment was too late and republish is not available')
  it.todo('should return the correct status if payment was too late and offer was republished')
  it.todo('should return the correct status if payment was too late and offer was refunded')
  it.todo('should return the correct status if seller won the dispute and republish is available')
  it.todo('should return the correct status if seller won the dispute and republish is not available')
  it.todo('should return the correct status if seller won the dispute and offer was republished')
  it.todo('should return the correct status if seller won the dispute and offer was refunded')
  it.todo('should return the correct status if seller lost the dispute and has not released the funds')
  it.todo('should return the correct status if seller lost the dispute and has released the funds')
})
