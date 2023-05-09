import ShallowRenderer from 'react-test-renderer/shallow'
import { CashTrades } from './CashTrades'

describe('CashTrades', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<CashTrades />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
