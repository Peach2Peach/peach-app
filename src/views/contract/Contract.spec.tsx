import Contract from './Contract'
import { createRenderer } from 'react-test-renderer/shallow'

const defaultReturnValue = {
  contract: {
    buyer: {
      username: 'buyerUsername',
    },
    seller: {
      username: 'sellerUsername',
    },
    disputeActive: false,
  },
  isLoading: false,
  view: 'buyer',
  requiredAction: 'requiredAction',
  actionPending: false,
  postConfirmPaymentBuyer: jest.fn(),
  postConfirmPaymentSeller: jest.fn(),
}

const useContractSetupMock = jest.fn(() => defaultReturnValue)

jest.mock('./hooks/useContractSetup', () => ({
  useContractSetup: () => useContractSetupMock(),
}))

describe('Contract', () => {
  const renderer = createRenderer()
  it('should render a default Contract', () => {
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should show the loading screen if isLoading is true', () => {
    useContractSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      isLoading: true,
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should show the buyers profile overview if the viewer is the seller', () => {
    useContractSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      view: 'seller',
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
