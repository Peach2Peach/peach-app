import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, setOptionsMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { usePaymentDetailsSetup } from './usePaymentDetailsSetup'

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

describe('usePaymentDetailsSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setOptionsMock({ header: { title: '', icons: [] } })
  })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return paymentMethod, onSubmit, currencies, data', () => {
    const { result } = renderHook(usePaymentDetailsSetup, { wrapper })
    expect(result.current).toEqual({
      paymentMethod: 'revolut',
      onSubmit: expect.any(Function),
      currencies: ['EUR'],
      data: {
        id: '1',
        type: 'revolut',
        name: 'Revolut',
        currencies: ['EUR'],
        origin: 'paymentMethod',
      },
    })
  })
  it('should set the header', () => {
    renderHook(usePaymentDetailsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set the header if no id is present and the paymentMethod is not revolut', () => {
    useRouteMock.mockReturnValueOnce({
      params: {
        origin: 'paymentMethod',
        // @ts-expect-error
        paymentData: {
          type: 'sepa',
          name: 'SEPA',
          currencies: ['EUR'],
          origin: 'paymentMethod',
        },
      },
    })
    renderHook(usePaymentDetailsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show the delete PM popup when the delete icon is pressed', () => {
    renderHook(usePaymentDetailsSetup, { wrapper })

    headerState.header().props.icons?.[1].onPress()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: i18n('help.paymentMethodDelete.title'),
      content: expect.any(Object),
      visible: true,
      level: 'ERROR',
      action1: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: i18n('neverMind'),
      },
      action2: {
        callback: expect.any(Function),
        icon: 'trash',
        label: i18n('delete'),
      },
    })
    expect(usePopupStore.getState().content).toMatchInlineSnapshot('<DeletePaymentMethodConfirm />')
  })
  it('should add the payment method when the form is submitted', () => {
    const { result } = renderHook(usePaymentDetailsSetup, { wrapper })
    const paymentMethod = {
      id: '1',
      label: 'Revolut',
      type: 'revolut',
      currencies: ['EUR'],
    } satisfies PaymentData
    act(() => {
      result.current.onSubmit(paymentMethod)
    })
    expect(account.paymentData).toContainEqual(paymentMethod)
  })
  it('should go to the origin when the form is submitted', () => {
    const { result } = renderHook(usePaymentDetailsSetup, { wrapper })
    act(() => {
      result.current.onSubmit({ id: '1', label: 'Revolut', type: 'revolut', currencies: ['EUR'] })
    })
    expect(goToOriginMock).toHaveBeenCalledWith('paymentMethod')
  })
})
