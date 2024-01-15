import OpenPGP from 'react-native-fast-openpgp'
import { renderHook, waitFor } from 'test-utils'
import { contract } from '../../../peach-api/src/testData/contract'
import { defaultUser } from '../../../peach-api/src/testData/user'
import { account1 } from '../../../tests/unit/data/accountData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useAccountStore } from '../../utils/account/account'
import { error } from '../../utils/log/error'
import { useDecryptedContractData } from './useDecryptedContractData'

jest.useFakeTimers()

describe('useDecryptedContractData', () => {
  const symmetricKey = 'symmetricKey'
  const paymentDataEncrypted = 'paymentDataEncrypted'
  const paymentDataSignature = 'paymentDataSignature'
  const paymentData = { type: 'sepa' }
  const decryptSpy = jest.spyOn(OpenPGP, 'decrypt')
  const decryptSymmetricSpy = jest.spyOn(OpenPGP, 'decryptSymmetric')
  const verifySpy = jest.spyOn(OpenPGP, 'verify').mockResolvedValue(true)

  const mockContract = {
    ...contract,
    symmetricKeyEncrypted: 'symmetricKeyEncrypted',
    symmetricKeySignature: 'symmetricKeySignature',
    paymentDataEncrypted,
    paymentDataSignature,
    paymentDataEncryptionMethod: 'aes256' as const,
    seller: defaultUser,
  }

  beforeAll(() => {
    useAccountStore.getState().setAccount(account1)
  })
  afterEach(() => {
    queryClient.clear()
  })
  it('decrypts payment data with symmetric key', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey)
    verifySpy.mockResolvedValueOnce(true)
    decryptSymmetricSpy.mockResolvedValue(JSON.stringify(paymentData))
    const { result } = renderHook(useDecryptedContractData, { initialProps: mockContract })

    await waitFor(() => {
      expect(decryptSymmetricSpy).toHaveBeenCalledWith(paymentDataEncrypted, symmetricKey, { cipher: 2 })
      expect(result.current.data?.paymentData).toEqual(paymentData)
      expect(result.current.isError).toBe(false)
    })
  })
  it('decrypts payment data with pgp private key', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey).mockResolvedValueOnce(JSON.stringify(paymentData))
    verifySpy.mockResolvedValueOnce(true)
    const { result } = renderHook(useDecryptedContractData, {
      initialProps: { ...mockContract, paymentDataEncryptionMethod: 'asymmetric' },
    })

    await waitFor(() => {
      expect(decryptSpy).toHaveBeenCalledWith(paymentDataEncrypted, account1.pgp.privateKey, '')
      expect(result.current.data?.paymentData).toEqual(paymentData)
      expect(result.current.isError).toBe(false)
    })
  })
  it('returns error if paymentDataEncrypted or paymentDataSignature is missing', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey)
    verifySpy.mockResolvedValueOnce(true)
    const { result } = renderHook(useDecryptedContractData, {
      // @ts-expect-error testing undefined
      initialProps: { ...mockContract, paymentDataEncrypted: undefined, paymentDataEncryptionMethod: 'asymmetric' },
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toStrictEqual(Error('MISSING_PAYMENT_DATA_SECRETS'))
      expect(result.current.data).toBeUndefined()
    })
  })
  it('returns error if paymentDataSignature is invalid for symmetric decryption', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey)
    verifySpy.mockResolvedValueOnce(true).mockResolvedValue(false)
    const { result } = renderHook(useDecryptedContractData, {
      initialProps: mockContract,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(error).toHaveBeenNthCalledWith(1, Error('PAYMENT_DATA_SIGNATURE_INVALID'))
      expect(result.current.error).toStrictEqual(Error('SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED'))
      expect(result.current.data).toBeUndefined()
    })
  })
  it('returns error if payment data cannot be parsed after symmetric decryption', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey)
    verifySpy.mockResolvedValueOnce(true)
    decryptSymmetricSpy.mockResolvedValue('lkjadvoi=(093')

    const { result } = renderHook(useDecryptedContractData, {
      initialProps: mockContract,
    })
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toStrictEqual(Error('SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED'))
      expect(result.current.data).toBeUndefined()
    })
  })
  it('returns error if paymentDataSignature is invalid for asymmetric decryption', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey)
    verifySpy.mockResolvedValueOnce(true).mockResolvedValue(false)

    const { result } = renderHook(useDecryptedContractData, {
      initialProps: { ...mockContract, paymentDataEncryptionMethod: 'asymmetric' },
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(error).toHaveBeenNthCalledWith(1, Error('PAYMENT_DATA_SIGNATURE_INVALID'))
      expect(result.current.error).toStrictEqual(Error('ASYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED'))
      expect(result.current.data).toBeUndefined()
    })
  })
  it('returns error if payment data cannot be parsed after asymmetric decryption', async () => {
    decryptSpy.mockResolvedValueOnce(symmetricKey).mockResolvedValueOnce('lkjadvoi=(093')
    verifySpy.mockResolvedValueOnce(true)

    const { result } = renderHook(useDecryptedContractData, {
      initialProps: { ...mockContract, paymentDataEncryptionMethod: 'asymmetric' },
    })
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.error).toStrictEqual(Error('ASYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED'))
      expect(result.current.data).toBeUndefined()
    })
  })
})
