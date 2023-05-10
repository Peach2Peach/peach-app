import { getTradeStatusText } from './getTradeStatusText'

describe('getTradeStatusText', () => {
  it('returns trade.disputeActive when disputeActive is true', () => {
    expect(getTradeStatusText(true, 'tradeCanceled')).toEqual('trade in dispute!')
  })
  it('returns trade.disputeActive when tradeStatus is confirmPaymentRequired', () => {
    expect(getTradeStatusText(false, 'confirmPaymentRequired')).toEqual('trade in dispute!')
  })
  it('returns trade.paymentDetails when tradeStatus is anything else', () => {
    expect(getTradeStatusText(false, 'tradeCompleted')).toEqual('payment details')
  })
})
