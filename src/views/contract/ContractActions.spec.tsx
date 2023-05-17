import { ContractActions } from './ContractActions'
import { createRenderer } from 'react-test-renderer/shallow'

describe('ContractActions', () => {
  const renderer = createRenderer()
  const contract = {
    tradeStatus: 'refundOrReviveRequired',
    disputeWinner: 'seller',
  } as Contract
  const view = 'buyer'
  const requiredAction = 'none'
  const actionPending = false
  const postConfirmPaymentBuyer = jest.fn()
  const postConfirmPaymentSeller = jest.fn()
  it('should show the dispute sliders when the contract is in the refundOrReviveRequired state', () => {
    renderer.render(
      <ContractActions
        {...{ contract, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
      />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should not show the dispute sliders when there is no dispute winner', () => {
    renderer.render(
      <ContractActions
        {...{
          contract: {
            ...contract,
            disputeWinner: undefined,
          },
          view,
          requiredAction,
          actionPending,
          postConfirmPaymentBuyer,
          postConfirmPaymentSeller,
        }}
      />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
