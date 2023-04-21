import { TradeAmount } from './TradeAmount'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeAmount', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradeAmount price={1} currency="EUR" disputeActive={false} isBuyer={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for the buyer', () => {
    renderer.render(<TradeAmount price={1} currency="EUR" disputeActive={false} isBuyer />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a dispute', () => {
    renderer.render(<TradeAmount price={1} currency="EUR" disputeActive isBuyer />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
