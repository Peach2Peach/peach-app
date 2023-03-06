import OpenPGP from 'react-native-fast-openpgp'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { signAndEncrypt } from '../../../../src/utils/pgp'
import { resetStorage } from '../../prepare'

jest.mock('react-native-fast-openpgp', () => ({
  sign: jest.fn(),
  encrypt: jest.fn(),
}))

describe('signAndEncrypt', () => {
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

  it('signs and encrypts the message', async () => {
    ;(<jest.Mock>OpenPGP.sign).mockResolvedValueOnce('signature')
    ;(<jest.Mock>OpenPGP.encrypt).mockResolvedValueOnce('encrypted')

    const result = await signAndEncrypt('message', 'publicKey')
    expect(OpenPGP.sign).toHaveBeenCalledWith('message', account.pgp.publicKey, account.pgp.privateKey, '')
    expect(OpenPGP.encrypt).toHaveBeenCalledWith('message', 'publicKey')
    expect(result).toEqual({
      signature: 'signature',
      encrypted: 'encrypted',
    })
  })
})
