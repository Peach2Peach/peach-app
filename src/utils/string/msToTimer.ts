import { padString } from './padString'

/**
 * @description Method to turn a countdown in ms to a human readable timer
 * @param ms timer in ms
 * @returns timer with format hh:mm:ss
 */
export const msToTimer = (ms: number): string => {
  const hours = Math.floor(ms / 1000 / 60 / 60)
  ms -= hours * 60 * 60 * 1000
  const minutes = Math.floor(ms / 1000 / 60)
  ms -= minutes * 60 * 1000
  const seconds = Math.floor(ms / 1000)
  ms -= seconds * 1000

  return [hours, minutes, seconds]
    .map((num) =>
      padString({
        string: num.toString(),
        length: 2,
        char: '0',
        side: 'left',
      }),
    )
    .join(':')
}
