/* eslint-disable max-lines-per-function */
import OpenPGP from 'react-native-fast-openpgp'
import { account1, seller } from '../../../tests/unit/data/accountData'
import { useAccountStore } from '../../utils/account/account'
import { decryptPaymentData } from './decryptPaymentData'

describe('decryptPaymentData', () => {
  const symmetricKey = 'symmetricKey'
  const paymentDataEncrypted = 'paymentDataEncrypted'
  const paymentDataSignature = 'paymentDataSignature'
  const user = seller as unknown as PublicUser
  const paymentData = { type: 'sepa' }
  const decryptSpy = jest.spyOn(OpenPGP, 'decrypt')
  const decryptSymmetricSpy = jest.spyOn(OpenPGP, 'decryptSymmetric')
  const verifySpy = jest.spyOn(OpenPGP, 'verify').mockResolvedValue(true)

  beforeAll(() => {
    useAccountStore.getState().setAccount(account1)
  })
  it('decrypts payment data with symmetric key', async () => {
    decryptSymmetricSpy.mockResolvedValue(JSON.stringify(paymentData))
    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'aes256' },
      symmetricKey,
    )
    expect(decryptSymmetricSpy).toHaveBeenCalledWith(paymentDataEncrypted, symmetricKey, { cipher: 2 })
    expect(result).toEqual(paymentData)
    expect(error).toBeUndefined()
  })
  it('decrypts payment data with pgp private key', async () => {
    decryptSpy.mockResolvedValue(JSON.stringify(paymentData))
    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'asymmetric' },
      symmetricKey,
    )
    expect(decryptSpy).toHaveBeenCalledWith(paymentDataEncrypted, account1.pgp.privateKey, '')
    expect(result).toEqual(paymentData)
    expect(error).toBeUndefined()
  })
  it('returns error if paymentDataEncrypted or paymentDataSignature is missing', async () => {
    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted: undefined, paymentDataSignature, user, paymentDataEncryptionMethod: 'asymmetric' },
      null,
    )
    expect(error).toBe('MISSING_PAYMENT_DATA_SECRETS')
    expect(result).toBeUndefined()
  })
  it('returns error if paymentDataSignature is invalid for symmetric decryption', async () => {
    verifySpy.mockResolvedValueOnce(false)

    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'aes256' },
      symmetricKey,
    )
    expect(error).toBe('PAYMENT_DATA_SIGNATURE_INVALID')
    expect(result).toBeUndefined()
  })
  it('returns error if payment data cannot be parsed after symmetric decryption', async () => {
    decryptSymmetricSpy.mockResolvedValue('lkjadvoi=(093')

    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'aes256' },
      symmetricKey,
    )
    expect(error).toBe('SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED')
    expect(result).toBeUndefined()
  })
  it('returns error if paymentDataSignature is invalid for asymmetric decryption', async () => {
    verifySpy.mockResolvedValueOnce(false)

    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'asymmetric' },
      symmetricKey,
    )
    expect(error).toBe('PAYMENT_DATA_SIGNATURE_INVALID')
    expect(result).toBeUndefined()
  })
  it('returns error if payment data cannot be parsed after asymmetric decryption', async () => {
    decryptSpy.mockResolvedValue('lkjadvoi=(093')

    const { result, error } = await decryptPaymentData(
      { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod: 'asymmetric' },
      symmetricKey,
    )
    expect(error).toBe('PAYMENT_DATA_ENCRYPTION_FAILED')
    expect(result).toBeUndefined()
  })
})
