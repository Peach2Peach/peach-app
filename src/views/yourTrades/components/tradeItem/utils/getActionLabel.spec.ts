import { useWalletState } from '../../../../../utils/wallet/walletStore'
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
  const sellOfferSummary = {
    unreadMessages: 0,
    type: 'ask',
    id: '1',
  } as const

  it('should return the correct label for a past contract summary without unread messages', () => {
    const result = getActionLabel(pastContractSummary, true)
    expect(result).toBe(undefined)
  })

  it('should return the correct label for a past contract summary with unread messages', () => {
    const result = getActionLabel({ ...pastContractSummary, unreadMessages: 1 }, true)
    expect(result).toEqual('new chat message')
  })
  it('should return correct label for a contract summary that is waiting', () => {
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'waiting' }, true)
    expect(result).toEqual('waiting for payment')
  })
  it('should return correct label for a contract summary that is waiting and a buyer', () => {
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'waiting', type: 'bid' }, true)
    expect(result).toEqual('waiting for seller')
  })
  it('should return correct label for a contract summary that is rateUser', () => {
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'rateUser' }, false)
    expect(result).toEqual('rate buyer')
  })
  it('should return correct label for a contract summary that is rateUser and a buyer', () => {
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'rateUser', type: 'bid' }, false)
    expect(result).toEqual('rate seller')
  })
  it('should return correct label for a contract summary that is not waiting or rateUser', () => {
    const result = getActionLabel({ ...pastContractSummary, tradeStatus: 'confirmPaymentRequired' }, false)
    expect(result).toEqual('confirm payment')
  })
  it('should return the correct label for past offer summaries', () => {
    const result = getActionLabel(pastOfferSummary, true)
    expect(result).toBe(undefined)
  })
  it('should return the correct label for non-past offer summaries', () => {
    const result = getActionLabel({ ...pastOfferSummary, tradeStatus: 'paymentRequired' }, true)
    expect(result).toEqual('make payment')
  })
  it('should return the correct label sell offer to be funded', () => {
    const result = getActionLabel({ ...sellOfferSummary, tradeStatus: 'fundEscrow' }, false)
    expect(result).toEqual('fund escrow')
  })
  it('should return the correct label sell offer to be funded via multiple', () => {
    useWalletState.getState().registerFundMultiple('address', [sellOfferSummary.id])
    const result = getActionLabel({ ...sellOfferSummary, tradeStatus: 'fundEscrow' }, false)
    expect(result).toEqual('offer.requiredAction.fundMultipleEscrow')
  })
})
