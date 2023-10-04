import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethods } from './PaymentMethods'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../../hooks/usePreviousRouteName', () => ({
  usePreviousRouteName: jest.fn(),
}))
jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({ name: 'paymentMethods' })),
}))

const editItem = jest.fn()
const select = jest.fn()
const isSelected = jest.fn()
jest.mock('./hooks/usePaymentMethodsSetup', () => ({
  usePaymentMethodsSetup: jest.fn(() => ({
    editItem,
    select,
    isSelected,
    isEditing: false,
  })),
}))

describe('PaymentMethods', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<PaymentMethods />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
