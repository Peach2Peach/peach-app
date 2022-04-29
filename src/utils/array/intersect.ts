/**
 * @description Method to get intersecting values between A and B
 * @param a array A
 * @param b array B
 * @returns intersection of A and B
 */
export const intersect = (a: string[], b: string[]) =>
  a.filter(val => b.indexOf(val) !== -1)

export default intersect