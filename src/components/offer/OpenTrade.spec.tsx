import { OpenTrade } from './OpenTrade'
import { createRenderer } from 'react-test-renderer/shallow'

const getPaymentDataByMethodMock = jest.fn().mockReturnValue({
  label: 'DE1234567890',
  value: 'DE1234567890',
})

jest.mock('../../utils/offer', () => ({
  getPaymentDataByMethod: (...args: any) => getPaymentDataByMethodMock(...args),
}))

describe('OpenTrade', () => {
  const renderer = createRenderer()
  const mockContract = {
    releaseTxId: undefined,
    escrow: '123',
    disputeActive: false,
    price: 21,
    currency: 'EUR',
    paymentMethod: 'sepa',
    paymentData: {
      iban: 'DE1234567890',
      bic: 'DEUTDEFF',
      name: 'John Doe',
      reference: '1234567890',
    },
  } as unknown as Contract
  it('renders correctly', () => {
    renderer.render(<OpenTrade view="buyer" contract={mockContract} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show the CashTradeDetails when the payment method is cash', () => {
    renderer.render(<OpenTrade view="buyer" contract={{ ...mockContract, paymentMethod: 'cash.de' }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show the CashTradeDetails when the view is seller and there is stored paymentdata', () => {
    renderer.render(<OpenTrade view="seller" contract={{ ...mockContract, paymentMethod: 'cash.de' }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show the label of the stored payment data when the view is seller and there is stored paymentdata', () => {
    renderer.render(<OpenTrade view="seller" contract={mockContract} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should not show the label if there is not paymentData on the contract', () => {
    renderer.render(<OpenTrade view="seller" contract={{ ...mockContract, paymentData: undefined }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should display the label correctly when there is a dispute', () => {
    renderer.render(<OpenTrade view="seller" contract={{ ...mockContract, disputeActive: true }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should show the ErrorBox when the paymentData could not be decrypted', () => {
    renderer.render(
      <OpenTrade view="seller" contract={{ ...mockContract, paymentData: undefined, error: 'DECRYPTION_ERROR' }} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('show the dispute lost status to the seller', () => {
    renderer.render(
      <OpenTrade view="seller" contract={{ ...mockContract, tradeStatus: 'releaseEscrow', disputeWinner: 'buyer' }} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
