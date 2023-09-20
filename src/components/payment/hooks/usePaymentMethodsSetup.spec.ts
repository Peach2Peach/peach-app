import { act, renderHook } from '@testing-library/react-native'
import { validCashData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { NavigationWrapper, getStateMock, headerState, pushMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { usePaymentMethodsSetup } from './usePaymentMethodsSetup'

const currentRouteName = 'buyPreferences'
const useRouteMock = jest.fn(() => ({ name: currentRouteName }))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))
const wrapper = NavigationWrapper
describe('usePaymentMethodsSetup', () => {
  beforeEach(() => {
    usePaymentDataStore.getState().reset()
  })
  it('should setup header', () => {
    renderHook(usePaymentMethodsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header for account with payment data', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    renderHook(usePaymentMethodsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should setup header when editing', () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    renderHook(usePaymentMethodsSetup, { wrapper })
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
    renderHook(usePaymentMethodsSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should not be editing by default', () => {
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper })
    expect(result.current.isEditing).toBe(false)
  })
  it('should be editing when origin is settings', () => {
    getStateMock.mockReturnValueOnce({
      routes: [{ name: 'settings' }, { name: 'paymentMethods' }],
    })
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper })
    expect(result.current.isEditing).toBe(true)
  })
  it('should navigate to paymentMethodForm if PM is not a cash trade', () => {
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper })
    result.current.editItem(validSEPAData)
    expect(pushMock).toHaveBeenCalledWith('paymentMethodForm', {
      paymentData: validSEPAData,
      origin: currentRouteName,
    })
  })
  it('should navigate to meetupScreen if PM is a cash trade', () => {
    const { result } = renderHook(usePaymentMethodsSetup, { wrapper })
    result.current.editItem(validCashData)
    expect(pushMock).toHaveBeenCalledWith('meetupScreen', {
      eventId: validCashData.id.replace('cash.', ''),
      deletable: true,
      origin: currentRouteName,
    })
  })
})
