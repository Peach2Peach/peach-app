import { Locale } from '../i18n'
import { getLocaleLanguage } from '../i18n/getLocaleLanguage'

export const getLocalizedLink = (path: string, locale: Locale) => {
  if (locale !== 'en') return `https://peachbitcoin.com/${getLocaleLanguage(locale)}/${path}`
  return `https://peachbitcoin.com/${path}`
}
