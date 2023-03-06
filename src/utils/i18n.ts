import en from '../i18n/en/text.json'
import de from '../i18n/de/text.json'
import de_CH from '../i18n/de-CH/text.json'
import { ReducerState } from 'react'
interface Properties {
  [key: string]: string
}
interface PropertiesMap {
  [key: string]: Properties
}

const properties: PropertiesMap = {
  en,
  de,
  'de-CH': de_CH,
}

export const locales = ['en', 'de', 'de-CH']
export let locale: string = 'en'
export const setLocaleQuiet = (lcl: string) => (locale = lcl)

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
  let text = properties[locale][id]

  if (!text && locale.includes('-')) {
    const language = locale.split('-')[0]
    text = properties[language][id]
  }
  if (!text) text = properties.en[id]

  if (!text) return id

  args.forEach((arg, index) => {
    const regex = new RegExp(`\\$${index}`, 'ug')
    text = text.replace(regex, arg)
  })

  return (text.match(/ /gu) || []).length >= 4 ? text.replace(/ (?=[^ ]*$)/u, ' ') : text
}

interface i18nState {
  locale: string
}

/**
 * @description Method to get current locale
 * @returns current locale
 */
i18n.getLocale = (): string => locale

/**
 * @description Method to get all registered locales
 * @returns registered locales
 */
i18n.getLocales = (): string[] => locales

/**
 * @description Method to set current locale
 * If locale is not configured, will fallback to `en`
 * @param state the state object (can be ignored)
 * @param newState the new state object
 * @returns i18n state
 */
i18n.setLocale = (state: ReducerState<any>, newState: i18nState): i18nState => {
  locale = newState.locale

  if (!properties[locale]) locale = 'en'

  return {
    locale,
  }
}

export default i18n
