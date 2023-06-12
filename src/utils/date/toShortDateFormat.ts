import { padString } from '../string/padString'

/**
 * @description Format date as hh:mm
 */
export const toTimeFormat = (date: Date) =>
  [
    padString({
      string: String(date.getHours()),
      char: '0',
      length: 2,
      side: 'left',
    }),
    padString({
      string: String(date.getMinutes()),
      char: '0',
      length: 2,
      side: 'left',
    }),
  ].join(':')

/**
 * @description Format date as dd/mm/yyyy (hh:mm)
 */
export const toShortDateFormat = (date: Date, showTime = false) =>
  [
    padString({
      string: String(date.getDate()),
      char: '0',
      length: 2,
      side: 'left',
    }),
    padString({
      string: String(date.getMonth() + 1),
      char: '0',
      length: 2,
      side: 'left',
    }),
    date.getFullYear(),
  ].join('/') + (showTime ? ` ${toTimeFormat(date)}` : '')
