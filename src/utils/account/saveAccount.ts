import { account } from '.'
import { writeFile } from '../file'

/**
 * @description Method to save account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const saveAccount = async (acc: Account, password: string): Promise<void> => {
  if (!acc.publicKey) throw new Error('error.ERROR_SAVE_ACCOUNT')
  await writeFile('/peach-account.json', JSON.stringify(account), password)
}