import { groupChars } from './groupChars'

export const thousands = (number: number, delimiter = ' '): string => groupChars(number.toString(), 3, delimiter)
