import { TradeStatusInfo } from './TradeStatusInfo'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../views/contract/context', () => ({
  useContractContext: () => ({
    contract: {
      amount: 21,
    },
    view: 'buyer',
  }),
}))

jest.mock('./getTradeActionStatus', () => ({
  getTradeActionStatus: jest.fn(() => 'status'),
}))

jest.mock('./getTradeActionStatusText', () => ({
  getTradeActionStatusText: jest.fn(() => 'status text'),
}))

describe('TradeStatusInfo', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<TradeStatusInfo />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
