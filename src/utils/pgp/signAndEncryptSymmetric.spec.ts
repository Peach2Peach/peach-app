import OpenPGP from 'react-native-fast-openpgp'
import { account, defaultAccount, setAccount } from '../account'
import { signAndEncryptSymmetric } from '.'

describe('signAndEncryptSymmetric', () => {
  beforeEach(() => {
    setAccount({
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
    jest.spyOn(OpenPGP, 'sign').mockResolvedValueOnce('signature')
    jest.spyOn(OpenPGP, 'encryptSymmetric').mockResolvedValueOnce('encrypted')

    const result = await signAndEncryptSymmetric('message', 'password')
    expect(OpenPGP.sign).toHaveBeenCalledWith('message', account.pgp.publicKey, account.pgp.privateKey, '')
    expect(OpenPGP.encryptSymmetric).toHaveBeenCalledWith('message', 'password', undefined, { cipher: 2 })
    expect(result).toEqual({
      signature: 'signature',
      encrypted: 'encrypted',
    })
  })
})
