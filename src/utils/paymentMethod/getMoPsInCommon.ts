import { intersect } from '../array/intersect'
import { keys } from '../object'

export const getMoPsInCommon = (mopsA: MeansOfPayment, mopsB: MeansOfPayment): MeansOfPayment =>
  intersect<Currency>(keys(mopsA), keys(mopsB)).reduce((mops, c: Currency) => {
    const firstMeansOfPayment = mopsA[c]
    const secondMeansOfPayment = mopsB[c]
    if (!firstMeansOfPayment || !secondMeansOfPayment) return mops
    const intersection = intersect(firstMeansOfPayment, secondMeansOfPayment)
    if (intersection.length === 0) return mops

    return {
      ...mops,
      [c]: intersection,
    }
  }, {} as MeansOfPayment)
