import { getAction } from './getAction'

describe('getAction - disputes', () => {
  it('should return the correct action for a lost dispute as a seller', () => {
    const tradeSummary = {
      amount: 40000,
      creationDate: new Date('2023-04-26T13:08:57.023Z'),
      currency: 'EUR',
      disputeWinner: 'buyer',
      id: '335-338',
      isChatActive: true,
      lastModified: new Date('2023-04-26T14:58:49.450Z'),
      offerId: '335',
      paymentConfirmed: undefined,
      paymentMade: new Date('2023-04-26T14:58:49.437Z'),
      price: 10.9,
      tradeStatus: 'releaseEscrow',
      type: 'ask',
      unreadMessages: 0,
    } as const
    const action = getAction(tradeSummary, () => {}, 'releaseEscrow')
    expect(action.label).toBe('dispute lost: release escrow')
    expect(action.icon).toBe('alertOctagon')
  })
  it('should return the correct action for a won dispute as a seller', () => {
    const tradeSummary = {
      amount: 50000,
      creationDate: new Date('2023-04-24T23:13:32.074Z'),
      currency: 'EUR',
      disputeWinner: 'seller',
      id: '329-330',
      isChatActive: true,
      lastModified: new Date('2023-04-26T15:00:03.187Z'),
      offerId: '329',
      paymentConfirmed: undefined,
      paymentMade: new Date('2023-04-26T11:54:05.656Z'),
      price: 12.64,
      tradeStatus: 'refundTxSignatureRequired',
      type: 'ask',
      unreadMessages: 0,
    } as const
    const action = getAction(tradeSummary, () => {}, 'refundTxSignatureRequired')
    expect(action.label).toBe('dispute won: resolve now')
    expect(action.icon).toBe('alertOctagon')
  })
  it('should return the correct action for a lost dispute as a buyer', () => {})
  it('should return the correct action for a won dispute as a buyer', () => {
    const tradeSummary = {
      amount: 40000,
      creationDate: new Date('2023-04-26T13:08:57.023Z'),
      currency: 'EUR',
      disputeWinner: 'buyer',
      id: '335-338',
      isChatActive: true,
      lastModified: new Date('2023-04-26T14:58:49.450Z'),
      offerId: '338',
      paymentConfirmed: undefined,
      paymentMade: new Date('2023-04-26T14:58:49.437Z'),
      price: 10.9,
      tradeStatus: 'confirmPaymentRequired',
      type: 'bid',
      unreadMessages: 0,
    } as const
    const action = getAction(tradeSummary, () => {}, 'confirmPaymentRequired')
    expect(action.label).toBe('dispute won: awaiting payout')
    expect(action.icon).toBe('alertOctagon')
  })
})
