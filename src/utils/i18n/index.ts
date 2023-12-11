import { NETWORK } from '@env'
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
  pt,
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
  localeMapping['pt-BR'] = ptBR
  localeMapping.ru = ru
  localeMapping.uk = uk
  localeMapping.raw = {}
}
const locales = keys(localeMapping)

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

i18n.getLocales = () => locales

i18n.setLocale = (newLocale: Locale) => {
  if (!localeMapping[newLocale]) newLocale = 'en'
  languageState.locale = newLocale
}

export default i18n
