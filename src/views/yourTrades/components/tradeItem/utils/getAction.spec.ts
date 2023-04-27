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
    expect(action.label).toBe('release escrow')
    expect(action.icon).toBe('alertOctagon')
  })
})
