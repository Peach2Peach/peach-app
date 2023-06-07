import PaymentMethods from './PaymentMethods'
import { createRenderer } from 'react-test-renderer/shallow'

const useHeaderSetupMock = jest.fn()
jest.mock('../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: any[]) => useHeaderSetupMock(...args),
}))

describe('PaymentMethods', () => {
  const renderer = createRenderer()
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    renderer.render(<PaymentMethods />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should set up the header', () => {
    renderer.render(<PaymentMethods />)
    expect(useHeaderSetupMock).toHaveBeenCalledWith('edit payment methods')
  })
})
