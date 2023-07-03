import { AddPaymentMethod } from './AddPaymentMethod'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      origin: 'origin',
    },
  })),
}))

describe('AddPaymentMethod', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<AddPaymentMethod />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
