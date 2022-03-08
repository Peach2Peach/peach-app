import { account } from '.'
import { writeFile } from '../fileUtils'


/**
 * @description Method to save account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const saveAccount = async (acc: Account, password: string): Promise<void> => {
  if (!acc.publicKey) throw new Error('Error saving account: Account has no public key!')
  const result = writeFile('/peach-account.json', JSON.stringify(account), password)
  if (!result) {
    // TODO add error handling
  }
}