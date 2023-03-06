import { groupChars } from './groupChars'

/**
 * @description Method to group number in thousands
 * @returns number grouped in thousands
 */
export const thousands = (number: number): string => groupChars(number.toString(), 3)
