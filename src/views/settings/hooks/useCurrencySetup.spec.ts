import { useCurrencySetup } from './useCurrencySetup'
import { act, renderHook } from '@testing-library/react-native'
import { goBackMock, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { useSettingsStore } from '../../../store/settingsStore'

describe('useCurrencySetup', () => {
  beforeEach(() => {
    useBitcoinStore.setState({ currency: 'USD' })
    useSettingsStore.setState({ displayCurrency: 'USD' })
  })
  it('should return the correct values', () => {
    const { result } = renderHook(useCurrencySetup, { wrapper: NavigationWrapper })
    expect(result.current.currency).toBe('USD')
    expect(result.current.goBack).toBeInstanceOf(Function)
    expect(result.current.updateCurrency).toBeInstanceOf(Function)
  })

  it('should update the currency', () => {
    const { result } = renderHook(useCurrencySetup, { wrapper: NavigationWrapper })
    act(() => {
      result.current.updateCurrency('EUR')
    })
    expect(result.current.currency).toBe('EUR')
    expect(useBitcoinStore.getState().currency).toBe('EUR')
    expect(useSettingsStore.getState().displayCurrency).toBe('EUR')
  })

  it('should go back', () => {
    const { result } = renderHook(useCurrencySetup, { wrapper: NavigationWrapper })
    result.current.goBack()
    expect(goBackMock).toHaveBeenCalled()
  })
})
