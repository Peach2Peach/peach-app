import { createRenderer } from 'react-test-renderer/shallow'
import { TradeBreakdown } from './TradeBreakdown'

jest.mock('../utils/bitcoin/getTradeBreakdown', () => ({
  getTradeBreakdown: () => ({
    totalAmount: 210000,
    peachFee: 21000,
    networkFee: 1000,
    amountReceived: 188000,
  }),
}))

describe('TradeBreakdown', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<TradeBreakdown releaseAddress="someAddress" releaseTransaction="someTx" amount={210000} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
