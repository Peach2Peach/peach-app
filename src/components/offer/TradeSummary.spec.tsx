import { createRenderer } from 'react-test-renderer/shallow'
import { TradeSummary } from './TradeSummary'

describe('TradeSummary', () => {
  const renderer = createRenderer()

  it('should render open trade correctly', () => {
    const props = {
      contract: { paymentConfirmed: null, canceled: false } as Contract,
      view: 'buyer',
    } as const
    renderer.render(<TradeSummary {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render closed trade correctly', () => {
    const props = {
      contract: { paymentConfirmed: null, canceled: true } as Contract,
      view: 'buyer',
    } as const
    renderer.render(<TradeSummary {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render won dispute with outstanding action as seller correctly', () => {
    const props = {
      contract: { paymentConfirmed: null, canceled: true, tradeStatus: 'refundOrReviveRequired' } as Contract,
      view: 'seller',
    } as const
    renderer.render(<TradeSummary {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
