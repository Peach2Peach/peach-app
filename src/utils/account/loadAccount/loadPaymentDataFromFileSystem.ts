import { readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @deprecated
 */
export const loadPaymentDataFromFileSystem = async (password: string): Promise<LegacyAccount['paymentData']> => {
  try {
    const paymentData = await readFile('/peach-account-paymentData.json', password)
    return JSON.parse(paymentData)
  } catch (e) {
    error('Could not load payment data', parseError(e))
    return []
  }
}
