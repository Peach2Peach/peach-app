import { createRenderer } from 'react-test-renderer/shallow'
import { SelectPaymentMethod } from './SelectPaymentMethod'

jest.mock('../../contexts/drawer', () => ({
  useDrawerContext: jest.fn(() => [null, jest.fn()]),
}))

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      origin: 'paymentMethod',
      selectedCurrency: 'EUR',
    },
  })),
}))

describe('SelectPaymentMethod', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<SelectPaymentMethod />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
