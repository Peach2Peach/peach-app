import { useReducer } from 'react'
import { act, renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore'
import i18n, { LanguageContext } from '../utils/i18n'
import { useLanguage } from './useLanguage'

const Wrapper = ({ children }: ComponentProps) => {
  const [languageState, updateLanguage] = useReducer(i18n.setLocale, i18n.getState())

  return <LanguageContext.Provider value={[languageState, updateLanguage]}>{children}</LanguageContext.Provider>
}
describe('useLanguage', () => {
  it('should return defaults', () => {
    const { result } = renderHook(useLanguage, { wrapper: Wrapper })
    expect(result.current).toEqual({
      locale: 'en',
      saveLocale: expect.any(Function),
      setLocale: expect.any(Function),
    })
  })
  it('should set locale', () => {
    const { result } = renderHook(useLanguage, { wrapper: Wrapper })
    act(() => {
      result.current.setLocale('es')
    })
    expect(i18n.getLocale()).toBe('es')
  })
  it('should save locale', () => {
    const { result } = renderHook(useLanguage, { wrapper: Wrapper })
    act(() => {
      result.current.saveLocale('es')
    })
    expect(useSettingsStore.getState().locale).toBe('es')
  })
})
