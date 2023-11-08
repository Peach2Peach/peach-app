import { NETWORK } from '@env'
import { Dispatch, ReducerState, createContext, useContext } from 'react'
import de from '../../i18n/de'
import elGR from '../../i18n/el-GR'
import en from '../../i18n/en'
import es from '../../i18n/es'
import fr from '../../i18n/fr'
import hu from '../../i18n/hu'
import it from '../../i18n/it'
import nl from '../../i18n/nl'
import pl from '../../i18n/pl'
import pt from '../../i18n/pt'
import ptBR from '../../i18n/pt-BR'
import ru from '../../i18n/ru'
import sw from '../../i18n/sw'
import tr from '../../i18n/tr'
import uk from '../../i18n/uk'
import { keys } from '../object'
import { getLocaleLanguage } from './getLocaleLanguage'

const localeMapping: Record<string, Record<string, string>> = {
  en,
  es,
  fr,
  it,
  de,
  nl,
  'el-GR': elGR,
  tr,
  sw,
  hu,
}

export type Locale = keyof typeof localeMapping

type LanguageState = {
  locale: Locale
}
export const languageState: LanguageState = {
  locale: 'en',
}
if (NETWORK !== 'bitcoin') {
  localeMapping.pl = pl
  localeMapping.pt = pt
  localeMapping['pt-BR'] = ptBR
  localeMapping.ru = ru
  localeMapping.uk = uk
  localeMapping.raw = {}
}
export const locales = keys(localeMapping)

export const setLocaleQuiet = (lcl: Locale) => {
  if (!localeMapping[lcl]) lcl = 'en'
  languageState.locale = lcl
}

const i18n = (id: string, ...args: string[]) => {
  const locale = languageState.locale.replace('_', '-')
  if (locale === 'raw') return id
  let text = localeMapping[locale]?.[id]

  if (!text && locale.includes('-')) {
    const language = getLocaleLanguage(locale)
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

i18n.break = (id: string, ...args: string[]) => i18n(id, ...args).replace(/ /gu, ' ')

i18n.getState = (): LanguageState => languageState
i18n.getLocale = () => languageState.locale
i18n.getLocales = () => locales

i18n.setLocale = (prev: ReducerState<any>, newState: LanguageState): LanguageState => {
  if (!localeMapping[newState.locale]) newState.locale = 'en'

  languageState.locale = newState.locale
  return newState
}
const dispatch: Dispatch<LanguageState> = () => {}

export const LanguageContext = createContext([i18n.getState(), dispatch] as const)
export const useLanguageContext = () => useContext(LanguageContext)

export default i18n
