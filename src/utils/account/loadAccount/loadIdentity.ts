import { error } from '../../log'
import { accountStorage } from '../accountStorage'

const emptyIdentity: Identity = {
  publicKey: '',
  privKey: '',
  mnemonic: '',
  pgp: {
    publicKey: '',
    privateKey: '',
  },
}

export const loadIdentity = () => {
  const identity = accountStorage.getMap('identity')

  if (identity) return identity as Identity

  error('Could not load identity')
  return emptyIdentity
}
