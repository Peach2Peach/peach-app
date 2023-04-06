import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '../account'
import { decryptSymmetric } from '.'
import { resetStorage } from '../../../tests/unit/prepare'

describe('decrypt', () => {
  beforeEach(async () => {
    resetStorage()
    await setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
      },
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls OpenPGP.decrypt with account private key', async () => {
    await decryptSymmetric('encrypted', 'passhphrase')
    expect(OpenPGP.decryptSymmetric).toHaveBeenCalledWith('encrypted', 'passhphrase', { cipher: 2 })
  })
})
