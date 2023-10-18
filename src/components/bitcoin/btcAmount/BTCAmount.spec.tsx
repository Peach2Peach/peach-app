import { createRenderer } from 'react-test-renderer/shallow'
import { BTCAmount } from './BTCAmount'

describe('BTCAmount', () => {
  const renderer = createRenderer()
  const amount = 21000
  it('should render correctly for extra small size', () => {
    renderer.render(<BTCAmount amount={amount} size="x small" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for small size', () => {
    renderer.render(<BTCAmount amount={amount} size="small" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for medium size', () => {
    renderer.render(<BTCAmount amount={amount} size="medium" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for large size', () => {
    renderer.render(<BTCAmount amount={amount} size="large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for extra large size', () => {
    renderer.render(<BTCAmount amount={amount} size="extra large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with white', () => {
    renderer.render(<BTCAmount amount={amount} size="extra large" white />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when the value is 0', () => {
    renderer.render(<BTCAmount amount={0} size="extra large" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when showAmount is false', () => {
    renderer.render(<BTCAmount amount={amount} size="extra large" showAmount={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
