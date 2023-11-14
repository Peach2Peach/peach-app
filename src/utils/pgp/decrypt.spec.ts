import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '../account'
import { useAccountStore } from '../account/account'
import { decrypt } from './decrypt'

describe('decrypt', () => {
  beforeEach(() => {
    setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
      },
    })
  })
  it('calls OpenPGP.decrypt with account private key', async () => {
    await decrypt('encrypted')
    const privateKey = useAccountStore.getState().account.pgp.privateKey
    expect(OpenPGP.decrypt).toHaveBeenCalledWith('encrypted', privateKey, '')
  })
})
