import ShallowRenderer from 'react-test-renderer/shallow'
import { tradingLimit } from '../../../../tests/unit/data/tradingLimitsData'
import { DailyTradingLimit } from './DailyTradingLimit'

const useTradingLimitsMock = jest.fn().mockReturnValue({ limits: tradingLimit })
jest.mock('../../../hooks', () => ({
  useTradingLimits: () => useTradingLimitsMock(),
}))

describe('DailyTradingLimit', () => {
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    renderer.render(<DailyTradingLimit />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
