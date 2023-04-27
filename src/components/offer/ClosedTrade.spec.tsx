import { ClosedTrade } from './ClosedTrade'
import { createRenderer } from 'react-test-renderer/shallow'

describe('ClosedTrade', () => {
  const renderer = createRenderer()
  it('should render the won dispute as seller status correctly', () => {
    const contract = {
      disputeWinner: 'seller',
      tradeStatus: 'refundOrReviveRequired',
    }
    renderer.render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render a canceled trade correctly', () => {
    const contract = {
      tradeStatus: 'tradeCanceled',
    }
    renderer.render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render a completed trade correctly', () => {
    const contract = {
      tradeStatus: 'tradeCompleted',
    }
    renderer.render(<ClosedTrade contract={contract as Contract} view="seller" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
