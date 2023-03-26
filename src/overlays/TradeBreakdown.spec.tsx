import { createRenderer } from 'react-test-renderer/shallow'
import { HorizontalLine } from '../components'
import i18n from '../utils/i18n'
import { TradeBreakdown } from './TradeBreakdown'

const getTradeBreakdownMock = jest.fn().mockReturnValue({
  totalAmount: 210000,
  peachFee: 21000,
  networkFee: 1000,
  amountReceived: 188000,
})
jest.mock('../utils/bitcoin', () => ({
  getTradeBreakdown: (...args: any[]) => getTradeBreakdownMock(...args),
}))

describe('TradeBreakdown', () => {
  const renderer = createRenderer()
  renderer.render(<TradeBreakdown releaseAddress="someAddress" releaseTransaction="someTx" amount={210000} />)
  const result = renderer.getRenderOutput()
  it('should show the total seller amount', () => {
    const firstView = result.props.children[0]
    expect(firstView.props.children[0].props.children).toBe(i18n('tradeComplete.popup.tradeBreakdown.sellerAmount'))
    expect(firstView.props.children[1].props.amount).toBe(210000)
  })

  it('should show the peach fees', () => {
    const secondView = result.props.children[1]
    expect(secondView.props.children[0].props.children).toBe(i18n('tradeComplete.popup.tradeBreakdown.peachFees'))
    expect(secondView.props.children[1].props.amount).toBe(21000)
  })

  it('should separate total amount and peach fees with horizontal line', () => {
    const thirdView = result.props.children[2]
    expect(thirdView.type).toBe(HorizontalLine)
  })

  it('should show the trade amount', () => {
    const thirdView = result.props.children[3]
    expect(thirdView.props.children[0].props.children).toBe(i18n('tradeComplete.popup.tradeBreakdown.tradeAmount'))
    expect(thirdView.props.children[1].props.amount).toBe(189000)
  })

  it('should show the network fees', () => {
    const fourthView = result.props.children[4]
    expect(fourthView.props.children[0].props.children).toBe(i18n('tradeComplete.popup.tradeBreakdown.networkFees'))
    expect(fourthView.props.children[1].props.amount).toBe(1000)
  })

  it('should separate trade amount and network fees with horizontal line', () => {
    const fifthView = result.props.children[5]
    expect(fifthView.type).toBe(HorizontalLine)
  })

  it('should show the amount received', () => {
    const fifthView = result.props.children[6]
    expect(fifthView.props.children[0].props.children).toBe(i18n('tradeComplete.popup.tradeBreakdown.youGet'))
    expect(fifthView.props.children[1].props.amount).toBe(188000)
  })
})
