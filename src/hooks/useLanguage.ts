import { useSettingsStore } from '../store/settingsStore'
import { Locale, useLanguageContext } from '../utils/i18n'

export const useLanguage = () => {
  const [{ locale }, updateLanguageContext] = useLanguageContext()
  const setLocale = (l: Locale) => updateLanguageContext({ locale: l })
  const setLocaleStore = useSettingsStore((state) => state.setLocale)

  const saveLocale = (l: Locale) => {
    setLocaleStore(l)
  }

  return { locale, setLocale, saveLocale }
}
