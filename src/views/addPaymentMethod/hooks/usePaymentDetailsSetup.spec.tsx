import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { OverlayContext, defaultOverlay } from '../../../contexts/overlay'
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

let overlayState = { ...defaultOverlay }
const updateOverlay = jest.fn((state) => {
  overlayState = state
})

const wrapper = ({ children }: { children: JSX.Element }) => (
  <NavigationWrapper>
    <OverlayContext.Provider value={[overlayState, updateOverlay]}>{children}</OverlayContext.Provider>
  </NavigationWrapper>
)

describe('usePaymentDetailsSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useHeaderState.setState({ title: '', icons: [] })
    overlayState = { ...defaultOverlay }
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
    expect(useHeaderState.getState().title).toEqual(i18n('paymentMethod.edit.title', i18n('paymentMethod.revolut')))
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[1].id).toBe('trash')
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
    expect(useHeaderState.getState().title).toEqual(i18n('paymentMethod.select.title', i18n('paymentMethod.sepa')))
    expect(useHeaderState.getState().icons).toStrictEqual([])
  })
  it('should show the delete PM overlay when the delete icon is pressed', () => {
    renderHook(usePaymentDetailsSetup, { wrapper })

    act(() => {
      useHeaderState.getState().icons?.[1].onPress?.()
    })
    expect(overlayState).toEqual({
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
    expect(overlayState.content).toMatchInlineSnapshot('<DeletePaymentMethodConfirm />')
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
