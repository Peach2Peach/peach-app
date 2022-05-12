import padString from './padString'

/**
 * @description Format date as dd/mm/yyy
 * @param date date to format
 * @returns formatted date as dd/mm/yyy
 */
export const toShortDateFormat = (date: Date) => [
  padString({
    string: String(date.getDate()),
    char: '0',
    length: 2,
    side: 'left'
  }),
  padString({
    string: String(date.getMonth() + 1),
    char: '0',
    length: 2,
    side: 'left'
  }),
  date.getFullYear()
].join('/')

export default toShortDateFormat