import { intersect } from '../array'

/**
 * @description Method to get means of payment both arguments have in common
 * @param mopsA payment methods mapped to currency
 * @param mopsB payment methods mapped to currency
 * @returns means of payment both arguments have in common
 */
export const getMoPsInCommon = (mopsA: MeansOfPayment, mopsB: MeansOfPayment): MeansOfPayment =>
  intersect<Currency>(Object.keys(mopsA) as Currency[], Object.keys(mopsB) as Currency[]).reduce((mops, c: Currency) => {
    const intersection = intersect(mopsA[c]!, mopsB[c]!)
    if (intersection.length === 0) return mops

    return {
      ...mops,
      [c]: intersection,
    }
  }, {} as MeansOfPayment)
