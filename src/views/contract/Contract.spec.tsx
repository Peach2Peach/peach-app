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
  isEmailRequired: false,
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
  it('should show the provide email button when the contract requires an email', () => {
    useContractSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      contract: {
        ...defaultReturnValue.contract,
        // @ts-ignore
        isEmailRequired: true,
      },
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should show the dispute sliders when the contract is in the refundOrReviveRequired state and there is a dispute winner', () => {
    useContractSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      contract: {
        ...defaultReturnValue.contract,
        tradeStatus: 'refundOrReviveRequired',
        disputeWinner: 'seller',
      },
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should not show the dispute sliders when there is no dispute winner', () => {
    useContractSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      contract: {
        ...defaultReturnValue.contract,
        tradeStatus: 'refundOrReviveRequired',
        disputeWinner: undefined,
      },
    })
    renderer.render(<Contract />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
