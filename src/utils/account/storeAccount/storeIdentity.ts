import { writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save account settings
 * @param settings settings
 * @param password secret
 * @returns promise resolving to encrypted settings
 */
export const storeIdentity = async (acc: Account, password: string): Promise<void> => {
  if (!acc.publicKey) throw new Error('error.ERROR_SAVE_ACCOUNT')

  info('Storing identity')
  await writeFile(
    '/peach-account-identity.json',
    JSON.stringify({
      publicKey: acc.publicKey,
      privKey: acc.privKey,
      mnemonic: acc.mnemonic,
      pgp: acc.pgp,
    }),
    password,
  )
}
