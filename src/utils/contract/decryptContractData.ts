import { decryptSymmetricKey } from '../../views/contract/helpers'
import { error, info } from '../log'
import { decryptSymmetric, verify } from '../pgp'

export const decryptContractData = async (contract: Contract) => {
  info('decryptContractData - decrypting symmetric key')

  const [symmetricKey, err] = await decryptSymmetricKey(
    contract.symmetricKeyEncrypted,
    contract.symmetricKeySignature,
    contract.buyer.pgpPublicKey,
  )

  if (!symmetricKey || err) {
    error(err)
    return {
      symmetricKey,
      paymentData: null,
    }
  }
  info('Symmetric decryption success')
  info('decryptContractData - decrypting payment data')

  const [paymentData, getPaymentDataError] = await getPaymentData(contract, symmetricKey)

  if (paymentData) {
    info('Payment data decryption, success')
  } else {
    error(getPaymentDataError)
  }

  return {
    symmetricKey,
    paymentData,
  }
}

async function getPaymentData (contract: Contract, symmetricKey: string) {
  const { paymentData, paymentDataEncrypted, paymentDataSignature, seller } = contract

  if (paymentData) return [paymentData, null]
  if (!paymentDataEncrypted || !paymentDataSignature) return [null, new Error('MISSING_PAYMENTDATA')]

  let decryptedPaymentData: PaymentData | null = null
  let decryptedPaymentDataString
  try {
    decryptedPaymentDataString = await decryptSymmetric(paymentDataEncrypted, symmetricKey)
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')]
  }
  try {
    if (!(await verify(paymentDataSignature, decryptedPaymentDataString, seller.pgpPublicKey))) {
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
  }

  return [decryptedPaymentData, null]
}
