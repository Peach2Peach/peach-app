import { Countries } from './Countries'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
}))

describe('Countries', () => {
  const renderer = createRenderer()
  const props = {
    countries: [
      {
        value: 'DE',
        display: 'Germany',
      },
    ] satisfies {
      value: PaymentMethodCountry
      display: string
    }[],
    selectedCountry: 'DE' as const,
    setCountry: jest.fn(),
    next: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<Countries {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
