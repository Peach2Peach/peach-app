import { createRenderer } from 'react-test-renderer/shallow'
import { TradeStatusInfo } from './TradeStatusInfo'

jest.mock('../context', () => ({
  useContractContext: () => ({
    contract: {
      amount: 21,
    },
    view: 'buyer',
  }),
}))

jest.mock('../helpers', () => ({
  getTradeActionStatus: jest.fn(() => 'status'),
  getTradeActionStatusText: jest.fn(() => 'status text'),
}))

describe('TradeStatusInfo', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<TradeStatusInfo />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
