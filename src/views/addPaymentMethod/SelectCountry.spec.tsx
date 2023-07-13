import { setPaymentMethods } from '../../constants'
import { SelectCountry } from './SelectCountry'
import { fireEvent, render } from '@testing-library/react-native'
import { navigateMock, NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { PrimaryButton } from '../../components'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      origin: 'paymentMethod',
      selectedCurrency: 'EUR',
    },
  })),
}))

describe('SelectCountry', () => {
  beforeAll(() => {
    setPaymentMethods([
      {
        id: 'giftCard.amazon',
        currencies: ['EUR'],
        countries: ['DE', 'IT', 'ES', 'FR'],
        anonymous: true,
      },
    ])
  })

  it('should render correctly', () => {
    const { toJSON } = render(<SelectCountry />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should go to payment method form', () => {
    const { getByText } = render(<SelectCountry />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText('Germany'))
    fireEvent.press(getByText('next'))

    expect(navigateMock).toHaveBeenCalledWith('paymentMethodForm', {
      origin: 'paymentMethod',
      paymentData: {
        type: 'giftCard.amazon',
        label: 'Amazon Gift Card (DE)',
        currencies: ['EUR'],
        country: 'DE',
      },
    })
  })

  it('should go to payment method form with incremented label', () => {
    usePaymentDataStore.getState().addPaymentData({
      type: 'giftCard.amazon.DE',
      label: 'Amazon Gift Card (DE)',
      currencies: ['EUR'],
      country: 'DE',
      id: '1',
    })
    const { getByText } = render(<SelectCountry />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText('Germany'))
    fireEvent.press(getByText('next'))

    expect(navigateMock).toHaveBeenCalledWith('paymentMethodForm', {
      origin: 'paymentMethod',
      paymentData: {
        type: 'giftCard.amazon',
        label: 'Amazon Gift Card (DE) #2',
        currencies: ['EUR'],
        country: 'DE',
      },
    })
  })

  it('should not go to payment method form if no country is selected', () => {
    const { getByText, UNSAFE_getByType } = render(<SelectCountry />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText('next'))

    expect(navigateMock).not.toHaveBeenCalled()

    const nextButton = UNSAFE_getByType(PrimaryButton)
    expect(nextButton.props.disabled).toBe(true)
    nextButton.props.onPress()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
