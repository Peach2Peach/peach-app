import { error } from '../utils/log/error'
import { info } from '../utils/log/info'
import { updateUser } from '../utils/peachAPI/updateUser'

export const publishPGPPublicKey = async (pgp: PGPKeychain) => {
  try {
    const { result, error: err } = await updateUser({ pgp })

    if (result) {
      info('Set PGP for user', pgp.publicKey)
    } else {
      error('PGP could not be set', JSON.stringify(err))
    }
  } catch (e) {
    error(e)
  }
}
