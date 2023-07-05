import { PaymentMethod } from './PaymentMethod'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../contexts/drawer', () => ({
  useDrawerContext: jest.fn(() => [, jest.fn()]),
}))

describe('PaymentMethod', () => {
  const renderer = createRenderer()
  const props = {
    currency: 'EUR' as const,
    setPaymentMethod: jest.fn(),
    next: jest.fn(),
  }

  it('should render correctly', () => {
    renderer.render(<PaymentMethod {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
