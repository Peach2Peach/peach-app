import { groupChars } from './groupChars'

export const thousands = (number: number, delimiter = ' '): string => {
  const [integer, decimal] = number.toString().split('.')
  if (decimal === undefined) return groupChars(integer, 3, delimiter)
  return `${groupChars(integer.toString(), 3, delimiter)}.${decimal}`
}
