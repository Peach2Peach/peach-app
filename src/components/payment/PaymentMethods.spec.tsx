import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethods } from './PaymentMethods'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../../hooks/usePreviousRoute', () => ({
  usePreviousRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))

describe('PaymentMethods', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<PaymentMethods />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
