/**
 * @description Method to get intersecting values between A and B
 * @param a array A
 * @param b array B
 * @returns intersection of A and B
 */
export const intersect = <T>(a: T[], b: T[]): T[] => a.filter((val) => b.includes(val))
