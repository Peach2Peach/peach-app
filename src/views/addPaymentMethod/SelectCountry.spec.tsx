import { createRenderer } from 'react-test-renderer/shallow'
import { SelectCountry } from './SelectCountry'

jest.mock('../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
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

describe('SelectCountry', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<SelectCountry />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
