import { SelectPaymentMethod } from './SelectPaymentMethod'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../contexts/drawer', () => ({
  useDrawerContext: jest.fn(() => [, jest.fn()]),
}))

describe('SelectPaymentMethod', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setPaymentMethod: jest.fn(),
    next: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<SelectPaymentMethod {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
