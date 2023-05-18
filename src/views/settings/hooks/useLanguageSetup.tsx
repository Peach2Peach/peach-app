import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useLanguage } from '../../../hooks/useLanguage'
import i18n from '../../../utils/i18n'

export const useLanguageSetup = () => {
  const { locale, setLocale, saveLocale } = useLanguage()
  const navigation = useNavigation()
  useHeaderSetup({ title: i18n('language') })
  return {
    locale,
    setLocale,
    saveLocale: (lcl: string) => {
      saveLocale(lcl)
      navigation.goBack()
    },
  }
}
