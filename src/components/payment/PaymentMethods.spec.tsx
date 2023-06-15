import { PaymentMethods } from './PaymentMethods'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../../hooks/usePreviousRouteName', () => ({
  usePreviousRouteName: jest.fn(),
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))
jest.mock('./hooks/usePaymentMethodsSetup', () => ({
  usePaymentMethodsSetup: jest.fn(() => false),
}))

describe('PaymentMethods', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<PaymentMethods />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
