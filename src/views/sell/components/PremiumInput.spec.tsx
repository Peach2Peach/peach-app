import { PremiumInput } from './PremiumInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('PremiumInput', () => {
  const renderer = createRenderer()

  it('should render the PremiumInput view with premium', () => {
    renderer.render(<PremiumInput premium={3.2} setPremium={jest.fn()} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with 0 premium', () => {
    renderer.render(<PremiumInput premium={0} setPremium={jest.fn()} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with discount', () => {
    renderer.render(<PremiumInput premium={-3.2} setPremium={jest.fn()} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
