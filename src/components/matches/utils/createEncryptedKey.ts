import { account } from '../../../utils/account'
import { getRandom } from '../../../utils/crypto'
import { signAndEncrypt } from '../../../utils/pgp'

export const createEncryptedKey = async (match: Match) =>
  signAndEncrypt((await getRandom(256)).toString('hex'), [account.pgp.publicKey, match.user.pgpPublicKey].join('\n'))
