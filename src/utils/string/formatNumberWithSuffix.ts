import { round } from '../math'

export const formatNumberWithSuffix = (number: number) => {
  const suffixes = ['', 'k', 'M']
  let suffixIndex = 0
  while (number >= 1000) {
    number /= 1000
    suffixIndex++
  }
  const suffix = suffixIndex
  return suffix ? String(round(number, 1)) + suffixes[suffixIndex] : number.toFixed()
}
