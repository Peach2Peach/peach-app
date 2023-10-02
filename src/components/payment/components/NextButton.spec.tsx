import { act, fireEvent, render } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { getStateMock, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'

import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePopupStore } from '../../../store/usePopupStore'
import { NextButton } from './NextButton'

const wrapper = NavigationAndQueryClientWrapper
const paymentMethodInfo = { forbidden: { buy: [], sell: [] } }
const useUserPaymentMethodInfoMock = jest
  .fn()
  .mockReturnValue({ data: paymentMethodInfo, isLoading: false, error: undefined })
jest.mock('../../../hooks/query/useUserPaymentMethodInfo', () => ({
  useUserPaymentMethodInfo: () => useUserPaymentMethodInfoMock(),
}))

describe('NextButton', () => {
  afterEach(() => {
    act(() => {
      useOfferPreferences.setState((prev) => ({
        canContinue: { ...prev.canContinue, paymentMethods: true },
        meansOfPayment: {
          EUR: ['paypal'],
        },
      }))
    })
  })
  it('renders correctly', () => {
    const { toJSON } = render(<NextButton />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    useOfferPreferences.setState((prev) => ({ canContinue: { ...prev.canContinue, paymentMethods: false } }))
    const { toJSON } = render(<NextButton />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should go to the sell summary when coming from the premium screen', () => {
    getStateMock.mockReturnValue({ routes: [{ name: 'premium' }, { name: 'paymentMethods' }] })
    const { getByText } = render(<NextButton />, { wrapper })
    fireEvent.press(getByText('next'))
    expect(navigateMock).toHaveBeenCalledWith('sellSummary')
  })
  it('should go to the buy summary when not coming from the premium screen', () => {
    getStateMock.mockReturnValue({ routes: [{ name: 'buy' }, { name: 'paymentMethods' }] })
    const { getByText } = render(<NextButton />, { wrapper })
    fireEvent.press(getByText('next'))
    expect(navigateMock).toHaveBeenCalledWith('buySummary')
  })
  it('should show forbidden payment method popup when selected one', () => {
    const paymentMethodInfoForbidden = { forbidden: { buy: ['paypal'], sell: [] } }
    useUserPaymentMethodInfoMock.mockReturnValueOnce({
      data: paymentMethodInfoForbidden,
      isLoading: false,
      error: undefined,
    })

    getStateMock.mockReturnValue({ routes: [{ name: 'buy' }, { name: 'paymentMethods' }] })
    const { getByText } = render(<NextButton />, { wrapper })
    fireEvent.press(getByText('next'))
    expect(navigateMock).not.toHaveBeenCalled()
    expect(usePopupStore.getState().visible).toBe(true)
    expect(render(usePopupStore.getState().popupComponent || <></>, { wrapper }).toJSON()).toMatchSnapshot()
  })
})
