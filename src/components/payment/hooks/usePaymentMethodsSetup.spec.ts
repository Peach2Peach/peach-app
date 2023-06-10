import { act, renderHook } from '@testing-library/react-native'
import { usePaymentMethodsSetup } from './usePaymentMethodsSetup'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { account, updateAccount } from '../../../utils/account'
import { paymentData as testPaymentData } from '../../../../tests/unit/data/accountData'

describe('useOfferDetailsSetup', () => {
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
    renderHook(usePaymentMethodsSetup, { wrapper: NavigationWrapper })
    act(() => {
      headerState.header().props.icons[0].onPress()
    })
    expect(headerState.header()).toMatchSnapshot()
  })
})
