import { getTradeStatusIcon } from './getTradeStatusIcon'

describe('getTradeStatusIcon', () => {
  it('returns alertOctagon when disputeActive is true', () => {
    expect(getTradeStatusIcon(true, 'tradeCanceled')).toEqual('alertOctagon')
  })

  it('returns alertOctagon when tradeStatus is confirmPaymentRequired', () => {
    expect(getTradeStatusIcon(false, 'confirmPaymentRequired')).toEqual('alertOctagon')
  })

  it('returns undefined when tradeStatus is anything else', () => {
    expect(getTradeStatusIcon(false, 'tradeCompleted')).toEqual(undefined)
  })
})
