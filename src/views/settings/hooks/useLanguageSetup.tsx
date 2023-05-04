import { useMemo } from 'react'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n, { Locale, useLanguageContext } from '../../../utils/i18n'

export const useLanguageSetup = () => {
  const [{ locale }, updateLanguageContext] = useLanguageContext()
  const navigation = useNavigation()
  const setLocale = (l: Locale) => updateLanguageContext({ locale: l })
  const setLocaleStore = useSettingsStore((state) => state.setLocale)

  useHeaderSetup({ title: i18n('language') })

  const saveLocale = (l: Locale) => {
    setLocaleStore(l)
    navigation.goBack()
  }

  return { locale, setLocale, saveLocale }
}
