import { info } from '../../log'
import { accountStorage } from '../accountStorage'

export const storeIdentity = async (acc: Account) => {
  if (!acc.publicKey) throw new Error('ERROR_SAVE_ACCOUNT')

  info('Storing identity')
  await Promise.all([
    accountStorage.setMapAsync('identity', {
      publicKey: acc.publicKey,
      privKey: acc.privKey,
      mnemonic: acc.mnemonic,
      pgp: acc.pgp,
    }),
    accountStorage.setStringAsync('publicKey', acc.publicKey),
  ])
}
