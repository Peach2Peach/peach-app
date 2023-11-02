import i18n from '../i18n'
import { getDateSuffix } from './getDateSuffix'

/**
 * @description Format date as "nov 28th, 2022"
 */
export const toDateFormat = (date: Date): string => {
  const day = `${date.getDate()}${getDateSuffix(date.getDate())}`
  return `${i18n(`month.short.${date.getMonth()}`)} ${day}, ${date.getFullYear()}`
}
