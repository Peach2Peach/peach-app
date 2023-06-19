import { Dispatch, ReducerState, createContext, useContext } from 'react'
import de_CH from '../../i18n/de-CH/text.json'
import de from '../../i18n/de/text.json'
import en from '../../i18n/en/text.json'
import es from '../../i18n/es/text.json'
import fr from '../../i18n/fr/text.json'

const localeMapping: Record<string, Record<string, string>> = {
  en,
  es,
  fr,
  de,
  'de-CH': de_CH,
}
export type Locale = keyof typeof localeMapping

type LanguageState = {
  locale: Locale
}
export const languageState: LanguageState = {
  locale: 'en',
}
export const locales = ['en', 'es', 'fr']
export const setLocaleQuiet = (lcl: Locale) => {
  if (!localeMapping[lcl]) lcl = 'en'
  languageState.locale = lcl
}

/**
 * @description Method to get localized string based on current locale
 * it will use the following fallback order
 * de-CH – language-COUNTRY
 * de    – language
 * en    – default locale
 *
 * if no text can be found, it will return the id of the resource
 * @param id the id of the localized text
 * @param ...args multiple arguments to replace placeholders
 * @returns localized text or id if no text could be found
 */
export const i18n = (id: string, ...args: string[]): string => {
  const locale = languageState.locale.replace('_', '-')
  let text = localeMapping[locale]?.[id]

  if (!text && locale.includes('-')) {
    const language = locale.split('-')[0]
    text = localeMapping[language]?.[id]
  }
  if (!text) text = localeMapping.en[id]

  if (!text) return id

  args.forEach((arg, index) => {
    const regex = new RegExp(`\\$${index}`, 'ug')
    text = text.replace(regex, arg)
  })

  return (text.match(/ /gu) || []).length >= 4 ? text.replace(/ (?=[^ ]*$)/u, ' ') : text
}

i18n.getState = (): LanguageState => languageState
i18n.getLocale = (): string => languageState.locale
i18n.getLocales = (): string[] => locales

/**
 * @description Method to set current locale
 * If locale is not configured, will fallback to `en`
 */
i18n.setLocale = (prev: ReducerState<any>, newState: LanguageState): LanguageState => {
  if (!localeMapping[newState.locale]) newState.locale = 'en'

  languageState.locale = newState.locale
  return newState
}
const dispatch: Dispatch<LanguageState> = () => {}

export const LanguageContext = createContext([i18n.getState(), dispatch] as const)
export const useLanguageContext = () => useContext(LanguageContext)

export default i18n
