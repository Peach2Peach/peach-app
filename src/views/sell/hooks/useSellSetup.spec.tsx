import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useConfigStore } from '../../../store/configStore'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { useSellSetup } from './useSellSetup'

const wrapper = NavigationWrapper
describe('useSellSetup', () => {
  const initialProps = { help: 'sellingBitcoin', hideGoBackButton: false } as const

  it('should set up header correctly', () => {
    renderHook(useSellSetup, { wrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should return isLoading as true if minTradingAmount is 0', () => {
    const { result } = renderHook(useSellSetup, { wrapper, initialProps })
    expect(result.current.isLoading).toBeTruthy()
  })
  it('should return isLoading as true if minTradingAmount is not 0', () => {
    useConfigStore.getState().setMinTradingAmount(100000)
    const { result } = renderHook(useSellSetup, { wrapper, initialProps })
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should return isAmountValid as true if offer preferences allow it', () => {
    useOfferPreferences.getState().setSellAmount(10000, { min: 10, max: 100000 })
    const { result } = renderHook(useSellSetup, { wrapper, initialProps })
    act(() => useOfferPreferences.getState().setSellAmount(9, { min: 10, max: 100000 }))
    expect(result.current.isAmountValid).toBeFalsy()
  })
  it('should navigate to premium screen on next', () => {
    const { result } = renderHook(useSellSetup, { wrapper, initialProps })
    result.current.next()
    expect(navigateMock).toHaveBeenCalledWith('premium')
  })
})
