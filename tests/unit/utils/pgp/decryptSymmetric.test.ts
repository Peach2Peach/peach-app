import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { decryptSymmetric } from '../../../../src/utils/pgp'
import { resetStorage } from '../../prepare'

jest.mock('react-native-fast-openpgp', () => ({
  decryptSymmetric: jest.fn(),
}))

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
