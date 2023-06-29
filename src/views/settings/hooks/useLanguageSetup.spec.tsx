import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, goBackMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/useSettingsStore'
import { useLanguageSetup } from './useLanguageSetup'

describe('useLanguageSetup', () => {
  it('should return defaults', () => {
    const { result } = renderHook(useLanguageSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      locale: 'en',
      saveLocale: expect.any(Function),
      setLocale: expect.any(Function),
    })
  })
  it('should save locale and go back', () => {
    const { result } = renderHook(useLanguageSetup, { wrapper: NavigationWrapper })
    result.current.saveLocale('es')
    expect(useSettingsStore.getState().locale).toBe('es')
    expect(goBackMock).toHaveBeenCalled()
  })
})
