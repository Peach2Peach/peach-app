import { TradeStuffSeparator } from './TradeStuffSeparator'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeStuffSeparator', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradeStuffSeparator disputeActive={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when the dispute is active', () => {
    renderer.render(<TradeStuffSeparator disputeActive={true} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
