import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { usePaymentMethodFormSetup } from './usePaymentMethodFormSetup'

const useRouteMock = jest.fn(() => ({
  params: {
    origin: 'paymentMethod',
    paymentData: {
      id: '1',
      type: 'revolut',
      name: 'Revolut',
      currencies: ['EUR'],
      origin: 'paymentMethod',
    },
  },
}))

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const goToOriginMock = jest.fn()
jest.mock('../../../hooks/useGoToOrigin', () => ({
  useGoToOrigin: jest.fn(() => goToOriginMock),
}))

const wrapper = NavigationWrapper

describe('usePaymentMethodFormSetup', () => {
  beforeEach(() => {
    setOptionsMock({ header: { title: '', icons: [] } })
    usePopupStore.setState(defaultPopupState)
  })
  it('should return paymentMethod, onSubmit, currencies, data', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    expect(result.current).toEqual({
      onSubmit: expect.any(Function),
      data: {
        id: '1',
        type: 'revolut',
        name: 'Revolut',
        currencies: ['EUR'],
        origin: 'paymentMethod',
      },
    })
  })
  it('should add the payment method when the form is submitted', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    const paymentMethod = {
      id: '1',
      label: 'Revolut',
      type: 'revolut',
      currencies: ['EUR'],
    } satisfies PaymentData
    act(() => {
      result.current.onSubmit(paymentMethod)
    })
    expect(usePaymentDataStore.getState().getPaymentData(paymentMethod.id)).toEqual(paymentMethod)
  })
  it('should automatically select the payment method', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    useOfferPreferences.setState({ preferredPaymentMethods: {} })
    const paymentMethod = {
      id: '1',
      label: 'Revolut',
      type: 'revolut',
      currencies: ['EUR'],
    } satisfies PaymentData
    act(() => {
      result.current.onSubmit(paymentMethod)
    })
    expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({ revolut: '1' })
  })
  it('should go to the origin when the form is submitted', () => {
    const { result } = renderHook(usePaymentMethodFormSetup, { wrapper })
    act(() => {
      result.current.onSubmit({ id: '1', label: 'Revolut', type: 'revolut', currencies: ['EUR'] })
    })
    expect(goToOriginMock).toHaveBeenCalledWith('paymentMethod')
  })
})
