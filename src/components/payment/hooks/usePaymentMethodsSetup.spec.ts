import { act, renderHook } from '@testing-library/react-native'
import { paymentData as testPaymentData } from '../../../../tests/unit/data/accountData'
import { getStateMock, headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { account, updateAccount } from '../../../utils/account'
import { usePaymentMethodsSetup } from './usePaymentMethodsSetup'

describe('usePaymentMethodsSetup', () => {
  afterEach(() => {
    jest.clearAllMocks()
    updateAccount({ ...account, paymentData: [] })
  })
  it('should setup header', () => {
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header for account with payment data', () => {
    updateAccount({ ...account, paymentData: testPaymentData })
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header when editing', () => {
    updateAccount({ ...account, paymentData: testPaymentData })
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    act(() => {
      headerState.header().props.icons[0].onPress()
    })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header when coming from settings', () => {
    updateAccount({ ...account, paymentData: testPaymentData })
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
