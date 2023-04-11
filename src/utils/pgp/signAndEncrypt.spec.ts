import OpenPGP from 'react-native-fast-openpgp'
import { account, defaultAccount, setAccount } from '../account'
import { signAndEncrypt } from '.'

describe('signAndEncrypt', () => {
  beforeEach(async () => {
    await setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
      },
    })
  })

  it('signs and encrypts the message', async () => {
    jest.spyOn(OpenPGP, 'sign').mockResolvedValueOnce('signature')
    jest.spyOn(OpenPGP, 'encrypt').mockResolvedValueOnce('encrypted')

    const result = await signAndEncrypt('message', 'publicKey')
    expect(OpenPGP.sign).toHaveBeenCalledWith('message', account.pgp.publicKey, account.pgp.privateKey, '')
    expect(OpenPGP.encrypt).toHaveBeenCalledWith('message', 'publicKey')
    expect(result).toEqual({
      signature: 'signature',
      encrypted: 'encrypted',
    })
  })
})
