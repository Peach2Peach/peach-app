import { intersect } from '../array'

export const getMoPsInCommon = (mopsA: MeansOfPayment, mopsB: MeansOfPayment): MeansOfPayment =>
  intersect<Currency>(Object.keys(mopsA) as Currency[], Object.keys(mopsB) as Currency[]).reduce((mops, c: Currency) => {
    const intersection = intersect(mopsA[c]!, mopsB[c]!)
    if (intersection.length === 0) return mops

    return {
      ...mops,
      [c]: intersection,
    }
  }, {} as MeansOfPayment)
