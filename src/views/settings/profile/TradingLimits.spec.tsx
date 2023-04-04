import ShallowRenderer from 'react-test-renderer/shallow'
import { tradingLimit } from '../../../../tests/unit/data/tradingLimitsData'
import { TradingLimits } from './TradingLimits'

const useTradingLimitsMock = jest.fn().mockReturnValue({ limits: tradingLimit })
jest.mock('../../../hooks', () => ({
  useTradingLimits: () => useTradingLimitsMock(),
}))

describe('TradingLimits', () => {
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    renderer.render(<TradingLimits />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
