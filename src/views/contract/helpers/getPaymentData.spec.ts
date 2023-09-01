import { getPaymentData } from './getPaymentData'

const decryptSymmetricMock = jest.fn()
const verifyMock = jest.fn()
jest.mock('../../../utils/pgp', () => ({
  decryptSymmetric: (...args: unknown[]) => decryptSymmetricMock(...args),
  verify: (...args: unknown[]) => verifyMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('getPaymentData', () => {
  it('should handle missing symmetric key', async () => {
    const contract = {
      paymentData: 'payment data',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual(null)
    expect(error).toEqual(new Error('NO_SYMMETRIC_KEY'))
  })
  it('should return payment data and null if it exists on the contract', async () => {
    const contract = {
      symmetricKey: 'symmetric key',
      paymentData: 'payment data',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual('payment data')
    expect(error).toEqual(null)
  })
  it('should handle missing payment data encrypted', async () => {
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual(null)
    expect(error).toEqual(new Error('MISSING_PAYMENTDATA'))
  })
  it('should handle missing payment data signature', async () => {
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataEncrypted: 'encrypted payment data',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual(null)
    expect(error).toEqual(new Error('MISSING_PAYMENTDATA'))
  })
  it('should handle invalid payment data', async () => {
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual(null)
    expect(error).toEqual(new Error('INVALID_PAYMENTDATA'))
  })
  it('should handle invalid signature', async () => {
    decryptSymmetricMock.mockImplementation(() => JSON.stringify({}))
    verifyMock.mockResolvedValue(false)
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual({})
    expect(error).toEqual(new Error('INVALID_SIGNATURE'))
  })
  it('should handle verification error', async () => {
    decryptSymmetricMock.mockImplementation(() => JSON.stringify({}))
    verifyMock.mockRejectedValue(new Error('error'))
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual({})
    expect(error).toEqual(new Error('INVALID_SIGNATURE'))
  })
  it('should return decrypted payment data and null if everything is valid', async () => {
    decryptSymmetricMock.mockImplementation(() => JSON.stringify({}))
    verifyMock.mockImplementation(() => true)
    const contract = {
      symmetricKey: 'symmetric key',
      paymentDataEncrypted: 'encrypted payment data',
      paymentDataSignature: 'payment data signature',
      seller: {
        pgpPublicKey: 'pgp public key',
      },
    } as unknown as Contract
    const [paymentDataResult, error] = await getPaymentData(contract)
    expect(paymentDataResult).toEqual({})
    expect(error).toEqual(null)
  })
})
