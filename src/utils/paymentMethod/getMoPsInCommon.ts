import { intersect } from '../array'
import { keys } from '../object'

export const getMoPsInCommon = (mopsA: MeansOfPayment, mopsB: MeansOfPayment): MeansOfPayment =>
  intersect(keys(mopsA), keys(mopsB)).reduce((mops, c: Currency) => {
    const intersection = intersect(mopsA[c]!, mopsB[c]!)
    if (intersection.length === 0) return mops

    return {
      ...mops,
      [c]: intersection,
    }
  }, {} as MeansOfPayment)
