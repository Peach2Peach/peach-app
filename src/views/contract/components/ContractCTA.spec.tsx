import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { ContractCTA } from './ContractCTA'

jest.mock('../../../components/inputs', () => ({
  SlideToUnlock: 'SlideToUnlock',
}))

describe('ContractCTA', () => {
  it('should render the payment confirm slider correctly for the buyer', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2021-01-01').getTime())
    const mockContract = {
      disputeActive: false,
      cancelationRequested: false,
      paymentExpectedBy: new Date('2021-01-02'),
    } as unknown as Contract

    const { toJSON } = render(
      <ContractCTA
        contract={mockContract}
        view="buyer"
        requiredAction="sendPayment"
        actionPending
        postConfirmPaymentBuyer={jest.fn()}
        postConfirmPaymentSeller={jest.fn()}
      />,
      { wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer> },
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
