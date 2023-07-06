import { SelectCurrency } from './SelectCurrency'
import { createRenderer } from 'react-test-renderer/shallow'

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
    },
  })),
}))

describe('SelectCurrency', () => {
  const renderer = createRenderer()

  it('should render correctly', () => {
    renderer.render(<SelectCurrency />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
