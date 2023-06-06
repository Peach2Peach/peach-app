import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { ContractCTA } from './ContractCTA'

jest.mock('../../../components/inputs', () => ({
  SlideToUnlock: 'SlideToUnlock',
}))

const useContractContextMock = jest.fn()
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))

const navigationWrapper = ({ children }: ComponentProps) => <NavigationContainer>{children}</NavigationContainer>

describe('ContractCTA', () => {
  it('should render the payment confirm slider correctly for the buyer', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2021-01-01').getTime())
    const mockContract = {
      disputeActive: false,
      cancelationRequested: false,
      paymentExpectedBy: new Date('2021-01-02'),
    } as unknown as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract, view: 'buyer' })
    const { toJSON } = render(
      <ContractCTA
        requiredAction="sendPayment"
        actionPending
        postConfirmPaymentBuyer={jest.fn()}
        postConfirmPaymentSeller={jest.fn()}
      />,
      { wrapper: navigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should not show the confirm payment slider when the payment is too late', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2021-01-03').getTime())
    const mockContract = {
      disputeActive: true,
      cancelationRequested: false,
      paymentExpectedBy: new Date('2021-01-02'),
    } as unknown as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract, view: 'buyer' })
    const { toJSON } = render(
      <ContractCTA
        requiredAction="sendPayment"
        actionPending
        postConfirmPaymentBuyer={jest.fn()}
        postConfirmPaymentSeller={jest.fn()}
      />,
      { wrapper: navigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly when a cancelation is requested', () => {
    const mockContract = {
      disputeActive: false,
      cancelationRequested: true,
      paymentExpectedBy: new Date('2021-01-02'),
      paymentConfirmed: false,
    } as unknown as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract, view: 'buyer' })
    const { toJSON } = render(
      <ContractCTA
        requiredAction="sendPayment"
        actionPending
        postConfirmPaymentBuyer={jest.fn()}
        postConfirmPaymentSeller={jest.fn()}
      />,
      { wrapper: navigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render payment confirm slider correctly for the seller', () => {
    const mockContract = {
      disputeActive: false,
      cancelationRequested: false,
      paymentExpectedBy: new Date('2021-01-02'),
      paymentConfirmed: false,
    } as unknown as Contract
    useContractContextMock.mockReturnValueOnce({ contract: mockContract, view: 'seller' })
    const { toJSON } = render(
      <ContractCTA
        requiredAction="confirmPayment"
        actionPending
        postConfirmPaymentBuyer={jest.fn()}
        postConfirmPaymentSeller={jest.fn()}
      />,
      { wrapper: navigationWrapper },
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
