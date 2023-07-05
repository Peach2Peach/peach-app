import { SelectCurrency } from './SelectCurrency'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
}))

describe('SelectCurrency', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
    next: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<SelectCurrency {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
