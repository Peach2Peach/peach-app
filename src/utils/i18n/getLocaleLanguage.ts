import { Locale } from '.'
export const getLocaleLanguage = (locale: Locale) => locale.replace('_', '-').split('-')[0]
