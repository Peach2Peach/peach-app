import { exists, readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

const emptyIdentity: Identity = {
  publicKey: '',
  privKey: '',
  mnemonic: '',
  pgp: {
    publicKey: '',
    privateKey: '',
  },
}

/**
 * @description Method to load account identity
 * @param password password
 * @returns Promise resolving to account identity
 */
export const loadIdentity = async (password: string): Promise<Identity> => {
  if (!(await exists('/peach-account-identity.json'))) return emptyIdentity

  try {
    const identity = await readFile('/peach-account-identity.json', password)
    return JSON.parse(identity)
  } catch (e) {
    error('Could not load identity', parseError(e))
    return emptyIdentity
  }
}
