import { ContractActions } from './ContractActions'
import { createRenderer } from 'react-test-renderer/shallow'

const useContractContextMock = jest.fn()
jest.mock('./context', () => ({
  useContractContext: () => useContractContextMock(),
}))

describe('ContractActions', () => {
  const renderer = createRenderer()
  const contract = {
    tradeStatus: 'refundOrReviveRequired',
    disputeWinner: 'seller',
  } as Contract
  useContractContextMock.mockReturnValue({ contract })
  const requiredAction = 'none' as const
  const actionPending = false
  const postConfirmPaymentBuyer = jest.fn()
  const postConfirmPaymentSeller = jest.fn()
  const props = { requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
  it('should show the dispute sliders when the contract is in the refundOrReviveRequired state', () => {
    renderer.render(<ContractActions {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should not show the dispute sliders when there is no dispute winner', () => {
    useContractContextMock.mockReturnValueOnce({
      contract: {
        ...contract,
        disputeWinner: undefined,
      },
    })
    renderer.render(<ContractActions {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should show the provide email button when the contract requires an email', () => {
    useContractContextMock.mockReturnValueOnce({ contract: { isEmailRequired: true } })
    renderer.render(<ContractActions {...props} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
