/**
 * @description Method to get values of A that don't exist in B
 * @param a array A
 * @param b array B
 * @returns intersection of A and B
 */
export const diff = (a: string[], b: string[]) =>
  a.filter(val => b.indexOf(val) === -1)

export default diff