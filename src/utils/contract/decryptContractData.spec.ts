import { decryptContractData } from '.'
import { decryptSymmetricKey } from '../../views/contract/helpers/decryptSymmetricKey'
import { getPaymentData } from '../../views/contract/helpers/getPaymentData'

jest.mock('../../views/contract/helpers/getPaymentData', () => ({
  getPaymentData: jest.fn(),
}))
jest.mock('../../views/contract/helpers/decryptSymmetricKey', () => ({
  decryptSymmetricKey: jest.fn(),
}))

describe('decryptContractData', () => {
  const contract: Partial<Contract> = {
    symmetricKeyEncrypted: 'some_encrypted_key',
    symmetricKeySignature: 'some_signature',
    buyer: {
      pgpPublicKey: 'some_public_key',
    } as User,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return symmetric key and payment data when decryption is successful', async () => {
    const symmetricKey = 'some_symmetric_key'
    const paymentData = 'some_payment_data'
    ;(decryptSymmetricKey as jest.Mock).mockResolvedValue([symmetricKey, null])
    ;(getPaymentData as jest.Mock).mockResolvedValue([paymentData, null])

    const result = await decryptContractData(contract as Contract)

    expect(result).toEqual({
      symmetricKey,
      paymentData,
    })
  })

  it('should return null when payment data decryption fails', async () => {
    const symmetricKey = 'some_symmetric_key'
    const decryptionError = 'some_decryption_error'
    ;(decryptSymmetricKey as jest.Mock).mockResolvedValue([symmetricKey, null])
    ;(getPaymentData as jest.Mock).mockResolvedValue([null, decryptionError])

    const result = await decryptContractData(contract as Contract)

    expect(result).toEqual({
      symmetricKey,
      paymentData: null,
    })
  })

  it('should return null and payment data when symmetric key decryption fails', async () => {
    const decryptionError = 'some_decryption_error'
    ;(decryptSymmetricKey as jest.Mock).mockResolvedValue([null, decryptionError])

    const result = await decryptContractData(contract as Contract)

    expect(result).toEqual({
      symmetricKey: null,
      paymentData: null,
    })
  })
})
