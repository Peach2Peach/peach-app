import { padString } from '../string/padString'

export const toTimeFormat = (hours: number, minutes: number) =>
  [
    padString({
      string: String(hours),
      char: '0',
      length: 2,
      side: 'left',
    }),
    padString({
      string: String(minutes),
      char: '0',
      length: 2,
      side: 'left',
    }),
  ].join(':')
