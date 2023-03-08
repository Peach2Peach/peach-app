/**
 * @description Method to get values of A that don't exist in B
 * @param a array A
 * @param b array B
 * @returns intersection of A and B
 */
export const diff = <T>(a: T[], b: T[]): T[] => a.filter((val) => !b.includes(val))
