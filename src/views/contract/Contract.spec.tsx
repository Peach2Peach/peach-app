import Contract from './Contract'
import { createRenderer } from 'react-test-renderer/shallow'

const useContractSetupMock = jest.fn(() => ({
  contract: {
    seller: {
      username: 'username',
    },
    disputeActive: false,
  },
  isLoading: false,
  view: 'view',
  requiredAction: 'requiredAction',
  actionPending: false,
  postConfirmPaymentBuyer: jest.fn(),
  postConfirmPaymentSeller: jest.fn(),
}))

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
      contract: {
        seller: {
          username: 'username',
        },
        disputeActive: false,
      },
      isLoading: true,
      view: 'view',
      requiredAction: 'requiredAction',
      actionPending: false,
      postConfirmPaymentBuyer: jest.fn(),
      postConfirmPaymentSeller: jest.fn(),
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
