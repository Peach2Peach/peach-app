import { act, renderHook } from '@testing-library/react-native'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { NavigationWrapper, getStateMock, headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { usePaymentMethodsSetup } from './usePaymentMethodsSetup'

describe('usePaymentMethodsSetup', () => {
  afterEach(() => {
    usePaymentDataStore.getState().reset()
  })
  it('should setup header', () => {
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header for account with payment data', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header when editing', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    act(() => {
      headerState.header().props.icons[0].onPress()
    })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header when coming from settings', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    getStateMock.mockReturnValueOnce({
      routes: [{ name: 'settings' }, { name: 'paymentMethods' }],
    })
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should not be editing by default', () => {
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(result.current).toBe(false)
  })
  it('should be editing when origin is settings', () => {
    getStateMock.mockReturnValueOnce({
      routes: [{ name: 'settings' }, { name: 'paymentMethods' }],
    })
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(result.current).toBe(true)
  })
})
