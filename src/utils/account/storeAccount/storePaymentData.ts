import { writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save payment data
 * @param paymentData payment data
 * @param password secret
 * @returns promise resolving to encrypted payment data
 */
export const storePaymentData = async (paymentData: Account['paymentData'], password: string): Promise<void> => {
  info('Storing payment data')

  await writeFile('/peach-account-paymentData.json', JSON.stringify(paymentData), password)
}
