import { info } from '../../log'
import { accountStorage } from '../accountStorage'

export const storeIdentity = async (identity: Identity) => {
  if (!identity.publicKey) throw new Error('ERROR_SAVE_ACCOUNT')

  info('storeIdentity - Storing identity')
  await Promise.all([
    accountStorage.setMapAsync('identity', {
      publicKey: identity.publicKey,
      privKey: identity.privKey,
      mnemonic: identity.mnemonic,
      pgp: identity.pgp,
    }),
    accountStorage.setStringAsync('publicKey', identity.publicKey),
  ])
}
