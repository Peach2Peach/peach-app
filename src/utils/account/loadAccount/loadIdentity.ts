import { readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @description Method to load account identity
 * @param password password
 * @returns Promise resolving to account identity
 */
export const loadIdentity = async (password: string) => {
  try {
    const identity = await readFile('/peach-account-identity.json', password)
    return JSON.parse(identity)
  } catch (e) {
    error('Could not load identity', parseError(e))
    return {
      publicKey: '',
      privKey: '',
      mnemonic: '',
      pgp: {
        publicKey: '',
        privateKey: '',
      },
    }
  }
}
