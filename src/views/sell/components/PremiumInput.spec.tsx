import { PremiumInput } from './PremiumInput'
import { createRenderer } from 'react-test-renderer/shallow'

describe('PremiumInput', () => {
  const setPremiumMock = jest.fn()
  const renderer = createRenderer()

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the PremiumInput view with premium', () => {
    renderer.render(<PremiumInput premium="3.2" setPremium={setPremiumMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with 0 premium', () => {
    renderer.render(<PremiumInput premium="0" setPremium={setPremiumMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render the PremiumInput view with discount', () => {
    renderer.render(<PremiumInput premium="-3.2" setPremium={setPremiumMock} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
