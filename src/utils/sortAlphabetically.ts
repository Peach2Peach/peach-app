import { info } from './log'
// order an array of objects with name
export const sortAlphabetically = (a: string, b: string) => {
  info('what is ' + a < b)
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}
