import { decryptSymmetricKey } from './decryptSymmetricKey'

const decryptMock = jest.fn()
const verifyMock = jest.fn()
jest.mock('../../../utils/pgp', () => ({
  decrypt: (...args: unknown[]) => decryptMock(...args),
  verify: (...args: unknown[]) => verifyMock(...args),
}))

describe('decryptSymmetricKey', () => {
  it('should return symmetric key and null', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    const symmetricKey = 'symmetric key'
    decryptMock.mockReturnValue(symmetricKey)
    verifyMock.mockReturnValue(true)
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted, symmetricKeySignature, pgpPublicKey)
    expect(symmetricKeyResult).toEqual(symmetricKey)
  })
  it('should handle failed decryption', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    decryptMock.mockImplementation(() => {
      throw new Error('DECRYPTION_FAILED')
    })
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted, symmetricKeySignature, pgpPublicKey)
    expect(symmetricKeyResult).toEqual(null)
  })
  it('should handle invalid signature', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'invalid symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    const symmetricKey = 'symmetric key'
    decryptMock.mockReturnValue(symmetricKey)
    verifyMock.mockReturnValue(false)
    const symmetricKeyResult = await decryptSymmetricKey(symmetricKeyEncrypted, symmetricKeySignature, pgpPublicKey)
    expect(symmetricKeyResult).toEqual(symmetricKey)
  })
})
