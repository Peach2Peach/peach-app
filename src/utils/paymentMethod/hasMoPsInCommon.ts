import { getMoPsInCommon } from '../paymentMethod/getMoPsInCommon'

/**
 * @description Method to get means of payment both arguments have in common
 * @param mopsA payment methods mapped to currency
 * @param mopsB payment methods mapped to currency
 * @returns means of payment both arguments have in common
 */
export const hasMoPsInCommon = (mopsA: MeansOfPayment, mopsB: MeansOfPayment): boolean =>
  JSON.stringify(getMoPsInCommon(mopsA, mopsB)) !== '{}'
