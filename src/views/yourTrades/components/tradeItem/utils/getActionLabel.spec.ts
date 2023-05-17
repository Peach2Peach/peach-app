import { getActionLabel } from './getActionLabel'

describe('getActionLabel', () => {
  const pastContractSummary = {
    tradeStatus: 'tradeCompleted',
    unreadMessages: 0,
    type: 'ask',
    price: 21,
    currency: 'EUR',
  } as const
  const pastOfferSummary = {
    tradeStatus: 'offerCanceled',
    unreadMessages: 0,
    type: 'bid',
  } as const

  it('should return the correct label for a past contract summary without unread messages', () => {
    const status = 'waiting'
    const result = getActionLabel(pastContractSummary, status)
    expect(result).toBe(undefined)
  })

  it('should return the correct label for a past contract summary with unread messages', () => {
    const status = 'waiting'
    const result = getActionLabel({ ...pastContractSummary, unreadMessages: 1 }, status)
    expect(result).toEqual('new chat message')
  })
  it('should return correct label for a contract summary that is waiting', () => {
    const status = 'waiting'
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'waiting' }, status)
    expect(result).toEqual('waiting for payment')
  })
  it('should return correct label for a contract summary that is waiting and a buyer', () => {
    const status = 'waiting'
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'waiting', type: 'bid' }, status)
    expect(result).toEqual('waiting for seller')
  })
  it('should return correct label for a contract summary that is rateUser', () => {
    const status = 'rateUser'
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'rateUser' }, status)
    expect(result).toEqual('rate buyer')
  })
  it('should return correct label for a contract summary that is rateUser and a buyer', () => {
    const status = 'rateUser'
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'rateUser', type: 'bid' }, status)
    expect(result).toEqual('rate seller')
  })
  it('should return correct label for a contract summary that is not waiting or rateUser', () => {
    const status = 'confirmPaymentRequired'
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'confirmPaymentRequired' }, status)
    expect(result).toEqual('confirm payment')
  })
  it('should return the correct label for past offer summaries', () => {
    const status = 'waiting'
    const result = getActionLabel(pastOfferSummary, status)
    expect(result).toBe(undefined)
  })
  it('should return the correct label for non-past offer summaries', () => {
    const status = 'waiting'
    const result = getActionLabel({ ...pastOfferSummary, tradeStatus: 'paymentRequired' }, status)
    expect(result).toEqual('make payment')
  })
})
