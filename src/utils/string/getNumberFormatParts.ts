import { groupChars } from './groupChars'

/**
 * @description This method converts numbers to number string parts
 * precision: 8 decimals after comma
 * 0: integer
 * 1: decimals that are only 0s after comma
 * 2: decimals that starting from the first decimal that is not 0
 * @example
 * [1, '00 000 000', '']
 * [1, '00 00', '1 345']
 * [1, '', '12 345 678']
 * [10, '', '12 345 678']
 */
export const getNumberFormatParts = (num: number): string[] => {
  const [integer, decimal] = num.toFixed(8).split('.')

  const groupedDecimals = groupChars(decimal, 3)
  const cutIndex = Math.abs(Number(num)) >= 1 ? 0 : groupedDecimals.split('').findIndex((digit) => /[1-9]/u.test(digit))

  return [
    groupChars(integer, 3),
    groupedDecimals.slice(0, cutIndex),
    groupedDecimals.slice(cutIndex, groupedDecimals.length),
  ]
}
