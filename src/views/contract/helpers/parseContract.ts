import { error, info } from '../../../utils/log'
import { decrypt, decryptSymmetric, verify } from '../../../utils/pgp'

export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKey: string,
): Promise<[string | null, string | null]> => {
  let symmetricKey
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    if (!(await verify(symmetricKeySignature, symmetricKey, pgpPublicKey))) {
      // TODO at this point we should probably cancel the offer/contract?
      // problem how can buyer app proof that the symmetric is indeed wrong?
      error('INVALID_SIGNATURE')
      return [symmetricKey, 'INVALID_SIGNATURE']
    }
  } catch (err) {
    error(new Error('DECRYPTION_FAILED'))
    return [null, 'DECRYPTION_FAILED']
  }

  return [symmetricKey, null]
}

export const getPaymentData = async (contract: Contract): Promise<[PaymentData | null, Error | null]> => {
  let decryptedPaymentData: PaymentData | null = null

  if (!contract.symmetricKey) return [null, new Error('NO_SYMMETRIC_KEY')]
  if (contract.paymentData) return [contract.paymentData, null]
  if (!contract.paymentDataEncrypted || !contract.paymentDataSignature) return [null, new Error('MISSING_PAYMENTDATA')]

  let decryptedPaymentDataString
  try {
    decryptedPaymentDataString = await decryptSymmetric(contract.paymentDataEncrypted, contract.symmetricKey)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')]
  }
  try {
    if (!(await verify(contract.paymentDataSignature, decryptedPaymentDataString, contract.seller.pgpPublicKey))) {
      // TODO at this point we should probably cancel the order?
      // problem how can buyer app proof that the payment data is indeed wrong?
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
  }

  // TODO check payment data hash with actual data
  return [decryptedPaymentData, null]
}

/**
 * @description Method to parse contract data
 * @param contract the contract
 * @returns symmetric key and decrypted payment data
 */
export const parseContract = async (contract: Contract) => {
  let symmetricKey = contract?.symmetricKey
  if (!symmetricKey) {
    info('No symmetric key found, decrypting')

    const [symmetricKeyResult, err] = await decryptSymmetricKey(
      contract.symmetricKeyEncrypted,
      contract.symmetricKeySignature,
      contract.buyer.pgpPublicKey,
    )

    if (err) error(err)

    if (symmetricKeyResult) {
      info('Symmetric decryption success')
      symmetricKey = symmetricKeyResult
    }
  }

  let paymentData = contract?.paymentData
  if (!paymentData && symmetricKey) {
    info('No decrypted payment data found, decrypting')

    const [paymentDataResult, getPaymentDataError] = await getPaymentData({
      ...contract,
      symmetricKey,
    })

    if (getPaymentDataError) error(getPaymentDataError)

    if (paymentDataResult) {
      info('Payment data decryption, success')
      // TODO if err is yielded consider open a dispute directly
      paymentData = paymentDataResult
    }
  }

  return {
    symmetricKey,
    paymentData,
  }
}
