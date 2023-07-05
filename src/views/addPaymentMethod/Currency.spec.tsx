import { Currency } from './Currency'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
}))

describe('Currency', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setCurrency: jest.fn(),
    next: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<Currency {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
