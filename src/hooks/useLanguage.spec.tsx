import { act, renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore'
import { languageState } from '../utils/i18n'
import { useLanguage } from './useLanguage'

describe('useLanguage', () => {
  it('should return defaults', () => {
    const { result } = renderHook(useLanguage)
    expect(result.current).toEqual({
      locale: 'en',
      updateLocale: expect.any(Function),
    })
  })
  it('should set locale', () => {
    const { result } = renderHook(useLanguage)
    act(() => {
      result.current.updateLocale('es')
    })
    expect(languageState.locale).toBe('es')
  })
  it('should save locale', () => {
    const { result } = renderHook(useLanguage)
    act(() => {
      result.current.updateLocale('es')
    })
    expect(useSettingsStore.getState().locale).toBe('es')
  })
})
