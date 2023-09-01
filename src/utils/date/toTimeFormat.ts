import { padString } from '../string/padString'
import { isDefined } from '../validation'

export const toTimeFormat = (hours: number, minutes: number, seconds?: number) =>
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
    isDefined(seconds)
      ? padString({
        string: String(seconds),
        char: '0',
        length: 2,
        side: 'left',
      })
      : undefined,
  ]
    .filter(isDefined)
    .join(':')
